"""
Payment Service - Razorpay Integration
Handles payment order creation and webhook verification.
"""

from functools import lru_cache
from typing import Optional, Dict, Any
import razorpay
import hmac
import hashlib
import logging

from ..config import settings

logger = logging.getLogger(__name__)


class PaymentService:
    """Service for Razorpay payment operations."""
    
    def __init__(self):
        """Initialize Razorpay client."""
        self.is_configured = False
        
        if not settings.razorpay_key_id or not settings.razorpay_key_secret:
            logger.warning("Razorpay credentials not configured. Payments will fail.")
            self.client = None
            return
        
        try:
            self.client = razorpay.Client(
                auth=(settings.razorpay_key_id, settings.razorpay_key_secret)
            )
            self.is_configured = True
            logger.info("Razorpay payment service initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Razorpay client: {e}")
            self.client = None
    
    def _check_client(self):
        """Ensure client is initialized."""
        if not self.client:
            raise Exception("Razorpay client not initialized. Check your API keys.")
    
    async def create_order(
        self,
        amount_in_paise: int,
        campaign_id: str,
        donor_name: Optional[str] = None,
        donor_email: Optional[str] = None,
        is_anonymous: bool = False,
        message: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a Razorpay order for payment.
        
        Args:
            amount_in_paise: Amount in paise (1 INR = 100 paise)
            campaign_id: UUID of the campaign
            donor_name: Optional donor name
            donor_email: Optional donor email
            is_anonymous: Whether donation is anonymous
            message: Optional donation message
            
        Returns:
            Dictionary containing order_id, amount, currency, and key_id
        """
        self._check_client()
        
        # Prepare notes for the order (will be available in webhook)
        notes = {
            "campaign_id": campaign_id,
            "donor_name": donor_name or "Anonymous",
            "is_anonymous": str(is_anonymous).lower(),
        }
        if message:
            notes["message"] = message[:200]  # Limit message length
        
        # Create order
        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "notes": notes,
            "receipt": f"hc_{campaign_id[:8]}_{amount_in_paise}",
        }
        
        try:
            order = self.client.order.create(data=order_data)
            
            logger.info(f"Created Razorpay order: {order.get('id')}")
            
            return {
                "order_id": order.get("id"),
                "amount": order.get("amount"),
                "currency": order.get("currency"),
                "key_id": settings.razorpay_key_id,
            }
            
        except Exception as e:
            logger.error(f"Failed to create Razorpay order: {e}")
            raise
    
    def verify_webhook_signature(
        self,
        payload_body: bytes,
        signature: str
    ) -> bool:
        """
        Verify Razorpay webhook signature for security.
        
        Args:
            payload_body: Raw request body bytes
            signature: X-Razorpay-Signature header value
            
        Returns:
            True if signature is valid, False otherwise
        """
        if not settings.razorpay_webhook_secret:
            logger.warning("Webhook secret not configured. Skipping verification.")
            return True  # Allow in development
        
        try:
            expected_signature = hmac.new(
                settings.razorpay_webhook_secret.encode(),
                payload_body,
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(expected_signature, signature)
            
        except Exception as e:
            logger.error(f"Webhook signature verification failed: {e}")
            return False
    
    def verify_payment_signature(
        self,
        order_id: str,
        payment_id: str,
        signature: str
    ) -> bool:
        """
        Verify Razorpay payment signature.
        
        Args:
            order_id: Razorpay order ID
            payment_id: Razorpay payment ID
            signature: Razorpay signature from frontend
            
        Returns:
            True if signature is valid
        """
        self._check_client()
        
        try:
            self.client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
            })
            return True
        except razorpay.errors.SignatureVerificationError:
            logger.warning(f"Payment signature verification failed for {payment_id}")
            return False
    
    async def get_payment(self, payment_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetch payment details from Razorpay.
        
        Args:
            payment_id: Razorpay payment ID
            
        Returns:
            Payment details dictionary
        """
        self._check_client()
        
        try:
            payment = self.client.payment.fetch(payment_id)
            return payment
        except Exception as e:
            logger.error(f"Failed to fetch payment {payment_id}: {e}")
            return None
    
    async def refund_payment(
        self,
        payment_id: str,
        amount_in_paise: Optional[int] = None,
        reason: str = "Donation cancelled"
    ) -> Optional[Dict[str, Any]]:
        """
        Initiate a refund for a payment.
        
        Args:
            payment_id: Razorpay payment ID
            amount_in_paise: Optional partial refund amount (full refund if None)
            reason: Reason for refund
            
        Returns:
            Refund details dictionary
        """
        self._check_client()
        
        try:
            refund_data = {
                "speed": "normal",
                "notes": {"reason": reason}
            }
            
            if amount_in_paise:
                refund_data["amount"] = amount_in_paise
            
            refund = self.client.payment.refund(payment_id, refund_data)
            logger.info(f"Refund initiated for payment {payment_id}: {refund.get('id')}")
            return refund
            
        except Exception as e:
            logger.error(f"Failed to refund payment {payment_id}: {e}")
            return None


@lru_cache()
def get_payment() -> PaymentService:
    """Get cached payment service instance."""
    return PaymentService()
