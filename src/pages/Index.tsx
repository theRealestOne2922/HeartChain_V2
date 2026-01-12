import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CampaignGrid from "@/components/CampaignGrid";
import Footer from "@/components/Footer";
import { mockCampaigns, getFeaturedCampaigns } from "@/data/mockCampaigns";

const Index = () => {
  const featuredCampaigns = getFeaturedCampaigns();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero with animated heart */}
      <HeroSection />
      
      {/* Featured urgent campaigns */}
      <section className="py-8 bg-urgent/5 border-y border-urgent/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 text-urgent font-semibold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-urgent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-urgent"></span>
            </span>
            <span>{featuredCampaigns.length} campaigns need urgent support</span>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <FeaturesSection />
      
      {/* Campaign discovery */}
      <CampaignGrid 
        campaigns={mockCampaigns} 
        title="Fill Hearts, Change Lives" 
        showFilters 
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
