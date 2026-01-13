"""
HeartChain Backend Configuration
Loads environment variables and provides type-safe settings access.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    cors_origins: str = "http://localhost:8080,http://localhost:5173"
    
    # Razorpay Payment Gateway
    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""
    razorpay_webhook_secret: str = ""
    
    # Supabase Database
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_key: str = ""
    
    # Blockchain Configuration (Shardeum)
    shardeum_rpc_url: str = "https://sphinx.shardeum.org/"
    polygon_rpc_url: str = "https://sphinx.shardeum.org/"
    contract_address: str = ""
    wallet_private_key: str = ""
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"  # Allow extra env vars without errors


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
