import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Shield, 
  Eye, 
  Users, 
  Zap, 
  Globe, 
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Eye,
      title: "Radical Transparency",
      description: "Every donation is recorded on the blockchain. Track your impact in real-time and see exactly where your money goes."
    },
    {
      icon: Shield,
      title: "Verified Beneficiaries",
      description: "Every campaign is thoroughly vetted. We verify identities, medical documents, and ensure funds reach those who truly need them."
    },
    {
      icon: Heart,
      title: "Emotional Connection",
      description: "Our heart-filling visualization creates a tangible connection between donors and beneficiaries. See hearts fill as lives are saved."
    },
    {
      icon: Users,
      title: "Community-Driven",
      description: "Join a community of compassionate individuals who believe in the power of collective giving to change lives."
    }
  ];

  const differences = [
    "100% of your donation goes to the beneficiary",
    "Blockchain-verified transactions you can audit anytime",
    "Real-time progress tracking with heart visualization",
    "Gamified giving with badges and leaderboards",
    "No hidden fees or administrative cuts",
    "Direct connection between donor and beneficiary"
  ];

  const stats = [
    { value: "$12.4M+", label: "Raised for Those in Need" },
    { value: "24,500+", label: "Lives Changed Forever" },
    { value: "50,000+", label: "Active Donors" },
    { value: "100%", label: "Transparency Guaranteed" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Heart className="w-5 h-5 fill-primary" />
              <span className="font-medium">Our Story</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Where Every Heart <span className="text-gradient">Beats for Change</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              HeartChain was born from a simple belief: giving should be transparent, 
              emotional, and impactful. We built a platform where you don't just donate—you 
              witness lives transform.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gradient-heart text-primary-foreground">
                <Link to="/">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Giving Today
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/leaderboard">
                  <Users className="w-5 h-5 mr-2" />
                  View Leaderboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is HeartChain */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                What is <span className="text-gradient">HeartChain?</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-6">
                HeartChain is a revolutionary donation platform that combines blockchain 
                technology with emotional engagement. We believe that when you can 
                <strong className="text-foreground"> see</strong> your impact, you 
                <strong className="text-foreground"> feel</strong> it more deeply.
              </p>

              <p className="text-lg text-muted-foreground mb-8">
                Our signature heart visualization fills up as donations come in, creating 
                a powerful visual representation of collective compassion. When a heart 
                is fully filled, it starts to beat—symbolizing the life that has been saved.
              </p>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary fill-primary animate-pulse" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">A Beating Heart</p>
                  <p className="text-muted-foreground">Means a life has been saved</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl shadow-elevated p-8 animate-scale-in">
                <div className="grid grid-cols-2 gap-6">
                  {values.map((value, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <value.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why HeartChain is Different */}
      <section className="py-24 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why HeartChain is <span className="text-gradient">Different</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              We're not just another crowdfunding platform. We're reimagining how 
              philanthropy works in the digital age.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl shadow-card p-8">
              {differences.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 py-4 border-b border-border last:border-0 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-6">
              <Globe className="w-5 h-5" />
              <span className="font-medium">Our Mission</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              A World Where No Heart <span className="text-gradient">Goes Unfilled</span>
            </h2>

            <p className="text-xl text-muted-foreground mb-8">
              We envision a future where anyone in need can find support from a global 
              community of compassionate individuals. Where technology bridges the gap 
              between those who can help and those who need it most.
            </p>

            <div className="flex items-center justify-center gap-4 p-6 bg-muted rounded-2xl">
              <Zap className="w-8 h-8 text-urgent" />
              <p className="text-foreground">
                <strong>Join us</strong> in building a more connected, compassionate world. 
                Every filled heart is a step toward that vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Start your journey of compassion today. Every donation fills a heart 
            and brings hope to someone in need.
          </p>
          <Button asChild size="lg" className="gradient-heart text-primary-foreground shadow-glow">
            <Link to="/">
              Explore Campaigns
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
