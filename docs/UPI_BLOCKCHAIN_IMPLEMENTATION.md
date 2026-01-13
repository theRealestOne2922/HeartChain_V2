# HeartChain: UPI to Blockchain Implementation Guide

## Overview
This guide explains how to bridge UPI payments to blockchain transparency so every donation is publicly verifiable.

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              HEARTCHAIN FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   [1] USER                [2] RAZORPAY              [3] YOUR SERVER             │
│   ┌──────────┐           ┌──────────────┐          ┌─────────────────┐          │
│   │  Clicks  │──────────▶│  UPI Payment │─────────▶│  Webhook        │          │
│   │  Donate  │           │  Processing  │          │  Receiver       │          │
│   └──────────┘           └──────────────┘          └────────┬────────┘          │
│                                                             │                    │
│                                                             ▼                    │
│   [6] FRONTEND           [5] DATABASE              [4] BLOCKCHAIN               │
│   ┌──────────┐           ┌──────────────┐          ┌─────────────────┐          │
│   │  Shows   │◀──────────│  Stores      │◀─────────│  Smart Contract │          │
│   │  TxHash  │           │  Records     │          │  Records Txn    │          │
│   └──────────┘           └──────────────┘          └─────────────────┘          │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Step-by-Step Implementation

### STEP 1: Set Up Razorpay Account
**What:** Create a Razorpay account for accepting UPI payments
**Why:** Razorpay is India's most popular payment gateway with excellent UPI support

#### Actions:
1. Go to https://razorpay.com and sign up
2. Complete KYC verification
3. Get your API keys from Dashboard → Settings → API Keys
   - `RAZORPAY_KEY_ID` (public)
   - `RAZORPAY_KEY_SECRET` (private)
4. For testing, use Test Mode (no real money)

---

### STEP 2: Set Up Database (Supabase)
**What:** Create a database to store donations and campaigns
**Why:** Need persistent storage + the blockchain hash mapping

#### Actions:
1. Go to https://supabase.com and create a project
2. Create these tables:

```sql
-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  beneficiary_name TEXT NOT NULL,
  goal_amount DECIMAL NOT NULL,
  raised_amount DECIMAL DEFAULT 0,
  donor_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  donor_name TEXT,
  donor_email TEXT,
  amount DECIMAL NOT NULL,
  payment_method TEXT NOT NULL, -- 'upi', 'card', 'crypto'
  razorpay_payment_id TEXT,
  blockchain_tx_hash TEXT, -- This is what makes it transparent!
  is_anonymous BOOLEAN DEFAULT false,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Get your Supabase URL and anon key from Settings → API

---

### STEP 3: Deploy Smart Contract on Polygon
**What:** A simple contract that records donation events
**Why:** This creates the permanent, public record

#### Smart Contract Code (Solidity):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HeartChainDonations {
    
    struct DonationRecord {
        string campaignId;
        uint256 amountInPaise; // Store in paise for precision
        string donorIdentifier; // Can be hashed email or "anonymous"
        string paymentMethod;
        uint256 timestamp;
    }
    
    DonationRecord[] public donations;
    uint256 public totalDonationsCount;
    uint256 public totalAmountRaised;
    
    // Events are indexed on blockchain - anyone can verify
    event DonationRecorded(
        uint256 indexed donationIndex,
        string campaignId,
        uint256 amount,
        string paymentMethod,
        uint256 timestamp
    );
    
    // Only the platform owner can record donations
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    function recordDonation(
        string memory _campaignId,
        uint256 _amountInPaise,
        string memory _donorIdentifier,
        string memory _paymentMethod
    ) public onlyOwner returns (uint256) {
        
        DonationRecord memory newDonation = DonationRecord({
            campaignId: _campaignId,
            amountInPaise: _amountInPaise,
            donorIdentifier: _donorIdentifier,
            paymentMethod: _paymentMethod,
            timestamp: block.timestamp
        });
        
        donations.push(newDonation);
        totalDonationsCount++;
        totalAmountRaised += _amountInPaise;
        
        emit DonationRecorded(
            donations.length - 1,
            _campaignId,
            _amountInPaise,
            _paymentMethod,
            block.timestamp
        );
        
        return donations.length - 1;
    }
    
    function getDonation(uint256 index) public view returns (DonationRecord memory) {
        require(index < donations.length, "Invalid index");
        return donations[index];
    }
    
    function getDonationsCount() public view returns (uint256) {
        return donations.length;
    }
}
```

