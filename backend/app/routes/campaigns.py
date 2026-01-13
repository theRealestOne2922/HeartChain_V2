"""Campaign API endpoints."""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from ..models import CampaignCreate, CampaignResponse, CampaignUpdate
from ..services import get_database

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


@router.get("", response_model=List[CampaignResponse])
async def get_campaigns(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    category: Optional[str] = Query(None),
    active_only: bool = Query(True)
):
    """
    Get all campaigns with optional filtering.
    
    - **limit**: Maximum number of campaigns to return (1-100)
    - **offset**: Number of campaigns to skip for pagination
    - **category**: Filter by category (education, medical, disaster, etc.)
    - **active_only**: Only return active campaigns
    """
    db = get_database()
    
    try:
        campaigns = await db.get_campaigns(
            limit=limit,
            offset=offset,
            category=category,
            is_active=active_only
        )
        return campaigns
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(campaign_id: str):
    """
    Get a specific campaign by ID.
    
    - **campaign_id**: UUID of the campaign
    """
    db = get_database()
    
    try:
        campaign = await db.get_campaign(campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        return campaign
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=CampaignResponse, status_code=201)
async def create_campaign(campaign: CampaignCreate):
    """
    Create a new fundraising campaign.
    
    Required fields:
    - **title**: Campaign title (3-200 characters)
    - **description**: Detailed description (10-5000 characters)
    - **beneficiary_name**: Name of the beneficiary (2-100 characters)
    - **goal_amount**: Target fundraising amount in INR
    """
    db = get_database()
    
    try:
        created = await db.create_campaign(campaign.model_dump())
        return created
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{campaign_id}/donations")
async def get_campaign_donations(
    campaign_id: str,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    Get all donations for a specific campaign.
    
    - **campaign_id**: UUID of the campaign
    - **limit**: Maximum number of donations to return
    - **offset**: Number of donations to skip for pagination
    """
    db = get_database()
    
    try:
        # Verify campaign exists
        campaign = await db.get_campaign(campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail="Campaign not found")
        
        donations = await db.get_donations_by_campaign(
            campaign_id=campaign_id,
            limit=limit,
            offset=offset
        )
        
        # Mask donor info for anonymous donations
        for donation in donations:
            if donation.get("is_anonymous"):
                donation["donor_name"] = "Anonymous"
                donation["donor_email"] = None
        
        return {
            "campaign_id": campaign_id,
            "campaign_title": campaign.get("title"),
            "donations": donations,
            "total": len(donations)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
