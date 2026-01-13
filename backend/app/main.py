"""
HeartChain Backend - FastAPI Application
Transparent Blockchain Donations Platform

This is the main entry point for the FastAPI backend that handles:
- Payment processing (Razorpay UPI/Card)
- Blockchain recording (Polygon)
- Database operations (Supabase)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from .config import settings
from .routes import (
    campaigns_router,
    donations_router,
    payments_router,
    health_router,
)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("🚀 HeartChain Backend starting...")
    logger.info(f"   Debug mode: {settings.debug}")
    logger.info(f"   CORS origins: {settings.cors_origins_list}")
    
    # Check service configurations
    from .services import get_database, get_blockchain, get_payment
    
    db = get_database()
    blockchain = get_blockchain()
    payment = get_payment()
    
    logger.info(f"   Database configured: {db.client is not None}")
    logger.info(f"   Blockchain configured: {blockchain.is_configured}")
    logger.info(f"   Payment configured: {payment.is_configured}")
    
    if blockchain.is_configured:
        balance = blockchain.get_wallet_balance()
        logger.info(f"   Wallet MATIC balance: {balance:.4f}")
    
    logger.info("✅ HeartChain Backend ready!")
    
    yield
    
    # Shutdown
    logger.info("👋 HeartChain Backend shutting down...")


# Create FastAPI application
app = FastAPI(
    title="HeartChain API",
    description="""
## HeartChain Backend API

**Transparent Blockchain Donations Platform**

This API powers HeartChain, bridging traditional payments (UPI, Cards) 
with blockchain transparency. Every donation is recorded on Polygon 
for public verification.

### Key Features:
- 💳 **Payment Processing**: Razorpay integration for UPI & cards
- ⛓️ **Blockchain Recording**: All donations recorded on Polygon
- 🔒 **Privacy Preserving**: Donor emails are hashed before storage
- 📊 **Full Transparency**: Anyone can verify donations on-chain

### API Sections:
- `/campaigns` - Fundraising campaigns management
- `/donations` - Donation records and verification
- `/payments` - Payment processing and webhooks
- `/health` - Service health monitoring
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(campaigns_router, prefix="/api")
app.include_router(donations_router, prefix="/api")
app.include_router(payments_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "HeartChain API",
        "version": "1.0.0",
        "description": "Transparent Blockchain Donations Platform",
        "docs": "/docs",
        "health": "/health"
    }


# For running with uvicorn directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
