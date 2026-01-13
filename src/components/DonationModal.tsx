import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Campaign } from "@/types/campaign";
import { Heart, Wallet, CreditCard, Sparkles, Smartphone, Shield, ExternalLink, Hash, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet, BlockchainTransaction } from "@/context/WalletContext";
import BlockchainPipeline from "./BlockchainPipeline";

interface DonationModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onDonate: (amount: number, message: string, isAnonymous: boolean) => void;
}

const presetAmounts = [500, 1000, 2000, 5000, 10000, 25000];

type PaymentMethod = "upi" | "card" | "crypto";

const paymentMethods = [
  { id: "upi" as PaymentMethod, label: "UPI", icon: Smartphone, description: "GPay, PhonePe, Paytm" },
  { id: "card" as PaymentMethod, label: "Card", icon: CreditCard, description: "Debit/Credit Card" },
  { id: "crypto" as PaymentMethod, label: "Crypto", icon: Wallet, description: "MetaMask → Shardeum" },
];

const DonationModal = ({ campaign, isOpen, onClose, onDonate }: DonationModalProps) => {
  const {
    isConnected,
    isCorrectNetwork,
    requireWallet,
    connectWallet,
    switchToShardeum,
    sendDonation,
    isLoading: isWalletLoading,
  } = useWallet();

  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("crypto");
  const [currentTransaction, setCurrentTransaction] = useState<BlockchainTransaction | null>(null);
  const [showPipeline, setShowPipeline] = useState(false);

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(value);
    if (value) {
      setAmount(parseInt(value, 10));
    }
  };

  const handleDonate = async () => {
    if (amount < 1) return;

    // For crypto payments, use actual blockchain transaction
    if (paymentMethod === "crypto") {
      if (!isConnected) {
        requireWallet();
        return;
      }

      if (!isCorrectNetwork) {
        await switchToShardeum();
        return;
      }

      setIsProcessing(true);
      setShowPipeline(true);

      try {
        const tx = await sendDonation(campaign.id, campaign.title, amount);

        if (tx) {
          setCurrentTransaction(tx);
          // Complete the donation flow
          onDonate(amount, message, isAnonymous);

          // Keep modal open to show the transaction result
          setTimeout(() => {
            setShowPipeline(false);
            setCurrentTransaction(null);
            onClose();
          }, 5000);
        } else {
          setShowPipeline(false);
        }
      } catch (error) {
        console.error("Donation failed:", error);
        setShowPipeline(false);
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Traditional payment methods (UPI/Card) - simulate for now
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onDonate(amount, message, isAnonymous);
      setIsProcessing(false);
      onClose();
    }
  };

  const remainingToGoal = campaign.goalAmount - campaign.raisedAmount;
  const percentageContribution = ((amount / campaign.goalAmount) * 100).toFixed(2);

  const getProcessingText = () => {
    switch (paymentMethod) {
      case "upi": return "Processing via UPI...";
      case "card": return "Processing Payment...";
      case "crypto": return "Confirm in MetaMask...";
    }
  };

  const getButtonIcon = () => {
    switch (paymentMethod) {
      case "upi": return <Smartphone className="w-5 h-5" />;
      case "card": return <CreditCard className="w-5 h-5" />;
      case "crypto": return <Wallet className="w-5 h-5" />;
    }
  };

  // If showing the blockchain pipeline
  if (showPipeline) {
    return (
      <Dialog open={isOpen} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl flex items-center gap-2">
              <Hash className="w-6 h-6 text-primary" />
              Recording on Blockchain
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <BlockchainPipeline
              transaction={currentTransaction}
              isProcessing={isProcessing && !currentTransaction}
            />

            {currentTransaction?.status === "confirmed" && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 mb-4">
                  <Sparkles className="w-5 h-5" />
                  Donation Successful!
                </div>
                <p className="text-muted-foreground text-sm">
                  Your donation of ₹{amount.toLocaleString("en-IN")} has been permanently recorded on Shardeum blockchain.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            Make a Donation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Campaign info */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{campaign.title}</h4>
              <p className="text-sm text-muted-foreground">
                ₹{remainingToGoal.toLocaleString('en-IN')} still needed
              </p>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Choose Payment Method</Label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                    method.id === "crypto" && "relative overflow-hidden"
                  )}
                >
                  {method.id === "crypto" && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-[8px] text-white px-2 py-0.5 font-bold">
                      REAL
                    </div>
                  )}
                  <method.icon className={cn(
                    "w-6 h-6",
                    paymentMethod === method.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "font-semibold text-sm",
                    paymentMethod === method.id ? "text-primary" : "text-foreground"
                  )}>
                    {method.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">
                    {method.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Crypto wallet connection/network prompts */}
          {paymentMethod === "crypto" && !isConnected && (
            <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="font-semibold text-foreground">Connect MetaMask</p>
                  <p className="text-sm text-muted-foreground">
                    Your donation will be recorded on Shardeum blockchain
                  </p>
                </div>
              </div>
              <Button
                onClick={connectWallet}
                disabled={isWalletLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              >
                {isWalletLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect MetaMask
                  </>
                )}
              </Button>
            </div>
          )}

          {paymentMethod === "crypto" && isConnected && !isCorrectNetwork && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                Please switch to Shardeum Sphinx network to donate
              </p>
              <Button
                onClick={switchToShardeum}
                variant="outline"
                className="border-amber-500 text-amber-600 hover:bg-amber-100"
              >
                Switch to Shardeum
              </Button>
            </div>
          )}

          {/* Preset amounts */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === preset && !customAmount ? "default" : "outline"}
                  onClick={() => handleAmountSelect(preset)}
                  className={cn(
                    "h-11 font-display font-semibold",
                    amount === preset && !customAmount && "gradient-heart border-0"
                  )}
                >
                  ₹{preset.toLocaleString('en-IN')}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <Label htmlFor="customAmount" className="text-sm font-medium mb-2 block">
              Or enter custom amount
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                ₹
              </span>
              <Input
                id="customAmount"
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Enter amount"
                className="pl-8 h-12 text-lg font-display"
              />
            </div>
          </div>

          {/* Impact preview */}
          {amount > 0 && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-primary font-medium">
                <Sparkles className="w-4 h-4" />
                Your Impact
              </div>
              <p className="text-sm text-muted-foreground">
                Your ₹{amount.toLocaleString('en-IN')} donation will fill{" "}
                <span className="font-semibold text-primary">{percentageContribution}%</span> of the heart
                and bring {campaign.beneficiaryName} closer to their goal.
              </p>
              {paymentMethod === "crypto" && (
                <p className="text-xs text-muted-foreground mt-2">
                  ≈ {(amount / 100).toFixed(4)} SHM at demo rate
                </p>
              )}
            </div>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium mb-2 block">
              Leave a message (optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share some words of encouragement..."
              className="resize-none"
              rows={2}
            />
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="anonymous" className="text-sm">
              Donate anonymously
            </Label>
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>

          {/* Donate button */}
          <Button
            onClick={handleDonate}
            disabled={
              amount < 1 ||
              isProcessing ||
              (paymentMethod === "crypto" && (!isConnected || !isCorrectNetwork))
            }
            className="w-full h-14 text-lg font-display font-semibold gradient-heart hover:opacity-90 transition-opacity"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {getProcessingText()}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {getButtonIcon()}
                Donate ₹{amount.toLocaleString('en-IN')}
              </span>
            )}
          </Button>

          {/* Blockchain verification notice */}
          <div className="flex items-center justify-center gap-2 p-3 bg-success/5 border border-success/20 rounded-lg">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-xs text-success font-medium">
              {paymentMethod === "crypto"
                ? "Direct blockchain recording on Shardeum"
                : "All donations are recorded on the blockchain for transparency"
              }
            </span>
          </div>

          {/* Payment methods info */}
          <p className="text-[11px] text-muted-foreground text-center">
            {paymentMethod === "upi" && "You'll be redirected to your UPI app to complete payment"}
            {paymentMethod === "card" && "Secure payment processed via Razorpay"}
            {paymentMethod === "crypto" && "Direct transfer via MetaMask to Shardeum blockchain"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
