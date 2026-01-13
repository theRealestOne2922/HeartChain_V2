"""Donation-related Pydantic models for request/response validation."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal
from enum import Enum


class PaymentMethod(str, Enum):
    """Supported payment methods."""
    UPI = "upi"
    CARD = "card"
    NETBANKING = "netbanking"
    WALLET = "wallet"
    CRYPTO = "crypto"


class DonationCreate(BaseModel):
    """Request model for creating a new donation."""
    campaign_id: str = Field(..., description="UUID of the campaign")
    donor_name: Optional[str] = Field(None, description="Name of the donor")
    donor_email: Optional[EmailStr] = Field(None, description="Email of the donor")
    amount: Decimal = Field(..., gt=0, description="Donation amount in INR")
    is_anonymous: bool = Field(default=False, description="Hide donor identity")
    message: Optional[str] = Field(None, max_length=500, description="Optional message")
    
    class Config:
        json_schema_extra = {
            "example": {
                "campaign_id": "123e4567-e89b-12d3-a456-426614174000",
                "donor_name": "John Doe",
                "donor_email": "john@example.com",
                "amount": 1000.00,
                "is_anonymous": False,
                "message": "Keep up the great work!"
            }
        }


class DonationResponse(BaseModel):
    """Response model for donation data."""
    id: str
    campaign_id: str
    donor_name: Optional[str]
    amount: Decimal
    payment_method: Optional[str]
    razorpay_payment_id: Optional[str]
    blockchain_tx_hash: Optional[str]
    is_anonymous: bool
    message: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class DonationWithBlockchain(DonationResponse):
    """Donation response with blockchain verification link."""
    blockchain_explorer_url: Optional[str] = None
    
    def __init__(self, **data):
        super().__init__(**data)
        if self.blockchain_tx_hash:
            # Mumbai testnet explorer
            self.blockchain_explorer_url = f"https://mumbai.polygonscan.com/tx/{self.blockchain_tx_hash}"


class PaymentOrderRequest(BaseModel):
    """Request model for creating a Razorpay order."""
    amount: int = Field(..., gt=0, description="Amount in paise (1 INR = 100 paise)")
    campaign_id: str = Field(..., description="UUID of the campaign")
    donor_name: Optional[str] = Field(None)
    donor_email: Optional[EmailStr] = Field(None)
    is_anonymous: bool = Field(default=False)
    message: Optional[str] = Field(None, max_length=500)
    
    class Config:
        json_schema_extra = {
            "example": {
                "amount": 100000,  # ₹1000 in paise
                "campaign_id": "123e4567-e89b-12d3-a456-426614174000",
                "donor_name": "John Doe",
                "donor_email": "john@example.com",
                "is_anonymous": False,
                "message": "For a good cause!"
            }
        }


class PaymentOrderResponse(BaseModel):
    """Response model for Razorpay order creation."""
    order_id: str = Field(..., description="Razorpay order ID")
    amount: int = Field(..., description="Amount in paise")
    currency: str = Field(default="INR")
    key_id: str = Field(..., description="Razorpay public key for frontend")
    
    class Config:
        json_schema_extra = {
            "example": {
                "order_id": "order_ABC123XYZ",
                "amount": 100000,
                "currency": "INR",
                "key_id": "rzp_test_xxxxx"
            }
        }


class WebhookPayment(BaseModel):
    """Payment entity from Razorpay webhook."""
    id: str
    amount: int
    currency: str
    method: str
    email: Optional[str] = None
    notes: dict = {}


class WebhookPayload(BaseModel):
    """Razorpay webhook payload structure."""
    event: str
    payload: dict
    
    def get_payment(self) -> Optional[WebhookPayment]:
        """Extract payment entity from webhook payload."""
        if "payment" in self.payload and "entity" in self.payload["payment"]:
            return WebhookPayment(**self.payload["payment"]["entity"])
        return None
