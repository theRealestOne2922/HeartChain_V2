import { useNavigate } from "react-router-dom";
import { getCompletedCampaigns } from "@/data/mockCampaigns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import { Heart, Sparkles, PartyPopper, Users, DollarSign } from "lucide-react";

const SavedLives = () => {
  const navigate = useNavigate();
  const completedCampaigns = getCompletedCampaigns();
  
  const totalRaised = completedCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
  const totalDonors = completedCampaigns.reduce((sum, c) => sum + c.donorCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero section */}
        <section className="py-16 bg-gradient-to-br from-success/10 via-primary/5 to-accent/10">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <PartyPopper className="w-10 h-10 text-success animate-bounce" />
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Lives We've Saved Together
              </h1>
              <PartyPopper className="w-10 h-10 text-success animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Every beating heart on this page represents a life transformed by the collective 
              generosity of our community. These are the stories of hope fulfilled.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-card rounded-2xl px-8 py-6 shadow-card">
                <div className="flex items-center gap-2 text-success mb-2">
                  <Heart className="w-6 h-6 fill-success" />
                  <span className="font-display text-3xl font-bold">{completedCampaigns.length}</span>
                </div>
                <p className="text-muted-foreground">Lives Saved</p>
              </div>
              <div className="bg-card rounded-2xl px-8 py-6 shadow-card">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <DollarSign className="w-6 h-6" />
                  <span className="font-display text-3xl font-bold">${totalRaised.toLocaleString()}</span>
                </div>
                <p className="text-muted-foreground">Total Raised</p>
              </div>
              <div className="bg-card rounded-2xl px-8 py-6 shadow-card">
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <Users className="w-6 h-6" />
                  <span className="font-display text-3xl font-bold">{totalDonors.toLocaleString()}</span>
                </div>
                <p className="text-muted-foreground">Hearts United</p>
              </div>
            </div>
          </div>
        </section>

        {/* Completed campaigns grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-6 h-6 text-success" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                Fully Funded Campaigns
              </h2>
            </div>

            {completedCampaigns.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {completedCampaigns.map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CampaignCard 
                      campaign={campaign} 
                      onClick={() => navigate(`/campaign/${campaign.id}`)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No completed campaigns yet
                </h3>
                <p className="text-muted-foreground">
                  Be part of the first success story!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SavedLives;
