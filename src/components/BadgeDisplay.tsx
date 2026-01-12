import { Achievement, getTierColor } from "@/types/badges";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgeDisplayProps {
  badge: Achievement;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-lg",
  lg: "w-16 h-16 text-2xl",
};

const BadgeDisplay = ({ badge, size = "md", showTooltip = true, className }: BadgeDisplayProps) => {
  const badgeContent = (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border-2 transition-transform hover:scale-110",
        sizeClasses[size],
        getTierColor(badge.tier),
        className
      )}
    >
      <span>{badge.icon}</span>
    </div>
  );

  if (!showTooltip) {
    return badgeContent;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {badgeContent}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">{badge.name}</p>
          <p className="text-sm text-muted-foreground">{badge.description}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

interface BadgeGridProps {
  badges: Achievement[];
  size?: "sm" | "md" | "lg";
  maxDisplay?: number;
  className?: string;
}

export const BadgeGrid = ({ badges, size = "sm", maxDisplay = 5, className }: BadgeGridProps) => {
  const displayBadges = badges.slice(0, maxDisplay);
  const remaining = badges.length - maxDisplay;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {displayBadges.map((badge) => (
        <BadgeDisplay key={badge.id} badge={badge} size={size} />
      ))}
      {remaining > 0 && (
        <div className={cn(
          "flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium",
          size === "sm" && "w-8 h-8 text-xs",
          size === "md" && "w-12 h-12 text-sm",
          size === "lg" && "w-16 h-16 text-base"
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;
