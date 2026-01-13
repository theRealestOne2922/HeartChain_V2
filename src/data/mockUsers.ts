import { DonorProfile } from "@/types/campaign";
import { Achievement, BADGES } from "@/types/badges";

// Import LeaderboardUser type locally if not available in types/campaign (based on original file)
// But wait, the original file exported the interface. I should keep it here.
export interface LeaderboardUser {
  id: string;
  displayName: string;
  avatarUrl?: string;
  totalDonated: number;
  livesSaved: number;
  donationCount: number;
  badges: Achievement[];
  rank: number;
  weeklyDonated?: number;
  joinedAt: Date;
}

// Mock users for the leaderboard
export const mockUsers: LeaderboardUser[] = [
  {
    id: "1",
    displayName: "Anjali Gupta",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    totalDonated: 1000000,
    livesSaved: 8,
    donationCount: 47,
    badges: [BADGES[0], BADGES[1], BADGES[2], BADGES[3], BADGES[4], BADGES[5], BADGES[6], BADGES[7]],
    rank: 1,
    weeklyDonated: 96000,
    joinedAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    displayName: "Rahul Sharma",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    totalDonated: 700000,
    livesSaved: 6,
    donationCount: 32,
    badges: [BADGES[0], BADGES[1], BADGES[2], BADGES[3], BADGES[4], BADGES[5], BADGES[6]],
    rank: 2,
    weeklyDonated: 68000,
    joinedAt: new Date("2023-03-20"),
  },
  {
    id: "3",
    displayName: "Priya Patel",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    totalDonated: 496000,
    livesSaved: 5,
    donationCount: 28,
    badges: [BADGES[0], BADGES[1], BADGES[2], BADGES[3], BADGES[4], BADGES[5], BADGES[6]],
    rank: 3,
    weeklyDonated: 40000,
    joinedAt: new Date("2023-02-10"),
  },
  {
    id: "4",
    displayName: "Vikram Singh",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    totalDonated: 384000,
    livesSaved: 4,
    donationCount: 21,
    badges: [BADGES[0], BADGES[1], BADGES[2], BADGES[3], BADGES[4]],
    rank: 4,
    weeklyDonated: 32000,
    joinedAt: new Date("2023-04-05"),
  },
  {
    id: "5",
    displayName: "Neha Verma",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    totalDonated: 280000,
    livesSaved: 3,
    donationCount: 18,
    badges: [BADGES[0], BADGES[1], BADGES[2], BADGES[3], BADGES[4]],
    rank: 5,
    weeklyDonated: 28000,
    joinedAt: new Date("2023-05-12"),
  },
  {
    id: "6",
    displayName: "Arjun Reddy",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    totalDonated: 224000,
    livesSaved: 2,
    donationCount: 15,
    badges: [BADGES[0], BADGES[1], BADGES[2], BADGES[3]],
    rank: 6,
    weeklyDonated: 22400,
    joinedAt: new Date("2023-06-01"),
  },
  {
    id: "7",
    displayName: "Meera Iyer",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    totalDonated: 176000,
    livesSaved: 2,
    donationCount: 12,
    badges: [BADGES[0], BADGES[1], BADGES[2], BADGES[3]],
    rank: 7,
    weeklyDonated: 16000,
    joinedAt: new Date("2023-06-15"),
  },
  {
    id: "8",
    displayName: "Suresh Kumar",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    totalDonated: 144000,
    livesSaved: 1,
    donationCount: 10,
    badges: [BADGES[0], BADGES[1], BADGES[2], BADGES[3]],
    rank: 8,
    weeklyDonated: 12000,
    joinedAt: new Date("2023-07-01"),
  },
  {
    id: "9",
    displayName: "Kavita Rao",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    totalDonated: 120000,
    livesSaved: 1,
    donationCount: 9,
    badges: [BADGES[0], BADGES[1], BADGES[2], BADGES[3]],
    rank: 9,
    weeklyDonated: 9600,
    joinedAt: new Date("2023-07-20"),
  },
  {
    id: "10",
    displayName: "Amit Shah",
    avatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150",
    totalDonated: 96000,
    livesSaved: 1,
    donationCount: 8,
    badges: [BADGES[0], BADGES[1], BADGES[2]],
    rank: 10,
    weeklyDonated: 8000,
    joinedAt: new Date("2023-08-01"),
  },
  {
    id: "11",
    displayName: "Sneha Das",
    avatarUrl: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150",
    totalDonated: 76000,
    livesSaved: 1,
    donationCount: 7,
    badges: [BADGES[0], BADGES[1], BADGES[2]],
    rank: 11,
    weeklyDonated: 6400,
    joinedAt: new Date("2023-08-15"),
  },
  {
    id: "12",
    displayName: "Rajesh Nair",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
    totalDonated: 60000,
    livesSaved: 0,
    donationCount: 6,
    badges: [BADGES[0], BADGES[1], BADGES[2]],
    rank: 12,
    weeklyDonated: 4800,
    joinedAt: new Date("2023-09-01"),
  },
  {
    id: "13",
    displayName: "Pooja Malhotra",
    avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",
    totalDonated: 46400,
    livesSaved: 0,
    donationCount: 5,
    badges: [BADGES[0], BADGES[1], BADGES[2], BADGES[4]],
    rank: 13,
    weeklyDonated: 4000,
    joinedAt: new Date("2023-09-15"),
  },
  {
    id: "14",
    displayName: "Karan Johar",
    avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150",
    totalDonated: 33600,
    livesSaved: 0,
    donationCount: 4,
    badges: [BADGES[0], BADGES[1], BADGES[2]],
    rank: 14,
    weeklyDonated: 3200,
    joinedAt: new Date("2023-10-01"),
  },
  {
    id: "15",
    displayName: "Riya Sen",
    avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
    totalDonated: 25600,
    livesSaved: 0,
    donationCount: 3,
    badges: [BADGES[0], BADGES[1], BADGES[2]],
    rank: 15,
    weeklyDonated: 2400,
    joinedAt: new Date("2023-10-15"),
  },
];

// Current user (simulated logged-in user)
export const currentUser: LeaderboardUser = {
  id: "current",
  displayName: "You",
  avatarUrl: undefined,
  totalDonated: 22000,
  livesSaved: 0,
  donationCount: 4,
  badges: [BADGES[0], BADGES[1], BADGES[2]],
  rank: 127,
  weeklyDonated: 2000,
  joinedAt: new Date("2024-01-01"),
};

export const getTopDonors = (limit: number = 10): LeaderboardUser[] => {
  return [...mockUsers].sort((a, b) => b.totalDonated - a.totalDonated).slice(0, limit);
};

export const getWeeklyTopDonors = (limit: number = 10): LeaderboardUser[] => {
  return [...mockUsers].sort((a, b) => (b.weeklyDonated || 0) - (a.weeklyDonated || 0)).slice(0, limit);
};

export const getUserRank = (userId: string): number => {
  const allUsers = [...mockUsers, currentUser].sort((a, b) => b.totalDonated - a.totalDonated);
  const index = allUsers.findIndex(u => u.id === userId);
  return index + 1;
};
