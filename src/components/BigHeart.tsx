import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BigHeartProps {
  progress: number; // 0-100
  isComplete?: boolean;
  className?: string;
}

const BigHeart = ({ progress, isComplete = false, className }: BigHeartProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Animate progress filling
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 300);
    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    if (isComplete && displayProgress >= 100) {
      setShowCelebration(true);
    }
  }, [isComplete, displayProgress]);

  const fillPercentage = 100 - displayProgress;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Glow effect */}
      <div
        className={cn(
          "absolute w-80 h-80 rounded-full transition-all duration-1000",
          isComplete
            ? "bg-primary/40 blur-3xl animate-pulse scale-125"
            : displayProgress > 50
              ? "bg-primary/25 blur-2xl scale-110"
              : "bg-muted/20 blur-xl"
        )}
      />

      {/* Heartbeat rings for complete state */}
      {isComplete && (
        <>
          <div className="absolute w-72 h-72 rounded-full border-4 border-primary/30 animate-ping" style={{ animationDuration: '1.5s' }} />
          <div className="absolute w-80 h-80 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
        </>
      )}

      {/* Main heart container */}
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Empty heart (black/dark) */}
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 w-full h-full drop-shadow-2xl"
          fill="hsl(var(--foreground) / 0.15)"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>

        {/* Filled heart (red) with animation */}
        <svg
          viewBox="0 0 24 24"
          className={cn(
            "absolute inset-0 w-full h-full transition-all duration-[2000ms] ease-out drop-shadow-2xl",
            isComplete && "animate-heartbeat origin-center"
          )}
          style={{
            // Don't use clipPath for completed hearts to prevent box showing during scale animation
            clipPath: isComplete ? 'none' : `inset(${fillPercentage}% 0 0 0)`,
            filter: isComplete ? 'drop-shadow(0 0 30px hsl(var(--primary)))' : 'none',
          }}
        >
          <defs>
            <linearGradient id="bigHeartGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(350, 85%, 50%)" />
              <stop offset="50%" stopColor="hsl(350, 85%, 60%)" />
              <stop offset="100%" stopColor="hsl(330, 80%, 55%)" />
            </linearGradient>
          </defs>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#bigHeartGradient)"
          />
        </svg>

        {/* Percentage display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-display font-bold text-4xl md:text-5xl transition-colors duration-500",
              isComplete ? "text-primary-foreground" : displayProgress > 50 ? "text-primary-foreground" : "text-foreground"
            )}
          >
            {Math.min(Math.round(displayProgress), 100)}%
          </span>
          <span className={cn(
            "text-sm font-medium mt-1 transition-colors duration-500",
            isComplete ? "text-primary-foreground/80" : displayProgress > 50 ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {isComplete ? "FUNDED!" : "funded"}
          </span>
        </div>
      </div>

      {/* Celebration particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-celebration"
              style={{
                left: `${50 + (Math.random() - 0.5) * 80}%`,
                top: `${50 + (Math.random() - 0.5) * 80}%`,
                backgroundColor: [
                  "hsl(var(--primary))",
                  "hsl(var(--secondary))",
                  "hsl(var(--success))",
                  "hsl(var(--accent))",
                  "hsl(350, 85%, 70%)",
                ][i % 5],
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1.5 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BigHeart;
