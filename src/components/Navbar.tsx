import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Wallet, User, Trophy, Sparkles, Check, Database, LogOut, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { useWallet } from "@/context/WalletContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { currentUser } = useUser();
  const {
    isConnected: isWalletConnected,
    walletAddress,
    balance,
    networkName,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchToShardeum
  } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleConnectWallet = () => {
    connectWallet();
  };

  const navLinks = [
    { href: "/", label: "Explore" },
    { href: "/saved-lives", label: "Saved Lives" },
    { href: "/transactions", label: "Transactions", icon: Database },
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
                {link.label === "Transactions" && <Database className="w-4 h-4 text-primary" />}
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                  location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/leaderboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <Trophy className="w-4 h-4" />
                <span className="font-semibold">Rank #{currentUser.rank}</span>
              </Button>
            </Link>

            {isWalletConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-2 transition-all duration-300",
                      isCorrectNetwork
                        ? "border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50"
                        : "border-amber-500/30 hover:bg-amber-500/10"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      isCorrectNetwork ? "bg-emerald-500" : "bg-amber-500"
                    )} />
                    <span className="font-mono text-xs hidden lg:inline-block">
                      {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                    </span>
                    {balance && (
                      <span className="text-xs font-semibold ml-1">
                        {balance} SHM
                      </span>
                    )}
                    <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground bg-muted/50 rounded-md mx-1 mb-1 font-mono break-all">
                    {walletAddress}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/transactions" className="flex items-center cursor-pointer">
                      <Database className="w-4 h-4 mr-2" />
                      Transaction History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={connectWallet} className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Switch Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open("https://explorer-sphinx.shardeum.org/account/" + walletAddress, "_blank")} className="cursor-pointer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnectWallet} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-primary/50 hover:border-primary"
                onClick={handleConnectWallet}
              >
                <Wallet className="w-4 h-4" />
                Connect MetaMask
              </Button>
            )}
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
                {link.label === "Transactions" && <Database className="w-4 h-4 text-primary" />}
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
      </div >
    </nav >
  );
};

export default Navbar;
