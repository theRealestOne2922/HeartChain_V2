"""Campaign-related Pydantic models for request/response validation."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class CampaignCreate(BaseModel):
    """Request model for creating a new campaign."""
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10, max_length=5000)
    beneficiary_name: str = Field(..., min_length=2, max_length=100)
    goal_amount: Decimal = Field(..., gt=0)
    category: Optional[str] = Field(None)
    image_url: Optional[str] = Field(None)
    end_date: Optional[datetime] = Field(None)
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Help build a school in rural India",
                "description": "We are raising funds to build a primary school...",
                "beneficiary_name": "Rural Education Foundation",
                "goal_amount": 500000.00,
                "category": "education",
                "image_url": "https://example.com/school.jpg"
            }
        }


class CampaignUpdate(BaseModel):
    """Request model for updating a campaign."""
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=5000)
    goal_amount: Optional[Decimal] = Field(None, gt=0)
    category: Optional[str] = Field(None)
    image_url: Optional[str] = Field(None)
    end_date: Optional[datetime] = Field(None)
    is_active: Optional[bool] = Field(None)


class CampaignResponse(BaseModel):
    """Response model for campaign data."""
    id: str
    title: str
    description: str
    beneficiary_name: str
    goal_amount: Decimal
    raised_amount: Decimal = Decimal("0")
    donor_count: int = 0
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    end_date: Optional[datetime] = None
    
    # Computed properties
    progress_percentage: float = 0.0
    
    def __init__(self, **data):
        super().__init__(**data)
        if self.goal_amount > 0:
            self.progress_percentage = float(
                (self.raised_amount / self.goal_amount) * 100
            )
    
    class Config:
        from_attributes = True


class CampaignWithDonations(CampaignResponse):
    """Campaign response including recent donations."""
    recent_donations: List[dict] = []
