"""
Blockchain Service - Web3 Integration with Polygon
Records donations on the blockchain for transparency and verification.
"""

from functools import lru_cache
from typing import Optional, Dict, Any
from web3 import Web3
import hashlib
import logging
import json

from ..config import settings

logger = logging.getLogger(__name__)

# HeartChainDonations Smart Contract ABI
# Only includes the functions we need to interact with
CONTRACT_ABI = json.loads('''
[
    {
        "inputs": [
            {"internalType": "string", "name": "_campaignId", "type": "string"},
            {"internalType": "uint256", "name": "_amountInPaise", "type": "uint256"},
            {"internalType": "string", "name": "_donorIdentifier", "type": "string"},
            {"internalType": "string", "name": "_paymentMethod", "type": "string"}
        ],
        "name": "recordDonation",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}],
        "name": "getDonation",
        "outputs": [
            {
                "components": [
                    {"internalType": "string", "name": "campaignId", "type": "string"},
                    {"internalType": "uint256", "name": "amountInPaise", "type": "uint256"},
                    {"internalType": "string", "name": "donorIdentifier", "type": "string"},
                    {"internalType": "string", "name": "paymentMethod", "type": "string"},
                    {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
                ],
                "internalType": "struct HeartChainDonations.DonationRecord",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDonationsCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalDonationsCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalAmountRaised",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {"indexed": true, "internalType": "uint256", "name": "donationIndex", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "campaignId", "type": "string"},
            {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
            {"indexed": false, "internalType": "string", "name": "paymentMethod", "type": "string"},
            {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "name": "DonationRecorded",
        "type": "event"
    }
]
''')


class BlockchainService:
    """Service for blockchain operations on Polygon network."""
    
    def __init__(self):
        """Initialize Web3 connection and contract."""
        self.is_configured = False
        
        if not settings.polygon_rpc_url or not settings.wallet_private_key:
            logger.warning("Blockchain not configured. Transactions will be simulated.")
            return
        
        if not settings.contract_address or settings.contract_address == "0x0000000000000000000000000000000000000000":
            logger.warning("Contract address not set. Deploy the contract first.")
            return
        
        try:
            # Connect to Polygon network
            self.w3 = Web3(Web3.HTTPProvider(settings.polygon_rpc_url))
            
            # Note: Modern Polygon RPC endpoints typically don't require POA middleware
            # If you encounter extraData issues, you may need to add middleware
            
            # Verify connection
            if not self.w3.is_connected():
                logger.error("Failed to connect to Polygon network")
                return
            
            # Set up account from private key
            self.account = self.w3.eth.account.from_key(settings.wallet_private_key)
            
            # Initialize contract
            self.contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(settings.contract_address),
                abi=CONTRACT_ABI
            )
            
            self.is_configured = True
            logger.info(f"Blockchain service initialized. Connected to chain ID: {self.w3.eth.chain_id}")
            
        except Exception as e:
            logger.error(f"Failed to initialize blockchain service: {e}")
    
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
        Record a donation on the blockchain.
        
        Args:
            campaign_id: UUID of the campaign
            amount_in_paise: Amount in paise (1 INR = 100 paise)
            donor_email: Donor's email (will be hashed for privacy)
            payment_method: Payment method used (upi, card, etc.)
            is_anonymous: Whether to store as anonymous
            
        Returns:
            Transaction hash as proof of recording
        """
        # Create donor identifier (hashed for privacy)
        if is_anonymous or not donor_email:
            donor_identifier = "anonymous"
        else:
            donor_identifier = self.hash_donor_email(donor_email)
        
        if not self.is_configured:
            # Return simulated transaction hash for development
            simulated_hash = f"0x{hashlib.sha256(f'{campaign_id}{amount_in_paise}{donor_identifier}'.encode()).hexdigest()}"
            logger.warning(f"Blockchain not configured. Simulated tx hash: {simulated_hash}")
            return simulated_hash
        
        try:
            # Build transaction
            tx = self.contract.functions.recordDonation(
                campaign_id,
                amount_in_paise,
                donor_identifier,
                payment_method
            ).build_transaction({
                'from': self.account.address,
                'nonce': self.w3.eth.get_transaction_count(self.account.address),
                'gas': 200000,
                'gasPrice': self.w3.eth.gas_price,
            })
            
            # Sign transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, settings.wallet_private_key)
            
            # Send transaction
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            # Wait for transaction receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            
            tx_hash_hex = receipt.transactionHash.hex()
            logger.info(f"Donation recorded on blockchain. Tx hash: {tx_hash_hex}")
            
            return tx_hash_hex
            
        except Exception as e:
            logger.error(f"Failed to record donation on blockchain: {e}")
            raise
    
    async def get_donation_from_chain(self, index: int) -> Optional[Dict[str, Any]]:
        """
        Retrieve a donation record from the blockchain.
        
        Args:
            index: The donation index on the blockchain
            
        Returns:
            Dictionary with donation details
        """
        if not self.is_configured:
            logger.warning("Blockchain not configured")
            return None
        
        try:
            result = self.contract.functions.getDonation(index).call()
            return {
                "campaign_id": result[0],
                "amount_in_paise": result[1],
                "donor_identifier": result[2],
                "payment_method": result[3],
                "timestamp": result[4],
            }
        except Exception as e:
            logger.error(f"Failed to get donation from chain: {e}")
            return None
    
    async def get_total_donations_count(self) -> int:
        """Get total number of donations recorded on blockchain."""
        if not self.is_configured:
            return 0
        
        try:
            return self.contract.functions.getDonationsCount().call()
        except Exception as e:
            logger.error(f"Failed to get donations count: {e}")
            return 0
    
    async def get_total_amount_raised(self) -> int:
        """Get total amount raised recorded on blockchain (in paise)."""
        if not self.is_configured:
            return 0
        
        try:
            return self.contract.functions.totalAmountRaised().call()
        except Exception as e:
            logger.error(f"Failed to get total amount: {e}")
            return 0
    
    def get_explorer_url(self, tx_hash: str) -> str:
        """Get the blockchain explorer URL for a transaction."""
        # Check if testnet (Mumbai) or mainnet (Polygon)
        if "mumbai" in settings.polygon_rpc_url.lower():
            return f"https://mumbai.polygonscan.com/tx/{tx_hash}"
        else:
            return f"https://polygonscan.com/tx/{tx_hash}"
    
    def get_wallet_balance(self) -> float:
        """Get the wallet's MATIC balance."""
        if not self.is_configured:
            return 0.0
        
        try:
            balance_wei = self.w3.eth.get_balance(self.account.address)
            return float(self.w3.from_wei(balance_wei, 'ether'))
        except Exception as e:
            logger.error(f"Failed to get wallet balance: {e}")
            return 0.0


@lru_cache()
def get_blockchain() -> BlockchainService:
    """Get cached blockchain service instance."""
    return BlockchainService()
