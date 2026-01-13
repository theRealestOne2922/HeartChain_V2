import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HeartProgressProps {
  progress: number; // 0-100
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  showPercentage?: boolean;
  animate?: boolean;
  showMilestones?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
  "2xl": "w-64 h-64",
  "3xl": "w-80 h-80",
};

const HeartProgress = ({
  progress,
  size = "md",
  showPercentage = false,
  animate = true,
  showMilestones = false,
  className,
}: HeartProgressProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animate]);

  // Trigger confetti at milestones
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const hitMilestone = milestones.some(
      (m) => displayProgress >= m && displayProgress - 1 < m
    );
    if (hitMilestone && displayProgress > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
  }, [displayProgress]);

  const fillPercentage = 100 - displayProgress;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Glow effect behind heart */}
      <div
        className={cn(
          "absolute rounded-full bg-primary/20 blur-xl transition-all duration-1000",
          sizeClasses[size],
          displayProgress > 50 && "bg-primary/30 blur-2xl scale-110"
        )}
      />

      {/* Heart container */}
      <div className={cn("relative", sizeClasses[size])}>
        {/* Background heart (empty) */}
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 w-full h-full text-muted"
          fill="currentColor"
          style={{
            shapeRendering: 'geometricPrecision',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>

        {/* Filled heart with clip animation */}
        <svg
          viewBox="0 0 24 24"
          className={cn(
            "absolute inset-0 w-full h-full transition-all duration-1000 ease-out",
            displayProgress > 0 && animate && "animate-heart-pulse"
          )}
          style={{
            clipPath: `inset(${fillPercentage}% 0 0 0)`,
            shapeRendering: 'geometricPrecision',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
          }}
        >
          <defs>
            <linearGradient id={`heartGradient-${size}-${Math.random().toString(36).substr(2, 9)}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(350, 85%, 60%)" />
              <stop offset="100%" stopColor="hsl(350, 90%, 70%)" />
            </linearGradient>
          </defs>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="hsl(350, 85%, 60%)"
          />
        </svg>

        {/* Milestone markers */}
        {showMilestones && (
          <>
            {[25, 50, 75].map((milestone) => (
              <div
                key={milestone}
                className={cn(
                  "absolute left-0 right-0 h-0.5 bg-background/50",
                  "transition-opacity duration-300",
                  displayProgress >= milestone ? "opacity-0" : "opacity-100"
                )}
                style={{ bottom: `${milestone}%` }}
              />
            ))}
          </>
        )}
      </div>

      {/* Percentage display */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "font-display font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]",
              size === "sm" && "text-[10px]",
              size === "md" && "text-sm",
              size === "lg" && "text-lg",
              size === "xl" && "text-2xl",
              size === "2xl" && "text-3xl",
              size === "3xl" && "text-4xl"
            )}
          >
            {Math.round(displayProgress)}%
          </span>
        </div>
      )
      }

      {/* Confetti effect */}
      {
        showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${50 + (Math.random() - 0.5) * 60}%`,
                  top: "50%",
                  backgroundColor: [
                    "hsl(var(--primary))",
                    "hsl(var(--secondary))",
                    "hsl(var(--success))",
                    "hsl(var(--accent))",
                  ][i % 4],
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        )
      }
    </div >
  );
};

export default HeartProgress;
