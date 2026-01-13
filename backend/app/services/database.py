"""
Database Service - Supabase Integration
Handles all database operations for donations and campaigns.
"""

from functools import lru_cache
from typing import Optional, List, Dict, Any
from supabase import create_client, Client
from datetime import datetime
import logging

from ..config import settings

logger = logging.getLogger(__name__)


class DatabaseService:
    """Service for Supabase database operations."""
    
    def __init__(self):
        """Initialize Supabase client."""
        if not settings.supabase_url or not settings.supabase_anon_key:
            logger.warning("Supabase credentials not configured. Database operations will fail.")
            self.client = None
        else:
            self.client = create_client(
                settings.supabase_url,
                settings.supabase_anon_key
            )
    
    def _check_client(self):
        """Ensure client is initialized."""
        if not self.client:
            raise Exception("Supabase client not initialized. Check your environment variables.")
    
    # ==================== DONATION OPERATIONS ====================
    
    async def create_donation(self, donation_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new donation record in the database.
        
        Args:
            donation_data: Dictionary containing donation details
            
        Returns:
            The created donation record
        """
        self._check_client()
        
        result = self.client.table("donations").insert({
            "campaign_id": donation_data.get("campaign_id"),
            "donor_name": donation_data.get("donor_name"),
            "donor_email": donation_data.get("donor_email"),
            "amount": float(donation_data.get("amount", 0)),
            "payment_method": donation_data.get("payment_method"),
            "razorpay_payment_id": donation_data.get("razorpay_payment_id"),
            "is_anonymous": donation_data.get("is_anonymous", False),
            "message": donation_data.get("message"),
        }).execute()
        
        if result.data:
            logger.info(f"Created donation: {result.data[0].get('id')}")
            return result.data[0]
        
        raise Exception("Failed to create donation")
    
    async def update_donation_tx_hash(
        self, 
        donation_id: str, 
        tx_hash: str
    ) -> Dict[str, Any]:
        """
        Update a donation with its blockchain transaction hash.
        
        Args:
            donation_id: UUID of the donation
            tx_hash: Blockchain transaction hash
            
        Returns:
            Updated donation record
        """
        self._check_client()
        
        result = self.client.table("donations").update({
            "blockchain_tx_hash": tx_hash
        }).eq("id", donation_id).execute()
        
        if result.data:
            logger.info(f"Updated donation {donation_id} with tx_hash: {tx_hash}")
            return result.data[0]
        
        raise Exception(f"Failed to update donation {donation_id}")
    
    async def get_donation(self, donation_id: str) -> Optional[Dict[str, Any]]:
        """Get a single donation by ID."""
        self._check_client()
        
        result = self.client.table("donations").select("*").eq(
            "id", donation_id
        ).single().execute()
        
        return result.data
    
    async def get_donations_by_campaign(
        self, 
        campaign_id: str, 
        limit: int = 50,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """Get all donations for a specific campaign."""
        self._check_client()
        
        result = self.client.table("donations").select("*").eq(
            "campaign_id", campaign_id
        ).order(
            "created_at", desc=True
        ).range(offset, offset + limit - 1).execute()
        
        return result.data or []
    
    async def get_donation_by_razorpay_id(
        self, 
        razorpay_payment_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get a donation by its Razorpay payment ID."""
        self._check_client()
        
        result = self.client.table("donations").select("*").eq(
            "razorpay_payment_id", razorpay_payment_id
        ).maybe_single().execute()
        
        return result.data
    
    # ==================== CAMPAIGN OPERATIONS ====================
    
    async def create_campaign(self, campaign_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new campaign."""
        self._check_client()
        
        result = self.client.table("campaigns").insert({
            "title": campaign_data.get("title"),
            "description": campaign_data.get("description"),
            "beneficiary_name": campaign_data.get("beneficiary_name"),
            "goal_amount": float(campaign_data.get("goal_amount", 0)),
            "category": campaign_data.get("category"),
            "image_url": campaign_data.get("image_url"),
            "end_date": campaign_data.get("end_date"),
        }).execute()
        
        if result.data:
            logger.info(f"Created campaign: {result.data[0].get('id')}")
            return result.data[0]
        
        raise Exception("Failed to create campaign")
    
    async def get_campaign(self, campaign_id: str) -> Optional[Dict[str, Any]]:
        """Get a single campaign by ID."""
        self._check_client()
        
        result = self.client.table("campaigns").select("*").eq(
            "id", campaign_id
        ).single().execute()
        
        return result.data
    
    async def get_campaigns(
        self, 
        limit: int = 20,
        offset: int = 0,
        category: Optional[str] = None,
        is_active: bool = True
    ) -> List[Dict[str, Any]]:
        """Get all campaigns with optional filtering."""
        self._check_client()
        
        query = self.client.table("campaigns").select("*")
        
        if is_active:
            query = query.eq("is_active", True)
        
        if category:
            query = query.eq("category", category)
        
        result = query.order(
            "created_at", desc=True
        ).range(offset, offset + limit - 1).execute()
        
        return result.data or []
    
    async def update_campaign_stats(
        self, 
        campaign_id: str, 
        amount: float
    ) -> Dict[str, Any]:
        """
        Update campaign raised amount and donor count after a donation.
        
        Args:
            campaign_id: UUID of the campaign
            amount: Donation amount to add
        """
        self._check_client()
        
        # Get current values
        campaign = await self.get_campaign(campaign_id)
        if not campaign:
            raise Exception(f"Campaign {campaign_id} not found")
        
        # Update with incremented values
        result = self.client.table("campaigns").update({
            "raised_amount": float(campaign.get("raised_amount", 0)) + amount,
            "donor_count": campaign.get("donor_count", 0) + 1
        }).eq("id", campaign_id).execute()
        
        if result.data:
            logger.info(f"Updated campaign {campaign_id} stats")
            return result.data[0]
        
        raise Exception(f"Failed to update campaign {campaign_id}")
    
    # ==================== ANALYTICS ====================
    
    async def get_platform_stats(self) -> Dict[str, Any]:
        """Get overall platform statistics."""
        self._check_client()
        
        # Get total donations
        donations_result = self.client.table("donations").select(
            "amount", count="exact"
        ).execute()
        
        total_amount = sum(d.get("amount", 0) for d in (donations_result.data or []))
        total_donations = donations_result.count or 0
        
        # Get total campaigns
        campaigns_result = self.client.table("campaigns").select(
            "*", count="exact"
        ).eq("is_active", True).execute()
        
        total_campaigns = campaigns_result.count or 0
        
        return {
            "total_donations": total_donations,
            "total_amount_raised": total_amount,
            "total_campaigns": total_campaigns,
        }


@lru_cache()
def get_database() -> DatabaseService:
    """Get cached database service instance."""
    return DatabaseService()
