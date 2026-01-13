# HeartChain Blockchain Integration

## 🔗 Blockchain Transaction Pipeline

HeartChain uses **MetaMask** and **Shardeum Sphinx Testnet** to record all donations transparently on the blockchain.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     HEARTCHAIN DONATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

   User                Frontend              MetaMask             Shardeum
    │                     │                     │                     │
    │  Click Donate       │                     │                     │
    │────────────────────>│                     │                     │
    │                     │                     │                     │
    │                     │  Request Account    │                     │
    │                     │────────────────────>│                     │
    │                     │                     │                     │
    │                     │<─ Account Address ──│                     │
    │                     │                     │                     │
    │                     │  Send Transaction   │                     │
    │                     │────────────────────>│                     │
    │                     │                     │                     │
    │  Confirm in MetaMask│                     │                     │
    │<════════════════════╪═════════════════════│                     │
    │                     │                     │                     │
    │                     │                     │  Broadcast TX       │
    │                     │                     │────────────────────>│
    │                     │                     │                     │
    │                     │                     │<── TX Hash ─────────│
    │                     │                     │                     │
    │                     │<─ TX Hash ──────────│                     │
    │                     │                     │                     │
    │                     │  Wait for Confirm   │                     │
    │                     │────────────────────>│────────────────────>│
    │                     │                     │                     │
    │                     │<─ Block Confirmed ──│<────────────────────│
    │                     │                     │                     │
    │  Success + TX Hash  │                     │                     │
    │<────────────────────│                     │                     │
    │                     │                     │                     │
```

---

## 📍 Where is the Data Located?

### Network Configuration

| Property | Value |
|----------|-------|
| **Network Name** | Shardeum Sphinx 1.X |
| **Chain ID** | 8082 (0x1F92) |
| **Currency Symbol** | SHM |
| **RPC URL** | https://sphinx.shardeum.org/ |
| **Block Explorer** | https://explorer-sphinx.shardeum.org/ |

### File Locations

| Component | File Path | Description |
|-----------|-----------|-------------|
| **Wallet Context** | `src/context/WalletContext.tsx` | MetaMask integration, transaction sending |
| **Pipeline Component** | `src/components/BlockchainPipeline.tsx` | Visual transaction flow |
| **Transactions Page** | `src/pages/Transactions.tsx` | Transaction history & explorer |
| **Donation Modal** | `src/components/DonationModal.tsx` | Payment method selection |
| **Backend Blockchain** | `backend/app/services/blockchain.py` | Backend transaction recording |

---

## 🔐 How Transactions Work

### 1. User Connects MetaMask

```typescript
// In WalletContext.tsx
const connectWallet = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  // User sees their address: 0x7a3...f82d
};
```

### 2. Network Auto-Switch to Shardeum

```typescript
// Automatically adds/switches to Shardeum network
await window.ethereum.request({
  method: "wallet_addEthereumChain",
  params: [{
    chainId: "0x1F92", // 8082
    chainName: "Shardeum Sphinx 1.X",
    rpcUrls: ["https://sphinx.shardeum.org/"],
    blockExplorerUrls: ["https://explorer-sphinx.shardeum.org/"],
  }],
});
```

### 3. Transaction Sent with Donation Data

```typescript
// Campaign data embedded in transaction
const campaignData = ethers.hexlify(
  ethers.toUtf8Bytes(JSON.stringify({
    type: "HEARTCHAIN_DONATION",
    campaignId: "campaign-123",
    campaignTitle: "Help Priya's Surgery",
    amountINR: 5000,
    timestamp: "2026-01-13T09:30:00Z",
  }))
);

const tx = await signer.sendTransaction({
  to: HEARTCHAIN_ADDRESS,
  value: ethers.parseEther("50.0"), // SHM tokens
  data: campaignData,
});
```

### 4. Transaction Hash Generation

When a transaction is broadcast, a unique **66-character hash** is generated:

```
0x742d35Cc6634C0532925a3b844Bc5e7c8D3d3d6e5a3b7c8f9e1a2b3c4d5e6f7890
```

This hash can be used to verify the transaction on the [Shardeum Explorer](https://explorer-sphinx.shardeum.org/).

---

## 📊 Transaction Pipeline Visualization

The pipeline component (`BlockchainPipeline.tsx`) shows 4 stages:

```
┌──────────┐    ┌──────────────┐    ┌───────────────┐    ┌─────────────────┐
│ MetaMask │───>│ TX Signing   │───>│ Network       │───>│ Block           │
│ Wallet   │    │ Verification │    │ Broadcast     │    │ Confirmation    │
└──────────┘    └──────────────┘    └───────────────┘    └─────────────────┘
     ✓               ✓                   ●                     ○
  Complete        Complete            Active               Pending

Legend:
✓ = Complete (Green)
● = Active/Processing (Yellow, animated)
○ = Pending (Gray)
✗ = Failed (Red)
```

---

## 🌐 Viewing Transactions

### In the App

1. Navigate to **Transactions** page (`/transactions`)
2. Click any transaction to see details
3. View the pipeline visualization
4. Click "View on Shardeum Explorer" for blockchain proof

### On Shardeum Explorer

1. Go to https://explorer-sphinx.shardeum.org/
2. Paste the transaction hash in the search bar
3. View full transaction details including:
   - Block number
   - Gas used
   - Input data (contains donation JSON)
   - Timestamp
   - Sender address

---

## 💰 Getting Test SHM Tokens

To make donations on the testnet, you need test SHM tokens:

1. **Join Shardeum Discord**: https://discord.gg/shardeum
2. Go to the `#evm-faucet` channel
3. Type: `/faucet <your_wallet_address>`
4. Receive test SHM tokens in your wallet

---

## 🔧 Technical Details

### Transaction Data Structure

```typescript
interface BlockchainTransaction {
  hash: string;              // 0x742d35Cc...
  campaignId: string;        // UUID
  campaignTitle: string;     // "Help Priya's Surgery"
  amount: number;            // 5000 (INR)
  donorAddress: string;      // 0x7a3...f82d
  timestamp: Date;           // When donated
  status: "pending" | "confirmed" | "failed";
  explorerUrl: string;       // Link to explorer
  blockNumber?: number;      // Block it was mined in
  gasUsed?: string;          // Gas consumed
}
```

### Exchange Rate (Demo)

For demonstration purposes:
```
1 SHM = ₹100 INR (demo rate)
```

In production, integrate with price APIs for real-time rates.

---

## 🚀 Running the Project

### Frontend

```bash
cd heartchain-impact
npm install
npm run dev
# Running at http://localhost:8080
```

### Backend

```bash
cd heartchain-impact/backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# Running at http://localhost:8000
```

---

## 📝 Summary

| Feature | Implementation |
|---------|---------------|
| **Wallet** | MetaMask browser extension |
| **Network** | Shardeum Sphinx Testnet |
| **Token** | SHM (Shardeum native) |
| **Data Storage** | Transaction calldata (JSON encoded) |
| **Verification** | On-chain via explorer |
| **Frontend** | React + ethers.js |
| **Visual Pipeline** | 4-stage animated component |

Every donation creates an **immutable, verifiable record** on the Shardeum blockchain that anyone can verify!
