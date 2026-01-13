import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Wallet, User, Trophy, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { useWallet } from "@/context/WalletContext";

const Navbar = () => {
  const { currentUser } = useUser();
  const { isConnected: isWalletConnected, walletAddress, connectWallet } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleConnectWallet = () => {
    connectWallet();
  };

  const navLinks = [
    { href: "/", label: "Explore" },
    { href: "/saved-lives", label: "Saved Lives" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Heart className="w-8 h-8 text-primary fill-primary group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Heart<span className="text-primary">Chain</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-muted-foreground hover:text-foreground font-medium transition-colors relative group flex items-center gap-1",
                  location.pathname === link.href && "text-foreground"
                )}
              >
                {link.label === "Saved Lives" && <Sparkles className="w-4 h-4 text-success" />}
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                  location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/leaderboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <Trophy className="w-4 h-4" />
                <span className="font-semibold">Rank #{currentUser.rank}</span>
              </Button>
            </Link>
            <Button
              variant={isWalletConnected ? "default" : "outline"}
              size="sm"
              className={cn("gap-2", isWalletConnected && "bg-success text-success-foreground hover:bg-success/90")}
              onClick={handleConnectWallet}
            >
              {isWalletConnected ? <Check className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
              {isWalletConnected ? walletAddress : "Connect Wallet"}
            </Button>
            <Link to="/create-campaign">
              <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white gap-2">
                <Heart className="w-4 h-4 fill-primary" />
                Start Fundraiser
              </Button>
            </Link>
            <Link to="/profile">
              <Button size="sm" className="gradient-heart text-primary-foreground gap-2">
                <User className="w-4 h-4" />
                Profile
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-muted-foreground hover:text-foreground font-medium py-2 flex items-center gap-2",
                  location.pathname === link.href && "text-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label === "Saved Lives" && <Sparkles className="w-4 h-4 text-success" />}
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button
                variant={isWalletConnected ? "default" : "outline"}
                className={cn("w-full gap-2", isWalletConnected && "bg-success text-success-foreground")}
                onClick={handleConnectWallet}
              >
                {isWalletConnected ? <Check className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                {isWalletConnected ? walletAddress : "Connect Wallet"}
              </Button>
              <Button className="w-full gradient-heart text-primary-foreground gap-2">
                <User className="w-4 h-4" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
