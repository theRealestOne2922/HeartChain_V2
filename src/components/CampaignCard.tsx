import { Campaign } from "@/types/campaign";
import HeartProgress from "./HeartProgress";
import { cn } from "@/lib/utils";
import { MapPin, Users, Clock, BadgeCheck, AlertTriangle } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
}

const urgencyStyles = {
  critical: "bg-urgent text-urgent-foreground animate-urgent-pulse",
  high: "bg-urgent/80 text-urgent-foreground",
  medium: "bg-accent text-accent-foreground",
  low: "bg-muted text-muted-foreground",
};

const urgencyLabels = {
  critical: "CRITICAL",
  high: "Urgent",
  medium: "Active",
  low: "Ongoing",
};

const CampaignCard = ({ campaign, onClick }: CampaignCardProps) => {
  const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
  const formattedRaised = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(campaign.raisedAmount);

  const formattedGoal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(campaign.goalAmount);

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden cursor-pointer",
        "shadow-card hover:shadow-elevated transition-all duration-300",
        "hover:-translate-y-1",
        campaign.urgencyLevel === "critical" && "ring-2 ring-urgent/50"
      )}
    >
      {/* Image section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Urgency badge */}
        <div
          className={cn(
            "absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
            urgencyStyles[campaign.urgencyLevel]
          )}
        >
          {campaign.urgencyLevel === "critical" && (
            <AlertTriangle className="w-3 h-3" />
          )}
          {urgencyLabels[campaign.urgencyLevel]}
        </div>

        {/* Verified badge */}
        {campaign.isVerified && (
          <div className="absolute top-3 right-3 bg-success text-success-foreground px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" />
            Verified
          </div>
        )}

        {/* Heart progress overlay */}
        <div className="absolute bottom-3 right-3">
          <HeartProgress progress={progress} size="sm" animate={false} showPercentage={true} />
        </div>
      </div>

      {/* Content section */}
      <div className="p-5">
        {/* Category tag */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-secondary uppercase tracking-wide">
            {campaign.subcategory.replace("-", " ")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {campaign.title}
        </h3>

        {/* Beneficiary info */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <span className="font-medium text-foreground">{campaign.beneficiaryName}</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {campaign.location}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-heart rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-lg text-foreground">
              {formattedRaised}
            </p>
            <p className="text-xs text-muted-foreground">
              raised of {formattedGoal}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {campaign.donorCount.toLocaleString('en-IN')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {campaign.daysLeft}d
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
