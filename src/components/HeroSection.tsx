import { useState, useEffect } from "react";
import HeartProgress from "./HeartProgress";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Eye, Trophy } from "lucide-react";

const HeroSection = () => {
  const [heroProgress, setHeroProgress] = useState(0);

  useEffect(() => {
    // Animate heart filling on mount
    const timer = setTimeout(() => {
      setHeroProgress(73);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { value: "$12.4M", label: "Total Donated" },
    { value: "24,567", label: "Hearts Filled" },
    { value: "100%", label: "Transparent" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-5" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

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
            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="gradient-heart text-primary-foreground shadow-glow hover:scale-105 transition-transform">
                Start Giving with Purpose
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2">
                <Eye className="mr-2 w-5 h-5" />
                Explore Campaigns
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
            <div className="absolute w-80 h-80 rounded-full bg-primary/20 blur-3xl animate-glow-pulse" />
            
            {/* The main heart */}
            <div className="relative">
              <HeartProgress
                progress={heroProgress}
                size="xl"
                showPercentage
                showMilestones
                animate
                className="drop-shadow-2xl"
              />
              
              {/* Floating badges around heart */}
              <div className="absolute -top-4 -right-4 bg-card p-3 rounded-xl shadow-elevated animate-float">
                <Trophy className="w-6 h-6 text-urgent" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-card px-4 py-2 rounded-xl shadow-elevated animate-float" style={{ animationDelay: "0.5s" }}>
                <p className="text-xs text-muted-foreground">Live donations</p>
                <p className="font-display font-bold text-success">+$250</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
