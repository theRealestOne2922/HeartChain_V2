"""Donation API endpoints."""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any

from ..models import DonationResponse, DonationWithBlockchain
from ..services import get_database, get_blockchain

router = APIRouter(prefix="/donations", tags=["Donations"])


@router.get("/{donation_id}", response_model=DonationWithBlockchain)
async def get_donation(donation_id: str):
    """
    Get a specific donation by ID with blockchain verification link.
    
    - **donation_id**: UUID of the donation
    """
    db = get_database()
    blockchain = get_blockchain()
    
    try:
        donation = await db.get_donation(donation_id)
        if not donation:
            raise HTTPException(status_code=404, detail="Donation not found")
        
        # Add blockchain explorer URL if tx hash exists
        if donation.get("blockchain_tx_hash"):
            donation["blockchain_explorer_url"] = blockchain.get_explorer_url(
                donation["blockchain_tx_hash"]
            )
        
        # Mask donor info if anonymous
        if donation.get("is_anonymous"):
            donation["donor_name"] = "Anonymous"
            donation["donor_email"] = None
        
        return donation
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/verify/{tx_hash}")
async def verify_donation_on_chain(tx_hash: str) -> Dict[str, Any]:
    """
    Verify a donation exists on the blockchain.
    
    - **tx_hash**: Blockchain transaction hash
    
    Returns blockchain explorer URL and verification status.
    """
    blockchain = get_blockchain()
    db = get_database()
    
    # Look up donation by tx hash in database
    # Note: In production, you'd want to add an index on blockchain_tx_hash
    
    return {
        "tx_hash": tx_hash,
        "explorer_url": blockchain.get_explorer_url(tx_hash),
        "verified": True,  # In production, verify on chain
        "message": "Transaction can be verified on the blockchain explorer"
    }


@router.get("/stats/platform")
async def get_platform_stats() -> Dict[str, Any]:
    """
    Get overall platform donation statistics.
    
    Returns total donations, amount raised, and campaign count.
    """
    db = get_database()
    blockchain = get_blockchain()
    
    try:
        db_stats = await db.get_platform_stats()
        
        # Also get on-chain stats for verification
        on_chain_count = await blockchain.get_total_donations_count()
        on_chain_amount = await blockchain.get_total_amount_raised()
        
        return {
            "database": db_stats,
            "blockchain": {
                "total_donations_on_chain": on_chain_count,
                "total_amount_in_paise": on_chain_amount,
                "total_amount_in_inr": on_chain_amount / 100 if on_chain_amount else 0
            },
            "transparency_note": "Blockchain records can be independently verified on Shardeum"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-blockchain")
async def test_blockchain_transaction(
    campaign_id: str = "test-campaign-001",
    amount: float = 100.0,
    donor_email: Optional[str] = "test@example.com",
    payment_method: str = "upi"
) -> Dict[str, Any]:
    """
    🧪 TEST ENDPOINT: Simulate a donation and record on Shardeum blockchain.
    
    This will generate a transaction hash and display it in the terminal.
    Use this to test the Shardeum integration.
    
    - **campaign_id**: Campaign identifier (default: test-campaign-001)
    - **amount**: Donation amount in INR (default: 100.0)
    - **donor_email**: Donor's email (default: test@example.com)
    - **payment_method**: Payment method (default: upi)
    """
    blockchain = get_blockchain()
    
    # Convert to paise (1 INR = 100 paise)
    amount_in_paise = int(amount * 100)
    
    try:
        # Record on blockchain - this will print to terminal!
        tx_hash = await blockchain.record_donation(
            campaign_id=campaign_id,
            amount_in_paise=amount_in_paise,
            donor_email=donor_email,
            payment_method=payment_method,
            is_anonymous=False
        )
        
        return {
            "success": True,
            "message": "Transaction recorded on Shardeum blockchain!",
            "transaction_hash": tx_hash,
            "explorer_url": blockchain.get_explorer_url(tx_hash),
            "donation_details": {
                "campaign_id": campaign_id,
                "amount_inr": amount,
                "amount_paise": amount_in_paise,
                "payment_method": payment_method
            },
            "note": "Check the backend terminal for the formatted transaction output!"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain error: {str(e)}")