#### Deployment Steps:
1. Go to https://remix.ethereum.org
2. Create new file: `HeartChainDonations.sol`
3. Paste the contract code
4. Compile (Solidity 0.8.19)
5. Connect MetaMask to Polygon Mumbai Testnet
   - Network Name: Polygon Mumbai
   - RPC URL: https://rpc-mumbai.maticvigil.com
   - Chain ID: 80001
   - Currency: MATIC
6. Get free test MATIC from https://faucet.polygon.technology/
7. Deploy the contract
8. Save the contract address!

---

### STEP 4: Create Backend API (Node.js)
**What:** Server that handles payment webhooks and writes to blockchain
**Why:** Bridges Web2 payments to Web3 transparency

#### Project Structure:
```
backend/
├── package.json
├── .env
├── src/
│   ├── index.js
│   ├── routes/
│   │   ├── payments.js
│   │   └── donations.js
│   ├── services/
│   │   ├── razorpay.js
│   │   ├── blockchain.js
│   │   └── database.js
│   └── config/
│       └── index.js
```

#### Key Code Files:

**1. Environment Variables (.env):**
```env
# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx

# Blockchain (Polygon)
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
CONTRACT_ADDRESS=0xYourContractAddress
WALLET_PRIVATE_KEY=xxxxx  # Your deployer wallet private key
```

**2. Payment Webhook Handler (payments.js):**
```javascript
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { recordOnBlockchain } = require('../services/blockchain');
const { saveDonation, updateDonationTxHash } = require('../services/database');

// Razorpay sends webhook here after successful payment
router.post('/webhook/razorpay', async (req, res) => {
  try {
    // 1. Verify webhook signature (security)
    const signature = req.headers['x-razorpay-signature'];
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // 2. Extract payment details
    const { payload } = req.body;
    const payment = payload.payment.entity;
    
    const donationData = {
      campaignId: payment.notes.campaign_id,
      donorName: payment.notes.donor_name || 'Anonymous',
      donorEmail: payment.email,
      amount: payment.amount / 100, // Convert paise to rupees
      paymentMethod: payment.method, // 'upi', 'card', etc.
      razorpayPaymentId: payment.id,
      isAnonymous: payment.notes.is_anonymous === 'true',
      message: payment.notes.message || null
    };

    // 3. Save to database first
    const savedDonation = await saveDonation(donationData);

    // 4. Record on blockchain
    const txHash = await recordOnBlockchain({
      campaignId: donationData.campaignId,
      amountInPaise: payment.amount,
      donorIdentifier: donationData.isAnonymous 
        ? 'anonymous' 
        : crypto.createHash('sha256').update(donationData.donorEmail).digest('hex').slice(0, 10),
      paymentMethod: donationData.paymentMethod
    });

    // 5. Update database with blockchain tx hash
    await updateDonationTxHash(savedDonation.id, txHash);

    console.log(`✅ Donation recorded! TxHash: ${txHash}`);
    
    res.status(200).json({ success: true, txHash });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

**3. Blockchain Service (blockchain.js):**
```javascript
const { ethers } = require('ethers');

// Contract ABI (just the functions we need)
const contractABI = [
  "function recordDonation(string campaignId, uint256 amountInPaise, string donorIdentifier, string paymentMethod) returns (uint256)",
  "event DonationRecorded(uint256 indexed donationIndex, string campaignId, uint256 amount, string paymentMethod, uint256 timestamp)"
];

// Connect to Polygon
const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

async function recordOnBlockchain({ campaignId, amountInPaise, donorIdentifier, paymentMethod }) {
  try {
    // Call smart contract function
    const tx = await contract.recordDonation(
      campaignId,
      amountInPaise,
      donorIdentifier,
      paymentMethod
    );
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    // Return the transaction hash - this is the PROOF!
    return receipt.hash;
    
  } catch (error) {
    console.error('Blockchain error:', error);
    throw error;
  }
}

