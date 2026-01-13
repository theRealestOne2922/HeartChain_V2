# HeartChain Backend

FastAPI backend for the HeartChain transparent blockchain donations platform.

## Features

- 💳 **Payment Processing** - Razorpay integration for UPI & Card payments
- ⛓️ **Blockchain Recording** - All donations recorded on Polygon for transparency
- 🔒 **Privacy Preserving** - Donor emails are hashed before blockchain storage
- 📊 **Full Transparency** - Anyone can verify donations on PolygonScan

## Quick Start

### 1. Create Python Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy the example environment file
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# Edit .env with your credentials
```

### 4. Run the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --port 8000

# Or using Python directly
python -m app.main
```

### 5. Access API Documentation

Open [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API docs.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application entry
│   ├── config.py         # Environment configuration
│   ├── models/           # Pydantic models
│   │   ├── donation.py
│   │   └── campaign.py
│   ├── routes/           # API endpoints
│   │   ├── campaigns.py
│   │   ├── donations.py
│   │   ├── payments.py
│   │   └── health.py
│   └── services/         # Business logic
│       ├── database.py   # Supabase operations
│       ├── blockchain.py # Web3/Polygon operations
│       └── payment.py    # Razorpay operations
├── requirements.txt
├── .env.example
└── README.md
```

## API Endpoints

### Health
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed service status

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/{id}` - Get campaign details
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/{id}/donations` - Get campaign donations

### Donations
- `GET /api/donations/{id}` - Get donation with blockchain link
- `GET /api/donations/verify/{tx_hash}` - Verify donation on chain
- `GET /api/donations/stats/platform` - Platform statistics

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment signature
- `POST /api/payments/webhook/razorpay` - Razorpay webhook handler
- `GET /api/payments/config` - Get payment configuration

## Configuration

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `RAZORPAY_KEY_ID` | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature secret |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `POLYGON_RPC_URL` | Polygon RPC endpoint |
| `CONTRACT_ADDRESS` | Deployed smart contract address |
| `WALLET_PRIVATE_KEY` | Wallet private key for signing |

## Database Schema (Supabase)

Run these SQL commands in your Supabase SQL editor:

```sql
-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  beneficiary_name TEXT NOT NULL,
  goal_amount DECIMAL NOT NULL,
  raised_amount DECIMAL DEFAULT 0,
  donor_count INTEGER DEFAULT 0,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP
);

-- Donations table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  donor_name TEXT,
  donor_email TEXT,
  amount DECIMAL NOT NULL,
  payment_method TEXT NOT NULL,
  razorpay_payment_id TEXT,
  blockchain_tx_hash TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_donations_campaign ON donations(campaign_id);
CREATE INDEX idx_donations_tx_hash ON donations(blockchain_tx_hash);
CREATE INDEX idx_campaigns_active ON campaigns(is_active);
```

## Webhook Setup

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://your-domain.com/api/payments/webhook/razorpay`
3. Select events: `payment.captured`
4. Copy the webhook secret to your `.env` file

## Development

### Running Tests

```bash
pytest tests/
```

### Code Formatting

```bash
black app/
isort app/
```

## Deployment

### Using Docker

```bash
docker build -t heartchain-backend .
docker run -p 8000:8000 --env-file .env heartchain-backend
```

### Using Railway/Render

1. Connect your repository
2. Set environment variables
3. Deploy with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## License

MIT License - HeartChain 2024
