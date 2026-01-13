import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { BADGES, Achievement } from "@/types/badges";
import { mockUsers, LeaderboardUser, getUserRank } from "@/data/mockUsers";

interface UserContextType {
    currentUser: LeaderboardUser;
    processDonation: (amount: number) => void;
    leaderboard: LeaderboardUser[];
    updateUser: (updates: Partial<LeaderboardUser>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Initial simulated user
const initialUser: LeaderboardUser = {
    id: "current-user",
    displayName: "You",
    totalDonated: 0,
    weeklyDonated: 0, // Track weekly donations
    livesSaved: 0,
    donationCount: 0,
    badges: [],
    rank: 0, // Will be calculated
    joinedAt: new Date(),
};

// Load user from localStorage
const loadUserFromStorage = (): LeaderboardUser => {
    try {
        const saved = localStorage.getItem("heartchain_user_v4");
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                ...parsed,
                joinedAt: new Date(parsed.joinedAt),
            };
        }
    } catch (e) {
        console.error("Failed to load user from storage:", e);
    }
    return initialUser;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<LeaderboardUser>(() => loadUserFromStorage());
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

    // Initialize leaderboard directly using mockUsers
    useEffect(() => {
        // Initial rank calculation
        const allUsers = [...mockUsers, currentUser].sort((a, b) => b.totalDonated - a.totalDonated);
        const myRank = allUsers.findIndex((u) => u.id === currentUser.id) + 1;

        setCurrentUser((prev) => ({ ...prev, rank: myRank }));
        setLeaderboard(allUsers);
    }, []); // Run only on mount initially

    // Save user to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("heartchain_user_v4", JSON.stringify(currentUser));
    }, [currentUser]);

    // Recalculate leaderboard whenever currentUser changes
    useEffect(() => {
        const allUsers = [...mockUsers, currentUser].sort((a, b) => b.totalDonated - a.totalDonated);
        setLeaderboard(allUsers);

        // Update my rank in state if it changed
        const myRank = allUsers.findIndex((u) => u.id === currentUser.id) + 1;
        if (myRank !== currentUser.rank) {
            setCurrentUser(prev => ({ ...prev, rank: myRank }));
        }
    }, [currentUser.totalDonated]);

    const processDonation = (amount: number) => {
        setCurrentUser((prev) => {
            const newTotal = prev.totalDonated + amount;
            const newCount = prev.donationCount + 1;

            // Check for new badges
            const currentBadgeIds = new Set(prev.badges.map((b) => b.id));
            const newlyUnlocked: Achievement[] = [];

            BADGES.forEach((badge) => {
                if (currentBadgeIds.has(badge.id)) return;

                let unlocked = false;
                if (badge.requirement.type === "donation_amount" && newTotal >= badge.requirement.value) {
                    unlocked = true;
                } else if (badge.requirement.type === "donation_count" && newCount >= badge.requirement.value) {
                    unlocked = true;
                }
                // Simplified 'lives_saved' logic: every ₹50k is roughly 1 life saved for this demo
                else if (badge.requirement.type === 'lives_saved') {
                    const estimatedLives = Math.floor(newTotal / 50000);
                    if (estimatedLives >= badge.requirement.value) {
                        unlocked = true;
                    }
                }

                if (unlocked) {
                    newlyUnlocked.push(badge);
                    // Toast notification for achievement
                    setTimeout(() => {
                        toast(
                            <div className="flex flex-col gap-1">
                                <p className="font-bold text-lg flex items-center gap-2">
                                    <span>{badge.icon}</span> Achievement Unlocked!
                                </p>
                                <p className="font-semibold text-primary">{badge.name}</p>
                                <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>,
                            {
                                duration: 5000,
                                className: "border-primary/50 bg-primary/5",
                            }
                        );
                    }, 500); // Slight delay for dramatic effect
                }
            });

            return {
                ...prev,
                totalDonated: newTotal,
                weeklyDonated: (prev.weeklyDonated || 0) + amount, // Also update weekly
                donationCount: newCount,
                badges: [...prev.badges, ...newlyUnlocked],
            };
        });
    };

    const updateUser = (updates: Partial<LeaderboardUser>) => {
        setCurrentUser(prev => ({ ...prev, ...updates }));
    };

    return (
        <UserContext.Provider value={{ currentUser, processDonation, leaderboard, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
