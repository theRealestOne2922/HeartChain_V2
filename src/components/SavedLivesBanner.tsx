import { Campaign } from "@/types/campaign";
import { Heart, Sparkles, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedLivesBannerProps {
  campaign: Campaign;
  className?: string;
}

const SavedLivesBanner = ({ campaign, className }: SavedLivesBannerProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-8 text-center",
        "bg-gradient-to-br from-success via-accent to-primary",
        className
      )}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <PartyPopper className="w-8 h-8 text-white animate-bounce" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Life Saved!
          </h2>
          <PartyPopper className="w-8 h-8 text-white animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        <p className="text-white/90 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Thanks to the incredible generosity of {campaign.donorCount.toLocaleString('en-IN')} donors,{" "}
          <span className="font-semibold">{campaign.beneficiaryName}</span> has received the full support they needed!
        </p>

        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
            <p className="text-white/80 text-sm">Total Raised</p>
            <p className="font-display text-2xl font-bold text-white">
              ₹{campaign.raisedAmount.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
            <p className="text-white/80 text-sm">Hearts United</p>
            <p className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 fill-white" />
              {campaign.donorCount.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
            <p className="text-white/80 text-sm">Goal Reached</p>
            <p className="font-display text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              100%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedLivesBanner;
