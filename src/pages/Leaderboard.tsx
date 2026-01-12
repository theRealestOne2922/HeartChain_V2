import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeGrid } from "@/components/BadgeDisplay";
import { mockUsers, currentUser, getTopDonors, getWeeklyTopDonors } from "@/data/mockUsers";
import { LeaderboardUser } from "@/data/mockUsers";
import { Trophy, Crown, Medal, Heart, TrendingUp, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type LeaderboardType = "all-time" | "weekly";

const Leaderboard = () => {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>("all-time");

  const topDonors = leaderboardType === "all-time" 
    ? getTopDonors(15) 
    : getWeeklyTopDonors(15);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 dark:from-yellow-950/30 dark:to-amber-950/30 dark:border-yellow-800";
      case 2:
        return "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 dark:from-slate-950/30 dark:to-gray-950/30 dark:border-slate-700";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-800";
      default:
        return "bg-card border-border";
    }
  };

  // Calculate totals
  const totalDonated = mockUsers.reduce((sum, u) => sum + u.totalDonated, 0) + currentUser.totalDonated;
  const totalLivesSaved = mockUsers.reduce((sum, u) => sum + u.livesSaved, 0);
  const totalDonors = mockUsers.length + 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Hall of Heroes</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Our Top <span className="text-gradient">Life Savers</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Celebrating the generous hearts who make the biggest impact. 
              Every donation brings us closer to a world where no one is left behind.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-foreground">
                  {formatCurrency(totalDonated)}
                </p>
                <p className="text-sm text-muted-foreground">Total Raised</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-primary">
                  {totalLivesSaved}
                </p>
                <p className="text-sm text-muted-foreground">Lives Saved</p>
              </div>
              <div className="text-center">
                <p className="font-display text-3xl font-bold text-secondary">
                  {totalDonors}
                </p>
                <p className="text-sm text-muted-foreground">Active Donors</p>
              </div>
            </div>

            {/* Toggle */}
            <div className="inline-flex gap-2 bg-muted p-1 rounded-lg">
              <Button
                variant={leaderboardType === "all-time" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLeaderboardType("all-time")}
                className={cn(leaderboardType === "all-time" && "gradient-heart")}
              >
                <Trophy className="w-4 h-4 mr-2" />
                All Time
              </Button>
              <Button
                variant={leaderboardType === "weekly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLeaderboardType("weekly")}
                className={cn(leaderboardType === "weekly" && "gradient-heart")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                This Week
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Current User Highlight */}
      <section className="py-8 border-y border-primary/20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-14 h-14 border-2 border-primary">
                  <AvatarImage src={currentUser.avatarUrl} />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    {currentUser.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
                  You
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground">Your Position</p>
                <p className="text-muted-foreground text-sm">Keep donating to climb the ranks!</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-foreground">#{currentUser.rank}</p>
                <p className="text-xs text-muted-foreground">Rank</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-primary">{formatCurrency(currentUser.totalDonated)}</p>
                <p className="text-xs text-muted-foreground">Donated</p>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-success">{currentUser.livesSaved}</p>
                <p className="text-xs text-muted-foreground">Lives Saved</p>
              </div>
              <BadgeGrid badges={currentUser.badges} size="sm" maxDisplay={4} />
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Table */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {topDonors.slice(0, 3).map((user, index) => (
              <div
                key={user.id}
                className={cn(
                  "relative p-6 rounded-2xl border-2 animate-slide-up",
                  getRankStyle(index + 1),
                  index === 0 && "md:order-2 md:-mt-4 md:scale-105",
                  index === 1 && "md:order-1",
                  index === 2 && "md:order-3"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Rank badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3 py-1 rounded-full border-2 border-current">
                  {getRankIcon(index + 1)}
                </div>

                <div className="text-center pt-4">
                  <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-background shadow-elevated">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="text-2xl font-bold">
                      {user.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="font-display text-xl font-bold text-foreground mb-1">
                    {user.displayName}
                  </h3>

                  <div className="flex justify-center gap-2 mb-4">
                    <Badge variant="secondary" className="gap-1">
                      <Heart className="w-3 h-3" />
                      {user.livesSaved} saved
                    </Badge>
                  </div>

                  <p className="font-display text-3xl font-bold text-primary mb-2">
                    {formatCurrency(leaderboardType === "weekly" ? (user.weeklyDonated || 0) : user.totalDonated)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {user.donationCount} donations
                  </p>

                  <BadgeGrid badges={user.badges} size="sm" maxDisplay={5} className="justify-center" />
                </div>
              </div>
            ))}
          </div>

          {/* Rest of Leaderboard */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/50 font-semibold text-sm text-muted-foreground">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Donor</div>
              <div className="col-span-2 text-right">Donated</div>
              <div className="col-span-2 text-center">Lives Saved</div>
              <div className="col-span-3 text-center">Badges</div>
            </div>

            {topDonors.slice(3).map((user, index) => (
              <div
                key={user.id}
                className={cn(
                  "grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-border last:border-0 hover:bg-muted/30 transition-colors animate-fade-in"
                )}
                style={{ animationDelay: `${(index + 3) * 0.05}s` }}
              >
                <div className="col-span-1">
                  <span className="font-bold text-muted-foreground">#{index + 4}</span>
                </div>

                <div className="col-span-4 flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.donationCount} donations</p>
                  </div>
                </div>

                <div className="col-span-2 text-right">
                  <p className="font-bold text-foreground">
                    {formatCurrency(leaderboardType === "weekly" ? (user.weeklyDonated || 0) : user.totalDonated)}
                  </p>
                </div>

                <div className="col-span-2 text-center">
                  <Badge variant="outline" className="gap-1">
                    <Heart className="w-3 h-3 text-primary" />
                    {user.livesSaved}
                  </Badge>
                </div>

                <div className="col-span-3 flex justify-center">
                  <BadgeGrid badges={user.badges} size="sm" maxDisplay={4} />
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (won't show with mock data but here for completeness) */}
          {topDonors.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No rankings yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first to save a life and claim the top spot!
              </p>
              <Button className="gradient-heart">
                <Sparkles className="w-4 h-4 mr-2" />
                Make Your First Donation
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Leaderboard;
