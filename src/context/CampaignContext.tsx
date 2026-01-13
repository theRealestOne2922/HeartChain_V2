import { createContext, useContext, useState, ReactNode } from "react";
import { Campaign } from "@/types/campaign";
import { mockCampaigns as initialCampaigns } from "@/data/mockCampaigns";

interface CampaignContextType {
    campaigns: Campaign[];
    addCampaign: (campaign: Campaign) => void;
    updateCampaign: (id: string, updates: Partial<Campaign>) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);

    const addCampaign = (newCampaign: Campaign) => {
        setCampaigns((prev) => [newCampaign, ...prev]);
    };

    const updateCampaign = (id: string, updates: Partial<Campaign>) => {
        setCampaigns((prev) => prev.map(campaign =>
            campaign.id === id ? { ...campaign, ...updates } : campaign
        ));
    };

    return (
        <CampaignContext.Provider value={{ campaigns, addCampaign, updateCampaign }}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaigns = () => {
    const context = useContext(CampaignContext);
    if (context === undefined) {
        throw new Error("useCampaigns must be used within a CampaignProvider");
    }
    return context;
};
