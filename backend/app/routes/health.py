"""Health check endpoints for monitoring and status."""

from fastapi import APIRouter, Depends
from typing import Dict, Any

from ..services import get_database, get_blockchain, get_payment

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
async def health_check() -> Dict[str, str]:
    """Basic health check endpoint."""
    return {"status": "healthy", "service": "heartchain-backend"}


@router.get("/detailed")
async def detailed_health_check() -> Dict[str, Any]:
    """
    Detailed health check including all service statuses.
    Useful for debugging and monitoring.
    """
    db = get_database()
    blockchain = get_blockchain()
    payment = get_payment()
    
    status = {
        "status": "healthy",
        "services": {
            "database": {
                "configured": db.client is not None,
                "status": "connected" if db.client else "not_configured"
            },
            "blockchain": {
                "configured": blockchain.is_configured,
                "status": "connected" if blockchain.is_configured else "not_configured",
            },
            "payment": {
                "configured": payment.is_configured,
                "status": "connected" if payment.is_configured else "not_configured"
            }
        }
    }
    
    # Add blockchain details if configured
    if blockchain.is_configured:
        status["services"]["blockchain"]["wallet_balance_matic"] = blockchain.get_wallet_balance()
        status["services"]["blockchain"]["total_on_chain"] = await blockchain.get_total_donations_count()
    
    return status
