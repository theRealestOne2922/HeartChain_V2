export type CampaignCategory = 'people' | 'causes';

export type PeopleSubcategory =
  | 'cancer'
  | 'kidney-failure'
  | 'accident'
  | 'surgery'
  | 'chronic-illness'
  | 'other-medical';

export type CausesSubcategory =
  | 'education'
  | 'disaster-relief'
  | 'healthcare-fund'
  | 'community'
  | 'environment';

export type Subcategory = PeopleSubcategory | CausesSubcategory;

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Campaign {
  id: string;
  title: string;
  story: string;
  imageUrl: string;
  category: CampaignCategory;
  subcategory: Subcategory;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  daysLeft: number;
  urgencyLevel: UrgencyLevel;
  isVerified: boolean;
  beneficiaryName: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  hospitalId?: string;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'RELEASED';
  verificationTxHash?: string;
}

export interface Donation {
  id: string;
  campaignId: string;
  donorName: string;
  amount: number;
  message?: string;
  isAnonymous: boolean;
  transactionHash?: string;
  createdAt: Date;
}

export interface DonorBadge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedAt: Date;
}

export interface DonorProfile {
  id: string;
  displayName: string;
  avatarUrl?: string;
  totalDonated: number;
  campaignsSupported: number;
  badges: DonorBadge[];
  rank?: number;
  joinedAt: Date;
}
