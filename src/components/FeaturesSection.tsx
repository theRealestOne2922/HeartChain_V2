import { Eye, Shield, Trophy, Heart, Zap, Bell } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Every dollar tracked on the blockchain. See exactly where your money goes.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Heart,
    title: "Visual Progress",
    description: "Watch hearts fill up in real-time as donations pour in. Feel the collective impact.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Verified Campaigns",
    description: "Every beneficiary is verified. Every document is authenticated. Zero fraud.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Trophy,
    title: "Earn Recognition",
    description: "Collect badges, climb leaderboards, and build your philanthropic resume.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Zap,
    title: "Smart Splitting",
    description: "Spread your impact across multiple causes with one donation. Automatic or manual.",
    color: "text-urgent",
    bgColor: "bg-urgent/10",
  },
  {
    icon: Bell,
    title: "Impact Updates",
    description: "Get personalized reports showing exactly how your donation changed lives.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Giving, <span className="text-gradient">Reimagined</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            HeartChain combines blockchain transparency with emotional engagement 
            to make philanthropy personal, trackable, and rewarding.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
