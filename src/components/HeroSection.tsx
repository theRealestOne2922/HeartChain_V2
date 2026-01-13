import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HeartProgress from "./HeartProgress";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Sparkles, Trophy } from "lucide-react";
import { useCampaigns } from "@/context/CampaignContext";

interface LiveDonation {
  amount: number;
  name: string;
  visible: boolean;
}

const HeroSection = () => {
  const { campaigns } = useCampaigns();
  const [heroProgress, setHeroProgress] = useState(0);
  const [donation, setDonation] = useState<LiveDonation | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Calculate real aggregate progress from all campaigns
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
  const totalGoal = campaigns.reduce((sum, c) => sum + c.goalAmount, 0);
  const realProgress = totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0;

  // Realistic donation amounts (in INR)
  const donationAmounts = [500, 1000, 2000, 2500, 5000, 10000, 15000, 20000, 25000, 50000];
  const donorNames = ["Priya M.", "Rohan K.", "Ananya S.", "Vikram S.", "Neha V.", "Arjun R.", "Meera I.", "Suresh K.", "Divya P.", "Rahul D."];

  useEffect(() => {
    // Animate heart filling to real progress on mount
    const timer = setTimeout(() => {
      setHeroProgress(realProgress);
    }, 500);
    return () => clearTimeout(timer);
  }, [realProgress]);

  // Live donation ticker - single clean notification
  useEffect(() => {
    const createDonation = () => {
      const randomAmount = donationAmounts[Math.floor(Math.random() * donationAmounts.length)];
      const randomName = donorNames[Math.floor(Math.random() * donorNames.length)];

      // Show new donation
      setDonation({ amount: randomAmount, name: randomName, visible: true });

      // Fade out after 3s
      const fadeTimeout = setTimeout(() => {
        setDonation(prev => prev ? { ...prev, visible: false } : null);
      }, 3000);

      timeoutRefs.current.push(fadeTimeout);
    };

    // Initial donation after 1.5s
    const initialTimer = setTimeout(createDonation, 1500);
    // Then every 5 seconds
    const interval = setInterval(createDonation, 5000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      timeoutRefs.current.forEach(t => clearTimeout(t));
    };
  }, []); // Empty dependency - runs once

  const stats = [
    { value: "₹12.5 Lakh+", label: "Total Donated" },
    { value: "847", label: "Hearts Filled" },
    { value: "100%", label: "Transparent" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-5 pointer-events-none" />

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="animate-fade-in">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">100% Blockchain Verified</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              See Your Impact.{" "}
              <span className="text-gradient">Feel the Change.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Every donation fills a heart. Every heart tells a story.
              Track your impact on the blockchain and watch lives transform in real-time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12 relative z-10">
              <Button
                size="lg"
                className="gradient-heart text-primary-foreground shadow-glow hover:scale-105 transition-transform"
                onClick={() => {
                  const el = document.getElementById('campaign-grid');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Heart className="mr-2 w-5 h-5 fill-white" />
                Donate & Save Lives
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2">
                <Link to="/create-campaign">
                  <Sparkles className="mr-2 w-5 h-5" />
                  Start a Fundraiser
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1 + 0.3}s` }}>
                  <p className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - Hero Heart */}
          <div className="relative flex items-center justify-center animate-scale-in">
            {/* Large glowing backdrop */}
            <div className="absolute w-80 h-80 rounded-full bg-primary/20 blur-3xl animate-glow-pulse pointer-events-none" />

            {/* The main heart */}
            <div className="relative">
              <HeartProgress
                progress={heroProgress}
                size="3xl"
                showPercentage
                showMilestones
                animate
                className="drop-shadow-2xl"
              />

              {/* Floating trophy badge - top right */}
              <div className="absolute -top-4 -right-4 bg-card p-3 rounded-xl shadow-elevated animate-float pointer-events-none">
                <Trophy className="w-6 h-6 text-urgent" />
              </div>

              {/* Live donation notification - bottom right, away from heart */}
              {donation && (
                <div
                  className={`
                    absolute -bottom-8 -right-8 w-44
                    bg-card/95 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-elevated border border-success/20
                    transition-all duration-500 ease-out pointer-events-none
                    ${donation.visible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-2 scale-95'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <p className="text-xs text-muted-foreground truncate">{donation.name}</p>
                  </div>
                  <p className="font-display font-bold text-success text-lg">
                    +₹{donation.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
