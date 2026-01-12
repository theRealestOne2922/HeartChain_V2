export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  requirement: {
    type: 'donation_amount' | 'lives_saved' | 'donation_count' | 'streak';
    value: number;
  };
  unlockedAt?: Date;
}

export const BADGES: Achievement[] = [
  {
    id: 'compassion_starter',
    name: 'Compassion Starter',
    description: 'Made your first donation and joined the HeartChain community',
    icon: '💝',
    tier: 'bronze',
    requirement: { type: 'donation_count', value: 1 }
  },
  {
    id: 'heart_helper',
    name: 'Heart Helper',
    description: 'Donated to 5 different campaigns',
    icon: '🤝',
    tier: 'bronze',
    requirement: { type: 'donation_count', value: 5 }
  },
  {
    id: 'generous_soul',
    name: 'Generous Soul',
    description: 'Contributed a total of $100 to save lives',
    icon: '✨',
    tier: 'silver',
    requirement: { type: 'donation_amount', value: 100 }
  },
  {
    id: 'life_supporter',
    name: 'Life Supporter',
    description: 'Helped fully fund at least 1 campaign',
    icon: '🌟',
    tier: 'silver',
    requirement: { type: 'lives_saved', value: 1 }
  },
  {
    id: 'heart_guardian',
    name: 'Heart Guardian',
    description: 'Donated over $500 and saved multiple lives',
    icon: '🛡️',
    tier: 'gold',
    requirement: { type: 'donation_amount', value: 500 }
  },
  {
    id: 'community_pillar',
    name: 'Community Pillar',
    description: 'Helped fully fund 5 campaigns',
    icon: '🏛️',
    tier: 'gold',
    requirement: { type: 'lives_saved', value: 5 }
  },
  {
    id: 'humanity_champion',
    name: 'Humanity Champion',
    description: 'Contributed over $1,000 to those in need',
    icon: '🏆',
    tier: 'platinum',
    requirement: { type: 'donation_amount', value: 1000 }
  },
  {
    id: 'legend_of_impact',
    name: 'Legend of Impact',
    description: 'A top donor who has changed countless lives with over $5,000 donated',
    icon: '👑',
    tier: 'diamond',
    requirement: { type: 'donation_amount', value: 5000 }
  }
];

export const getTierColor = (tier: BadgeTier): string => {
  switch (tier) {
    case 'bronze': return 'text-amber-600 bg-amber-100 border-amber-300';
    case 'silver': return 'text-slate-500 bg-slate-100 border-slate-300';
    case 'gold': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    case 'platinum': return 'text-purple-600 bg-purple-100 border-purple-300';
    case 'diamond': return 'text-cyan-500 bg-cyan-100 border-cyan-300';
    default: return 'text-muted-foreground bg-muted border-border';
  }
};

export const getTierGradient = (tier: BadgeTier): string => {
  switch (tier) {
    case 'bronze': return 'from-amber-400 to-amber-600';
    case 'silver': return 'from-slate-300 to-slate-500';
    case 'gold': return 'from-yellow-400 to-yellow-600';
    case 'platinum': return 'from-purple-400 to-purple-600';
    case 'diamond': return 'from-cyan-300 to-cyan-500';
    default: return 'from-muted to-muted-foreground';
  }
};
