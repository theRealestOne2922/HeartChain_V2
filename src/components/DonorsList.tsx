import { Donation } from "@/types/campaign";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, ExternalLink } from "lucide-react";

interface DonorsListProps {
  donations: Donation[];
  className?: string;
}

const DonorsList = ({ donations, className }: DonorsListProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
        <Heart className="w-5 h-5 text-primary fill-primary" />
        Recent Donors ({donations.length})
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {donations.map((donation, index) => (
          <div
            key={donation.id}
            className={cn(
              "p-4 bg-card rounded-xl border border-border transition-all hover:border-primary/30 hover:shadow-md",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                  {donation.isAnonymous ? "?" : donation.donorName.charAt(0)}
                </div>
                
                <div>
                  <p className="font-semibold text-foreground">
                    {donation.isAnonymous ? "Anonymous Hero" : donation.donorName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(donation.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-display font-bold text-lg text-primary">
                  ${donation.amount.toLocaleString()}
                </p>
                {donation.transactionHash && (
                  <a
                    href={`https://polygonscan.com/tx/${donation.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline flex items-center gap-1 justify-end"
                  >
                    Verify <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {donation.message && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="italic">"{donation.message}"</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {donations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Be the first to donate!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorsList;
