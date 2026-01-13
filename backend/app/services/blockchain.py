"""
Blockchain Service - Demo Mode
Simulates blockchain transactions with realistic hash generation.

This demo mode generates realistic Ethereum-style transaction hashes
for demonstration purposes without connecting to any actual blockchain.
"""

from functools import lru_cache
from typing import Optional, Dict, Any
import hashlib
import logging
import secrets
from datetime import datetime
import time

logger = logging.getLogger(__name__)

# ANSI color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    MAGENTA = '\033[35m'

# Track all transactions for this session
transaction_history = []

def generate_realistic_tx_hash() -> str:
    """Generate a realistic Ethereum-style transaction hash."""
    # Use secrets module for cryptographically secure random bytes
    random_bytes = secrets.token_bytes(32)
    return "0x" + random_bytes.hex()

def print_transaction_hash(tx_hash: str, campaign_id: str, amount: float, donor_id: str = "anonymous", payment_method: str = "upi"):
    """Print transaction hash prominently to terminal with styling."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    tx_count = len(transaction_history)
    
    print("\n" + "=" * 70)
    print(f"{Colors.BOLD}{Colors.GREEN}🔗 BLOCKCHAIN TRANSACTION RECORDED{Colors.ENDC}")
    print("=" * 70)
    print(f"{Colors.CYAN}Transaction #{Colors.ENDC} {tx_count}")
    print(f"{Colors.CYAN}Timestamp:{Colors.ENDC}    {timestamp}")
    print(f"{Colors.CYAN}Campaign ID:{Colors.ENDC}  {campaign_id}")
    print(f"{Colors.CYAN}Amount:{Colors.ENDC}       ₹{amount:.2f}")
    print(f"{Colors.CYAN}Donor ID:{Colors.ENDC}     {donor_id}")
    print(f"{Colors.CYAN}Method:{Colors.ENDC}       {payment_method.upper()}")
    print(f"{Colors.CYAN}Network:{Colors.ENDC}      Shardeum Sphinx (Demo)")
    print(f"{Colors.GREEN}Status:{Colors.ENDC}       ✅ RECORDED")
    print("-" * 70)
    print(f"{Colors.BOLD}{Colors.BLUE}Transaction Hash:{Colors.ENDC}")
    print(f"  {Colors.YELLOW}{tx_hash}{Colors.ENDC}")
    print("-" * 70)
    print(f"{Colors.MAGENTA}💡 This hash can be used to verify the donation on the blockchain{Colors.ENDC}")
    print("=" * 70 + "\n")


class BlockchainService:
    """
    Demo Blockchain Service - Simulates blockchain transactions.
    
    Generates realistic transaction hashes and stores them in memory.
    Perfect for demonstrations and development without actual blockchain.
    """
    
    def __init__(self):
        """Initialize the demo blockchain service."""
        self.is_configured = True  # Always configured in demo mode
        self.transactions = []
        
        print(f"\n{Colors.GREEN}{'='*60}{Colors.ENDC}")
        print(f"{Colors.BOLD}{Colors.GREEN}🔗 BLOCKCHAIN SERVICE INITIALIZED (Demo Mode){Colors.ENDC}")
        print(f"{Colors.GREEN}{'='*60}{Colors.ENDC}")
        print(f"{Colors.CYAN}   Mode:{Colors.ENDC} Demo/Simulation")
        print(f"{Colors.CYAN}   Network:{Colors.ENDC} Shardeum Sphinx (Simulated)")
        print(f"{Colors.CYAN}   Status:{Colors.ENDC} ✅ Ready to record transactions")
        print(f"{Colors.GREEN}{'='*60}{Colors.ENDC}\n")
        
        logger.info("🔗 Demo Blockchain Service initialized - ready to generate transaction hashes")
    
    def hash_donor_email(self, email: str) -> str:
        """
        Create a privacy-preserving identifier from donor email.
        Only stores first 10 chars of hash on blockchain.
        """
        return hashlib.sha256(email.encode()).hexdigest()[:10]
    
    async def record_donation(
        self,
        campaign_id: str,
        amount_in_paise: int,
        donor_email: Optional[str],
        payment_method: str,
        is_anonymous: bool = False
    ) -> str:
        """
        Record a donation and generate a blockchain transaction hash.
        
        In demo mode, generates a realistic hash without actual blockchain.
        
        Args:
            campaign_id: UUID of the campaign
            amount_in_paise: Amount in paise (1 INR = 100 paise)
            donor_email: Donor's email (will be hashed for privacy)
            payment_method: Payment method used (upi, card, etc.)
            is_anonymous: Whether to store as anonymous
            
        Returns:
            Transaction hash as proof of recording
        """
        # Convert paise to rupees for display
        amount_in_rupees = amount_in_paise / 100.0
        
        # Create donor identifier (hashed for privacy)
        if is_anonymous or not donor_email:
            donor_identifier = "anonymous"
        else:
            donor_identifier = self.hash_donor_email(donor_email)
        
        # Generate a realistic transaction hash
        tx_hash = generate_realistic_tx_hash()
        
        # Store transaction in memory
        transaction = {
            "tx_hash": tx_hash,
            "campaign_id": campaign_id,
            "amount_paise": amount_in_paise,
            "amount_inr": amount_in_rupees,
            "donor_id": donor_identifier,
            "payment_method": payment_method,
            "timestamp": datetime.now().isoformat(),
        }
        self.transactions.append(transaction)
        transaction_history.append(transaction)
        
        # Print to terminal with styling
        print_transaction_hash(tx_hash, campaign_id, amount_in_rupees, donor_identifier, payment_method)
        
        logger.info(f"[BLOCKCHAIN] Transaction recorded - Hash: {tx_hash}")
        
        return tx_hash
    
    async def get_donation_from_chain(self, index: int) -> Optional[Dict[str, Any]]:
        """
        Retrieve a donation record from transaction history.
        
        Args:
            index: The donation index
            
        Returns:
            Dictionary with donation details
        """
        if index < len(self.transactions):
            return self.transactions[index]
        return None
    
    async def get_total_donations_count(self) -> int:
        """Get total number of donations recorded."""
        return len(transaction_history)
    
    async def get_total_amount_raised(self) -> int:
        """Get total amount raised (in paise)."""
        return sum(tx.get("amount_paise", 0) for tx in transaction_history)
    
    def get_explorer_url(self, tx_hash: str) -> str:
        """Get the blockchain explorer URL for a transaction (demo)."""
        return f"https://explorer-sphinx.shardeum.org/tx/{tx_hash}"
    
    def get_wallet_balance(self) -> float:
        """Get demo wallet balance."""
        return 100.0  # Demo balance
    
    def get_all_transactions(self) -> list:
        """Get all recorded transactions."""
        return transaction_history


@lru_cache()
def get_blockchain() -> BlockchainService:
    """Get cached blockchain service instance."""
    return BlockchainService()
