import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface WalletContextType {
    isConnected: boolean;
    walletAddress: string | null;
    connectWallet: () => Promise<void>;
    requireWallet: () => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const connectWallet = async () => {
        if (isConnected) {
            toast.info("Wallet already connected!");
            return;
        }

        toast.loading("Connecting to MetaMask...", { id: "wallet-connect" });

        // Simulate wallet connection
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockAddress = "0x7a3" + Math.random().toString(16).slice(2, 6) + "...f82d";
        setIsConnected(true);
        setWalletAddress(mockAddress);

        toast.success(`Wallet connected! ${mockAddress}`, {
            id: "wallet-connect",
            description: "Your donations will now be recorded on the blockchain"
        });
    };

    // Check if wallet is connected, show error if not
    const requireWallet = (): boolean => {
        if (!isConnected) {
            toast.error("Wallet not connected!", {
                description: "Please connect your wallet to donate",
                action: {
                    label: "Connect Now",
                    onClick: () => connectWallet()
                },
                duration: 5000
            });
            return false;
        }
        return true;
    };

    return (
        <WalletContext.Provider value={{ isConnected, walletAddress, connectWallet, requireWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};