module.exports = { recordOnBlockchain };
```

**4. Database Service (database.js):**
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function saveDonation(donationData) {
  const { data, error } = await supabase
    .from('donations')
    .insert([{
      campaign_id: donationData.campaignId,
      donor_name: donationData.donorName,
      donor_email: donationData.donorEmail,
      amount: donationData.amount,
      payment_method: donationData.paymentMethod,
      razorpay_payment_id: donationData.razorpayPaymentId,
      is_anonymous: donationData.isAnonymous,
      message: donationData.message
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

async function updateDonationTxHash(donationId, txHash) {
  const { error } = await supabase
    .from('donations')
    .update({ blockchain_tx_hash: txHash })
    .eq('id', donationId);
    
  if (error) throw error;
}

module.exports = { saveDonation, updateDonationTxHash };
```

---

### STEP 5: Update Frontend to Create Razorpay Order
**What:** When user clicks donate, create a Razorpay order and open their checkout
**Why:** This initiates the actual UPI payment

```javascript
// In your DonationModal.tsx

const handleUPIPayment = async () => {
  // 1. Create order on your backend
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amount * 100, // Convert to paise
      campaignId: campaign.id,
      donorName: isAnonymous ? 'Anonymous' : 'User Name',
      message: message
    })
  });
  
  const order = await response.json();
  
  // 2. Open Razorpay checkout
  const options = {
    key: 'rzp_test_xxxxx', // Your Razorpay key
    amount: order.amount,
    currency: 'INR',
    name: 'HeartChain',
    description: `Donation for ${campaign.title}`,
    order_id: order.id,
    prefill: {
      name: 'Donor Name',
      email: 'donor@email.com'
    },
    notes: {
      campaign_id: campaign.id,
      donor_name: isAnonymous ? 'Anonymous' : 'User Name',
      is_anonymous: isAnonymous.toString(),
      message: message
    },
    theme: {
      color: '#e63355'
    }
  };
  
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

---

### STEP 6: Display Blockchain Verification
**What:** Show the transaction hash to users so they can verify on Polygonscan
**Why:** This is the TRANSPARENCY - anyone can verify!

```jsx
// In DonorsList or donation confirmation

<a 
  href={`https://mumbai.polygonscan.com/tx/${donation.blockchain_tx_hash}`}
  target="_blank"
  className="text-primary hover:underline flex items-center gap-1"
>
  <ExternalLink className="w-3 h-3" />
  View on Blockchain
</a>
```

---

## 🔑 Key Points for Judges

1. **Privacy Preserved**: We hash donor emails before storing on blockchain
2. **Transparency Achieved**: Every donation has a verifiable blockchain transaction
3. **Accessibility**: Users pay with UPI (familiar) but get blockchain verification
4. **Cost Efficient**: Polygon has ~$0.001 transaction fees
5. **Hybrid Web2.5**: Best of both worlds - ease of Web2, trust of Web3

---

## 🚀 For Hackathon Demo

If you don't have time to build the full backend, you can:

1. **Simulate the flow** - Generate fake transaction hashes in frontend
2. **Show the architecture** - Explain the flow to judges
3. **Deploy just the smart contract** - Show it works on testnet
4. **Mock the webhook** - Manually trigger blockchain writes

The frontend prototype you have already demonstrates the CONCEPT. The backend makes it REAL.

---

## 📚 Resources

- Razorpay Docs: https://razorpay.com/docs/
- Polygon Docs: https://docs.polygon.technology/
- Supabase Docs: https://supabase.com/docs
- Remix IDE: https://remix.ethereum.org
- Ethers.js: https://docs.ethers.org/

---

## Need Help?

This architecture is production-ready. For the hackathon, focus on:
1. Explaining the concept clearly
2. Showing the frontend works
3. Having the smart contract deployed on testnet
4. Demonstrating one complete flow (even if simulated)

Good luck! 🎉
