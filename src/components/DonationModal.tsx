import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Campaign } from "@/types/campaign";
import { Heart, Wallet, CreditCard, Sparkles, Smartphone, Shield, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";

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
  { id: "crypto" as PaymentMethod, label: "Crypto", icon: Wallet, description: "MetaMask Wallet" },
];

const DonationModal = ({ campaign, isOpen, onClose, onDonate }: DonationModalProps) => {
  const { isConnected, requireWallet, connectWallet } = useWallet();
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");

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

    // Only require wallet for crypto payments
    if (paymentMethod === "crypto" && !isConnected) {
      requireWallet();
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    onDonate(amount, message, isAnonymous);
    setIsProcessing(false);
    onClose();
  };

  const remainingToGoal = campaign.goalAmount - campaign.raisedAmount;
  const percentageContribution = ((amount / campaign.goalAmount) * 100).toFixed(2);

  const getProcessingText = () => {
    switch (paymentMethod) {
      case "upi": return "Processing via UPI...";
      case "card": return "Processing Payment...";
      case "crypto": return "Confirming on Blockchain...";
    }
  };

  const getButtonIcon = () => {
    switch (paymentMethod) {
      case "upi": return <Smartphone className="w-5 h-5" />;
      case "card": return <CreditCard className="w-5 h-5" />;
      case "crypto": return <Wallet className="w-5 h-5" />;
    }
  };

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
                      : "border-border hover:border-primary/50"
                  )}
                >
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

          {/* Crypto wallet connection prompt */}
          {paymentMethod === "crypto" && !isConnected && (
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl">
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                Connect your wallet to donate with cryptocurrency
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={connectWallet}
                className="border-orange-500 text-orange-600 hover:bg-orange-100"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
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
            disabled={amount < 1 || isProcessing || (paymentMethod === "crypto" && !isConnected)}
            className="w-full h-14 text-lg font-display font-semibold gradient-heart hover:opacity-90 transition-opacity"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              All donations are recorded on the blockchain for transparency
            </span>
          </div>

          {/* Payment methods info */}
          <p className="text-[11px] text-muted-foreground text-center">
            {paymentMethod === "upi" && "You'll be redirected to your UPI app to complete payment"}
            {paymentMethod === "card" && "Secure payment processed via Razorpay"}
            {paymentMethod === "crypto" && "Direct transfer from your connected wallet"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
