"""
Blockchain API endpoints - Transaction recording and verification.
Records MetaMask transactions on the backend for persistence.
"""

from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime
import logging

from ..services import get_blockchain

router = APIRouter(prefix="/blockchain", tags=["Blockchain"])
logger = logging.getLogger(__name__)


class TransactionRecord(BaseModel):
    """Transaction record from frontend."""
    hash: str
    campaignId: str
    campaignTitle: str
    amount: float
    donorAddress: str
    timestamp: str
    status: str  # pending, confirmed, failed
    blockNumber: Optional[int] = None
    gasUsed: Optional[str] = None
    chainId: Optional[str] = None


class TransactionResponse(BaseModel):
    """Response for transaction operations."""
    success: bool
    message: str
    transaction: Optional[Dict[str, Any]] = None


# In-memory storage for transactions (persisted in backend memory)
# In production, this would be stored in a database
stored_transactions: List[Dict[str, Any]] = []


@router.post("/record-transaction", response_model=TransactionResponse)
async def record_transaction(tx: TransactionRecord):
    """
    Record a blockchain transaction from the frontend.
    
    This is called after a MetaMask transaction is confirmed.
    Stores the transaction for backend verification and display.
    """
    blockchain = get_blockchain()
    
    try:
        # Check if transaction already exists
        existing = next((t for t in stored_transactions if t["hash"] == tx.hash), None)
        if existing:
            # Update existing transaction
            existing.update({
                "status": tx.status,
                "blockNumber": tx.blockNumber,
                "gasUsed": tx.gasUsed,
            })
            logger.info(f"Updated transaction: {tx.hash}")
            return TransactionResponse(
                success=True,
                message="Transaction updated",
                transaction=existing
            )
        
        # Create new transaction record
        transaction = {
            "hash": tx.hash,
            "campaignId": tx.campaignId,
            "campaignTitle": tx.campaignTitle,
            "amount": tx.amount,
            "donorAddress": tx.donorAddress,
            "timestamp": tx.timestamp,
            "status": tx.status,
            "blockNumber": tx.blockNumber,
            "gasUsed": tx.gasUsed,
            "chainId": tx.chainId,
            "explorerUrl": blockchain.get_explorer_url(tx.hash),
            "recordedAt": datetime.now().isoformat(),
        }
        
        stored_transactions.append(transaction)
        
        # Print to terminal
        print(f"""
╔══════════════════════════════════════════════════════════════════╗
║           🔗 FRONTEND TRANSACTION RECORDED                        ║
╠══════════════════════════════════════════════════════════════════╣
║  Hash: {tx.hash[:20]}...{tx.hash[-10:]}
║  Amount: ₹{tx.amount:,.2f}
║  Campaign: {tx.campaignTitle[:40]}
║  Donor: {tx.donorAddress[:10]}...{tx.donorAddress[-8:]}
║  Status: {tx.status.upper()}
║  Chain: {tx.chainId or 'Unknown'}
╚══════════════════════════════════════════════════════════════════╝
        """)
        
        logger.info(f"Recorded new transaction: {tx.hash}")
        
        return TransactionResponse(
            success=True,
            message="Transaction recorded successfully",
            transaction=transaction
        )
        
    except Exception as e:
        logger.error(f"Failed to record transaction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/transactions")
async def get_all_transactions() -> Dict[str, Any]:
    """
    Get all recorded transactions.
    
    Returns both frontend (MetaMask) and backend recorded transactions.
    """
    blockchain = get_blockchain()
    
    # Get backend transactions too
    backend_txs = blockchain.get_all_transactions()
    
    return {
        "frontend_transactions": stored_transactions,
        "backend_transactions": backend_txs,
        "total_count": len(stored_transactions) + len(backend_txs),
    }


@router.get("/transactions/{tx_hash}")
async def get_transaction(tx_hash: str) -> Dict[str, Any]:
    """
    Get a specific transaction by hash.
    """
    # Check stored transactions
    tx = next((t for t in stored_transactions if t["hash"] == tx_hash), None)
    if tx:
        return {"found": True, "source": "frontend", "transaction": tx}
    
    # Check backend transactions
    blockchain = get_blockchain()
    backend_txs = blockchain.get_all_transactions()
    backend_tx = next((t for t in backend_txs if t.get("tx_hash") == tx_hash), None)
    if backend_tx:
        return {"found": True, "source": "backend", "transaction": backend_tx}
    
    raise HTTPException(status_code=404, detail="Transaction not found")


@router.get("/verify/{tx_hash}")
async def verify_transaction(tx_hash: str) -> Dict[str, Any]:
    """
    Verify a transaction exists in records.
    
    Returns verification status and explorer URL.
    """
    blockchain = get_blockchain()
    
    # Check if transaction is in our records
    in_records = any(t["hash"] == tx_hash for t in stored_transactions)
    
    return {
        "hash": tx_hash,
        "verified": in_records,
        "explorerUrl": blockchain.get_explorer_url(tx_hash),
        "message": "Transaction found in records" if in_records else "Transaction not found in local records - verify on explorer"
    }


@router.get("/stats")
async def get_blockchain_stats() -> Dict[str, Any]:
    """
    Get blockchain statistics.
    """
    blockchain = get_blockchain()
    
    total_amount = sum(t.get("amount", 0) for t in stored_transactions)
    confirmed_txs = [t for t in stored_transactions if t.get("status") == "confirmed"]
    
    return {
        "total_transactions": len(stored_transactions),
        "confirmed_transactions": len(confirmed_txs),
        "pending_transactions": len(stored_transactions) - len(confirmed_txs),
        "total_amount_inr": total_amount,
        "backend_transactions": await blockchain.get_total_donations_count(),
        "backend_amount_paise": await blockchain.get_total_amount_raised(),
    }
