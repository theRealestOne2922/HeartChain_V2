"""
Payment API endpoints - Razorpay integration and webhook handling.
This is the core of the UPI to Blockchain bridge.
"""

from fastapi import APIRouter, HTTPException, Request, Header
from typing import Optional, Dict, Any
import logging

from ..models import PaymentOrderRequest, PaymentOrderResponse, WebhookPayload
from ..services import get_database, get_blockchain, get_payment
from ..config import settings

router = APIRouter(prefix="/payments", tags=["Payments"])
logger = logging.getLogger(__name__)


@router.post("/create-order", response_model=PaymentOrderResponse)
async def create_payment_order(order_request: PaymentOrderRequest):
    """
    Create a Razorpay order to initiate payment.
    
    This is called by the frontend when user clicks "Donate".
    The returned order_id is used to open Razorpay checkout.
    
    - **amount**: Amount in paise (1 INR = 100 paise)
    - **campaign_id**: UUID of the campaign being donated to
    - **donor_name**: Optional donor name
    - **donor_email**: Optional donor email
    - **is_anonymous**: Whether to hide donor identity
    - **message**: Optional donation message
    """
    payment = get_payment()
    db = get_database()
    
    try:
        # Verify campaign exists
        campaign = await db.get_campaign(order_request.campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        # Create Razorpay order
        order = await payment.create_order(
            amount_in_paise=order_request.amount,
            campaign_id=order_request.campaign_id,
            donor_name=order_request.donor_name,
            donor_email=order_request.donor_email,
            is_anonymous=order_request.is_anonymous,
            message=order_request.message
        )
        
        return PaymentOrderResponse(**order)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create payment order: {e}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")


@router.post("/verify")
async def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str
) -> Dict[str, Any]:
    """
    Verify payment signature after successful checkout.
    
    This is called by the frontend after Razorpay checkout completes.
    It verifies the payment was successful and not tampered with.
    """
    payment = get_payment()
    
    try:
        is_valid = payment.verify_payment_signature(
            order_id=razorpay_order_id,
            payment_id=razorpay_payment_id,
            signature=razorpay_signature
        )
        
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        return {
            "verified": True,
            "payment_id": razorpay_payment_id,
            "message": "Payment verified successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment verification failed: {e}")
        raise HTTPException(status_code=500, detail="Payment verification failed")


@router.post("/webhook/razorpay")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(None)
):
    """
    Razorpay webhook endpoint for payment events.
    
    This is called by Razorpay when payment status changes.
    It handles the complete flow:
    1. Verify webhook signature
    2. Extract payment details
    3. Save donation to database
    4. Record on blockchain
    5. Update database with tx hash
    
    Configure this URL in Razorpay Dashboard → Webhooks
    """
    payment_service = get_payment()
    db = get_database()
    blockchain = get_blockchain()
    
    # Get raw body for signature verification
    body = await request.body()
    
    # Verify webhook signature
    if x_razorpay_signature:
        is_valid = payment_service.verify_webhook_signature(
            payload_body=body,
            signature=x_razorpay_signature
        )
        if not is_valid:
            logger.warning("Invalid webhook signature received")
            raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Parse webhook payload
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    
    event = payload.get("event", "")
    
    # Only process successful payments
    if event != "payment.captured":
        logger.info(f"Ignoring webhook event: {event}")
        return {"status": "ignored", "event": event}
    
    # Extract payment details
    try:
        payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
        
        if not payment_entity:
            raise HTTPException(status_code=400, detail="Missing payment entity")
        
        notes = payment_entity.get("notes", {})
        
        # Check if already processed
        existing = await db.get_donation_by_razorpay_id(payment_entity.get("id"))
        if existing:
            logger.info(f"Payment {payment_entity.get('id')} already processed")
            return {
                "status": "already_processed",
                "donation_id": existing.get("id"),
                "tx_hash": existing.get("blockchain_tx_hash")
            }
        
        # Prepare donation data
        donation_data = {
            "campaign_id": notes.get("campaign_id"),
            "donor_name": notes.get("donor_name", "Anonymous"),
            "donor_email": payment_entity.get("email"),
            "amount": payment_entity.get("amount", 0) / 100,  # Convert paise to INR
            "payment_method": payment_entity.get("method", "unknown"),
            "razorpay_payment_id": payment_entity.get("id"),
            "is_anonymous": notes.get("is_anonymous", "false").lower() == "true",
            "message": notes.get("message"),
        }
        
        logger.info(f"Processing donation: {donation_data}")
        
        # Step 1: Save to database
        saved_donation = await db.create_donation(donation_data)
        donation_id = saved_donation.get("id")
        
        # Step 2: Record on blockchain
        tx_hash = await blockchain.record_donation(
            campaign_id=donation_data["campaign_id"],
            amount_in_paise=payment_entity.get("amount", 0),
            donor_email=donation_data.get("donor_email"),
            payment_method=donation_data["payment_method"],
            is_anonymous=donation_data["is_anonymous"]
        )
        
        # Step 3: Update database with tx hash
        await db.update_donation_tx_hash(donation_id, tx_hash)
        
        # Step 4: Update campaign stats
        await db.update_campaign_stats(
            campaign_id=donation_data["campaign_id"],
            amount=donation_data["amount"]
        )
        
        logger.info(f"✅ Donation {donation_id} recorded with tx hash: {tx_hash}")
        
        return {
            "status": "success",
            "donation_id": donation_id,
            "blockchain_tx_hash": tx_hash,
            "explorer_url": blockchain.get_explorer_url(tx_hash)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/config")
async def get_payment_config() -> Dict[str, Any]:
    """
    Get Razorpay public configuration for frontend.
    
    Returns the public key needed to initialize Razorpay checkout.
    """
    return {
        "key_id": settings.razorpay_key_id,
        "currency": "INR",
        "name": "HeartChain",
        "description": "Transparent Blockchain Donations",
        "theme_color": "#e63355"
    }
