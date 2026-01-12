import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Campaign } from "@/types/campaign";
import { Heart, Wallet, CreditCard, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DonationModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onDonate: (amount: number, message: string, isAnonymous: boolean) => void;
}

const presetAmounts = [10, 25, 50, 100, 250, 500];

const DonationModal = ({ campaign, isOpen, onClose, onDonate }: DonationModalProps) => {
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
    
    setIsProcessing(true);
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    onDonate(amount, message, isAnonymous);
    setIsProcessing(false);
    onClose();
  };

  const remainingToGoal = campaign.goalAmount - campaign.raisedAmount;
  const percentageContribution = ((amount / campaign.goalAmount) * 100).toFixed(2);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            Make a Donation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
                ${remainingToGoal.toLocaleString()} still needed
              </p>
            </div>
          </div>

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
                    "h-12 font-display font-semibold text-lg",
                    amount === preset && !customAmount && "gradient-heart border-0"
                  )}
                >
                  ${preset}
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
                $
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
                Your ${amount.toLocaleString()} donation will fill{" "}
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
              rows={3}
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
            disabled={amount < 1 || isProcessing}
            className="w-full h-14 text-lg font-display font-semibold gradient-heart hover:opacity-90 transition-opacity"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing on Blockchain...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Donate ${amount.toLocaleString()}
              </span>
            )}
          </Button>

          {/* Payment methods hint */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              Card
            </span>
            <span className="flex items-center gap-1">
              <Wallet className="w-4 h-4" />
              Crypto
            </span>
            <span>Secured by Blockchain</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
