import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import BadgeDisplay, { BadgeGrid } from "@/components/BadgeDisplay";
import { useUser } from "@/context/UserContext"; // Use context
import { BADGES, Achievement, getTierColor, getTierGradient } from "@/types/badges";
import { mockCampaigns } from "@/data/mockCampaigns";
import HeartProgress from "@/components/HeartProgress";
import {
  Heart,
  Trophy,
  Calendar,
  Share2,
  Settings,
  Edit2,
  TrendingUp,
  Gift,
  Target,
  Sparkles,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<"achievements" | "donations" | "impact">("achievements");

  // Calculate next badge progress
  const unlockedBadgeIds = currentUser.badges.map(b => b.id);
  const nextBadge = BADGES.find(b => !unlockedBadgeIds.includes(b.id));
  const nextBadgeProgress = nextBadge
    ? Math.min((currentUser.totalDonated / nextBadge.requirement.value) * 100, 100)
    : 100;

  // Mock donation history
  const donationHistory = [
    { id: "1", campaignId: "1", amount: 8000, date: new Date("2024-01-10") },
    { id: "2", campaignId: "2", amount: 6000, date: new Date("2024-01-05") },
    { id: "3", campaignId: "4", amount: 4000, date: new Date("2023-12-20") },
    { id: "4", campaignId: "6", amount: 4000, date: new Date("2023-12-15") },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Profile Header */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-elevated">
                <AvatarImage src={currentUser.avatarUrl} />
                <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                  {currentUser.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 bg-card rounded-full shadow-card hover:bg-muted transition-colors">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-foreground">
                  {currentUser.displayName}
                </h1>
                <Badge variant="secondary" className="gap-1">
                  <Trophy className="w-3 h-3" />
                  Rank #{currentUser.rank}
                </Badge>
              </div>

              <p className="text-muted-foreground mb-4">
                <Calendar className="w-4 h-4 inline mr-1" />
                Joined {formatDate(currentUser.joinedAt)}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="text-center px-4 py-2 bg-card rounded-lg shadow-card">
                  <p className="font-display text-2xl font-bold text-primary">
                    {formatCurrency(currentUser.totalDonated)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Donated</p>
                </div>
                <div className="text-center px-4 py-2 bg-card rounded-lg shadow-card">
                  <p className="font-display text-2xl font-bold text-success">
                    {currentUser.livesSaved}
                  </p>
                  <p className="text-xs text-muted-foreground">Lives Saved</p>
                </div>
                <div className="text-center px-4 py-2 bg-card rounded-lg shadow-card">
                  <p className="font-display text-2xl font-bold text-secondary">
                    {currentUser.donationCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Donations</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Impact Heart */}
            <div className="hidden lg:block">
              <HeartProgress
                progress={Math.min((currentUser.totalDonated / 40000) * 100, 100)}
                size="lg"
                showPercentage
                animate
              />
              <p className="text-center text-sm text-muted-foreground mt-2">
                Your Impact Level
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Badge Progress */}
      {nextBadge && (
        <section className="py-6 border-y border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-6">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2",
                getTierColor(nextBadge.tier)
              )}>
                {nextBadge.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">Next Badge: {nextBadge.name}</p>
                    <p className="text-sm text-muted-foreground">{nextBadge.description}</p>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {formatCurrency(currentUser.totalDonated)} / {formatCurrency(nextBadge.requirement.value)}
                  </p>
                </div>
                <Progress value={nextBadgeProgress} className="h-2" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 border-b border-border mb-8">
            {[
              { id: "achievements", label: "Achievements", icon: Trophy },
              { id: "donations", label: "Donation History", icon: Gift },
              { id: "impact", label: "My Impact", icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px",
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="animate-fade-in">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {BADGES.map((badge) => {
                  const isUnlocked = unlockedBadgeIds.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={cn(
                        "p-6 rounded-2xl border-2 transition-all",
                        isUnlocked
                          ? cn("bg-card", getTierColor(badge.tier).replace('text-', 'border-'))
                          : "bg-muted/30 border-border opacity-60"
                      )}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2",
                          isUnlocked ? getTierColor(badge.tier) : "bg-muted text-muted-foreground border-border"
                        )}>
                          {isUnlocked ? badge.icon : <Lock className="w-6 h-6" />}
                        </div>
                        <Badge
                          variant={isUnlocked ? "default" : "secondary"}
                          className={cn(
                            "text-xs capitalize",
                            isUnlocked && `bg-gradient-to-r ${getTierGradient(badge.tier)} text-white border-0`
                          )}
                        >
                          {badge.tier}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      {!isUnlocked && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Donate {formatCurrency(badge.requirement.value)} to unlock
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Donations Tab */}
          {activeTab === "donations" && (
            <div className="animate-fade-in">
              {donationHistory.length > 0 ? (
                <div className="space-y-4">
                  {donationHistory.map((donation) => {
                    const campaign = mockCampaigns.find(c => c.id === donation.campaignId);
                    return (
                      <div
                        key={donation.id}
                        className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card hover:shadow-elevated transition-shadow"
                      >
                        {campaign && (
                          <img
                            src={campaign.imageUrl}
                            alt={campaign.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {campaign?.title || "Unknown Campaign"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(donation.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-bold text-primary">
                            {formatCurrency(donation.amount)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Gift className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No donations yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start your giving journey today!
                  </p>
                  <Button asChild className="gradient-heart">
                    <Link to="/">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Explore Campaigns
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Impact Tab */}
          {activeTab === "impact" && (
            <div className="animate-fade-in">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-card rounded-2xl shadow-card text-center">
                  <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="font-display text-3xl font-bold text-foreground mb-1">
                    {currentUser.livesSaved}
                  </p>
                  <p className="text-muted-foreground">Lives Impacted</p>
                </div>
                <div className="p-6 bg-card rounded-2xl shadow-card text-center">
                  <TrendingUp className="w-12 h-12 text-success mx-auto mb-4" />
                  <p className="font-display text-3xl font-bold text-foreground mb-1">
                    {formatCurrency(currentUser.totalDonated)}
                  </p>
                  <p className="text-muted-foreground">Total Contribution</p>
                </div>
                <div className="p-6 bg-card rounded-2xl shadow-card text-center">
                  <Trophy className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <p className="font-display text-3xl font-bold text-foreground mb-1">
                    #{currentUser.rank}
                  </p>
                  <p className="text-muted-foreground">Global Ranking</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl p-8 text-center">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  You're Making a Difference!
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Every donation you make brings hope to someone in need.
                  Keep going to climb the leaderboard and unlock more badges!
                </p>
                <Button asChild className="gradient-heart">
                  <Link to="/">
                    Continue Your Journey
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;
