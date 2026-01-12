import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Campaign, CampaignCategory, Subcategory } from "@/types/campaign";
import CampaignCard from "./CampaignCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, Heart, AlertTriangle, Sparkles } from "lucide-react";

interface CampaignGridProps {
  campaigns: Campaign[];
  title?: string;
  showFilters?: boolean;
}

const categoryFilters: { value: CampaignCategory | "all"; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All Campaigns", icon: Sparkles },
  { value: "people", label: "People", icon: Users },
  { value: "causes", label: "Causes", icon: Heart },
];

const urgencyFilters = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "Urgent" },
  { value: "medium", label: "Active" },
];

const CampaignGrid = ({ campaigns, title, showFilters = true }: CampaignGridProps) => {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState<CampaignCategory | "all">("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesCategory = categoryFilter === "all" || campaign.category === categoryFilter;
    const matchesUrgency = urgencyFilter === "all" || campaign.urgencyLevel === urgencyFilter;
    return matchesCategory && matchesUrgency;
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section header */}
        {title && (
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {title}
            </h2>
            <Button variant="outline" className="hidden md:flex">
              View All
            </Button>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Category filter */}
            <div className="flex gap-2">
              {categoryFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={categoryFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(filter.value)}
                  className={cn(
                    categoryFilter === filter.value && "gradient-heart border-0"
                  )}
                >
                  <filter.icon className="w-4 h-4 mr-1" />
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Urgency filter */}
            <div className="flex gap-2 md:ml-auto">
              {urgencyFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={urgencyFilter === filter.value ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setUrgencyFilter(filter.value)}
                  className={cn(
                    filter.value === "critical" && urgencyFilter === filter.value && "bg-urgent text-urgent-foreground"
                  )}
                >
                  {filter.value === "critical" && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Campaign grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCampaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CampaignCard 
                campaign={campaign} 
                onClick={() => navigate(`/campaign/${campaign.id}`)}
              />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No campaigns found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to find more campaigns.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CampaignGrid;
