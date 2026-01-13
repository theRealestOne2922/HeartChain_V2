import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCampaigns } from "@/context/CampaignContext";
import { useUser } from "@/context/UserContext";
import { Donation } from "@/types/campaign";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BigHeart from "@/components/BigHeart";
import DonationModal from "@/components/DonationModal";
import DonorsList from "@/components/DonorsList";
import SavedLivesBanner from "@/components/SavedLivesBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  BadgeCheck,
  AlertTriangle,
  Share2,
  Heart,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock donations for demo
const generateMockDonations = (campaignId: string, count: number): Donation[] => {
  const names = ["Ananya S.", "Rohan K.", "Priya P.", "Vikram S.", "Neha V.", "Arjun R.", "Meera I.", "Suresh K."];
  const messages = [
    "Stay strong! We're all rooting for you!",
    "Sending love and prayers your way.",
    "Every little bit helps. Keep fighting!",
    "You got this! The community is behind you.",
    "",
    "Wishing you a speedy recovery!",
    "Hope this helps. Stay positive!",
    "",
    "600 rupees sent with love",
    "",
  ];

  return Array.from({ length: count }).map((_, i) => ({
    id: `donation-${campaignId}-${i}`,
    campaignId,
    donorName: names[i % names.length],
    amount: [500, 1000, 2000, 5000, 10000, 25000, 50000][Math.floor(Math.random() * 7)],
    message: messages[i % messages.length] || undefined,
    isAnonymous: Math.random() > 0.7,
    transactionHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  }));
};

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaigns, updateCampaign } = useCampaigns();
  const { processDonation } = useUser();
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  // Handler to open donation modal
  const handleOpenDonation = () => {
    setIsDonationOpen(true);
  };

  // Directly access campaign from context to ensure real-time updates
  const campaign = campaigns.find((c) => c.id === id);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    if (campaign) {
      // Only generate initial mock donations if usage is low (prevents overwrite on re-render)
      // Or just keep it simple for now, maybe use a ref to track if generated
      if (donations.length === 0) {
        setDonations(generateMockDonations(campaign.id, Math.min(campaign.donorCount, 20)));
      }
    }
  }, [campaign?.id]); // Only re-run if ID changes

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Campaign Not Found</h1>
          <p className="text-muted-foreground mb-6">This campaign may have ended or doesn't exist.</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const progress = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
  const isComplete = progress >= 100;

  const handleDonate = (amount: number, message: string, isAnonymous: boolean) => {
    // Simulate donation
    const newDonation: Donation = {
      id: `donation-new-${Date.now()}`,
      campaignId: campaign.id,
      donorName: "You",
      amount,
      message: message || undefined,
      isAnonymous,
      transactionHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      createdAt: new Date(),
    };

    setDonations([newDonation, ...donations]);

    // Update global state - PERMANENTLY
    updateCampaign(campaign.id, {
      raisedAmount: campaign.raisedAmount + amount,
      donorCount: campaign.donorCount + 1
    });

    // Process donation for achievements and leaderboard
    processDonation(amount);

    toast.success(
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-primary fill-primary" />
        <span>Thank you for your ₹{amount} donation!</span>
      </div>
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to campaigns
          </Link>

          {/* Saved Lives Banner for complete campaigns */}
          {isComplete && <SavedLivesBanner campaign={campaign} className="mb-12" />}

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Big Heart */}
            <div className="flex flex-col items-center">
              <BigHeart
                progress={progress}
                isComplete={isComplete}
                className="mb-8"
              />

              {/* Stats under heart */}
              <div className="grid grid-cols-3 gap-6 w-full max-w-md text-center">
                <div className="bg-card rounded-xl p-4 shadow-card">
                  <p className="font-display text-2xl font-bold text-primary">
                    ₹{campaign.raisedAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-muted-foreground">Raised</p>
                </div>
                <div className="bg-card rounded-xl p-4 shadow-card">
                  <p className="font-display text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                    <Users className="w-5 h-5" />
                    {campaign.donorCount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-muted-foreground">Donors</p>
                </div>
                <div className="bg-card rounded-xl p-4 shadow-card">
                  <p className="font-display text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                    <Clock className="w-5 h-5" />
                    {campaign.daysLeft}
                  </p>
                  <p className="text-sm text-muted-foreground">Days Left</p>
                </div>
              </div>

              {/* Heartwarming message for complete */}
              {isComplete && (
                <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center max-w-md animate-fade-in">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    A Heart Made Whole
                  </h3>
                  <p className="text-muted-foreground">
                    This beating heart represents a life saved. {campaign.beneficiaryName} can now receive the care they desperately needed,
                    thanks to the collective love of {campaign.donorCount} compassionate souls.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Campaign Details */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {campaign.isVerified && (
                  <Badge className="bg-success text-success-foreground gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
                {campaign.urgencyLevel === "critical" && (
                  <Badge className="bg-urgent text-urgent-foreground gap-1 animate-urgent-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    Critical
                  </Badge>
                )}
                {campaign.urgencyLevel === "high" && (
                  <Badge className="bg-urgent/80 text-urgent-foreground gap-1">
                    Urgent
                  </Badge>
                )}
                <Badge variant="secondary" className="capitalize">
                  {campaign.subcategory.replace("-", " ")}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {campaign.title}
              </h1>

              {/* Beneficiary info */}
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="font-semibold text-foreground">{campaign.beneficiaryName}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {campaign.location}
                </span>
              </div>

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Story */}
              <div className="prose prose-lg max-w-none">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  The Story
                </h3>
                <p className="text-muted-foreground leading-relaxed">{campaign.story}</p>
              </div>

              {/* Goal progress */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-display font-bold text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full gradient-heart rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">
                    ₹{campaign.raisedAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-muted-foreground">
                    of ₹{campaign.goalAmount.toLocaleString('en-IN')} goal
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                {!isComplete ? (
                  <Button
                    onClick={handleOpenDonation}
                    className="flex-1 h-14 text-lg font-display font-semibold gradient-heart hover:opacity-90 transition-opacity"
                  >
                    <Heart className="w-5 h-5 mr-2 fill-white" />
                    Donate Now
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="flex-1 h-14 text-lg font-display font-semibold bg-success"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Fully Funded!
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Blockchain verification */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="w-4 h-4" />
                <span>All donations verified on Polygon blockchain</span>
              </div>
            </div>
          </div>

          {/* Donors section */}
          <div className="mt-16">
            <DonorsList donations={donations} />
          </div>
        </div>
      </main>

      <Footer />

      {/* Donation Modal */}
      <DonationModal
        campaign={campaign}
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        onDonate={handleDonate}
      />
    </div>
  );
};

export default CampaignDetail;
