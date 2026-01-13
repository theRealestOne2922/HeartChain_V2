import React from "react";
import { cn } from "@/lib/utils";
import {
    Wallet,
    ArrowRight,
    Shield,
    Database,
    CheckCircle2,
    Loader2,
    ExternalLink,
    Hash,
    Clock
} from "lucide-react";
import { BlockchainTransaction } from "@/context/WalletContext";

interface BlockchainPipelineProps {
    transaction?: BlockchainTransaction | null;
    isProcessing?: boolean;
    className?: string;
}

interface PipelineStage {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    status: "pending" | "active" | "complete" | "error";
    details?: string;
}

const BlockchainPipeline: React.FC<BlockchainPipelineProps> = ({
    transaction,
    isProcessing = false,
    className,
}) => {
    // Determine pipeline stages based on transaction state
    const getStages = (): PipelineStage[] => {
        const baseStages: PipelineStage[] = [
            {
                id: "wallet",
                title: "MetaMask Wallet",
                description: "User initiates donation",
                icon: <Wallet className="w-6 h-6" />,
                status: "pending",
                details: transaction?.donorAddress
                    ? `${transaction.donorAddress.slice(0, 8)}...${transaction.donorAddress.slice(-6)}`
                    : undefined,
            },
            {
                id: "sign",
                title: "Transaction Signing",
                description: "Cryptographic verification",
                icon: <Shield className="w-6 h-6" />,
                status: "pending",
            },
            {
                id: "broadcast",
                title: "Network Broadcast",
                description: "Sent to Shardeum nodes",
                icon: <Database className="w-6 h-6" />,
                status: "pending",
                details: transaction?.hash
                    ? `${transaction.hash.slice(0, 10)}...${transaction.hash.slice(-8)}`
                    : undefined,
            },
            {
                id: "confirm",
                title: "Block Confirmation",
                description: "Permanently recorded",
                icon: <CheckCircle2 className="w-6 h-6" />,
                status: "pending",
                details: transaction?.blockNumber
                    ? `Block #${transaction.blockNumber}`
                    : undefined,
            },
        ];

        // Update stages based on transaction state
        if (isProcessing) {
            baseStages[0].status = "complete";
            baseStages[1].status = "active";
        }

        if (transaction) {
            baseStages[0].status = "complete";
            baseStages[1].status = "complete";

            if (transaction.status === "pending") {
                baseStages[2].status = "active";
            } else if (transaction.status === "confirmed") {
                baseStages[2].status = "complete";
                baseStages[3].status = "complete";
            } else if (transaction.status === "failed") {
                baseStages[2].status = "error";
            }
        }

        return baseStages;
    };

    const stages = getStages();

    const getStageColors = (status: PipelineStage["status"]) => {
        switch (status) {
            case "complete":
                return {
                    bg: "bg-emerald-500/20",
                    border: "border-emerald-500",
                    icon: "text-emerald-400",
                    glow: "shadow-emerald-500/30",
                };
            case "active":
                return {
                    bg: "bg-amber-500/20",
                    border: "border-amber-500",
                    icon: "text-amber-400",
                    glow: "shadow-amber-500/30",
                };
            case "error":
                return {
                    bg: "bg-red-500/20",
                    border: "border-red-500",
                    icon: "text-red-400",
                    glow: "shadow-red-500/30",
                };
            default:
                return {
                    bg: "bg-gray-500/10",
                    border: "border-gray-600",
                    icon: "text-gray-500",
                    glow: "",
                };
        }
    };

    return (
        <div className={cn("w-full", className)}>
            {/* Pipeline Header */}
            <div className="text-center mb-8">
                <h3 className="font-display text-xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                    <Hash className="w-5 h-5 text-primary" />
                    Blockchain Transaction Pipeline
                </h3>
                <p className="text-muted-foreground text-sm">
                    Secure, transparent donation recording on Shardeum
                </p>
            </div>

            {/* Pipeline Visualization */}
            <div className="relative">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 -translate-y-1/2 z-0 rounded-full" />

                {/* Animated progress line */}
                {(isProcessing || transaction) && (
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary via-amber-500 to-emerald-500 -translate-y-1/2 z-0 rounded-full transition-all duration-1000"
                        style={{
                            width: transaction?.status === "confirmed"
                                ? "100%"
                                : transaction?.status === "pending"
                                    ? "75%"
                                    : isProcessing
                                        ? "25%"
                                        : "0%"
                        }}
                    />
                )}

                {/* Stages */}
                <div className="relative z-10 flex justify-between">
                    {stages.map((stage, index) => {
                        const colors = getStageColors(stage.status);

                        return (
                            <React.Fragment key={stage.id}>
                                <div className="flex flex-col items-center">
                                    {/* Stage Circle */}
                                    <div
                                        className={cn(
                                            "w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                                            colors.bg,
                                            colors.border,
                                            colors.glow && `shadow-lg ${colors.glow}`,
                                            stage.status === "active" && "animate-pulse"
                                        )}
                                    >
                                        {stage.status === "active" ? (
                                            <Loader2 className={cn("w-6 h-6 animate-spin", colors.icon)} />
                                        ) : (
                                            <span className={colors.icon}>{stage.icon}</span>
                                        )}
                                    </div>

                                    {/* Stage Info */}
                                    <div className="mt-4 text-center max-w-[120px]">
                                        <p className={cn(
                                            "font-semibold text-sm",
                                            stage.status === "complete" && "text-emerald-400",
                                            stage.status === "active" && "text-amber-400",
                                            stage.status === "error" && "text-red-400",
                                            stage.status === "pending" && "text-gray-400"
                                        )}>
                                            {stage.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {stage.description}
                                        </p>
                                        {stage.details && (
                                            <p className="text-xs text-primary font-mono mt-2 bg-primary/10 px-2 py-1 rounded">
                                                {stage.details}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow between stages */}
                                {index < stages.length - 1 && (
                                    <div className="flex items-center justify-center flex-1 -mt-6">
                                        <ArrowRight className={cn(
                                            "w-5 h-5 transition-colors",
                                            stages[index].status === "complete" ? "text-emerald-500" : "text-gray-600"
                                        )} />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Transaction Details Card */}
            {transaction && (
                <div className="mt-8 p-6 rounded-2xl bg-card border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                            <Hash className="w-4 h-4 text-primary" />
                            Transaction Details
                        </h4>
                        <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-semibold",
                            transaction.status === "confirmed" && "bg-emerald-500/20 text-emerald-400",
                            transaction.status === "pending" && "bg-amber-500/20 text-amber-400",
                            transaction.status === "failed" && "bg-red-500/20 text-red-400"
                        )}>
                            {transaction.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Transaction Hash</p>
                            <p className="font-mono text-foreground flex items-center gap-2">
                                {transaction.hash.slice(0, 14)}...{transaction.hash.slice(-12)}
                                <a
                                    href={transaction.explorerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-semibold text-foreground">₹{transaction.amount.toLocaleString("en-IN")}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Campaign</p>
                            <p className="text-foreground truncate">{transaction.campaignTitle}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Timestamp
                            </p>
                            <p className="text-foreground">{transaction.timestamp.toLocaleString()}</p>
                        </div>
                        {transaction.blockNumber && (
                            <div>
                                <p className="text-muted-foreground">Block Number</p>
                                <p className="font-mono text-foreground">#{transaction.blockNumber}</p>
                            </div>
                        )}
                        {transaction.gasUsed && (
                            <div>
                                <p className="text-muted-foreground">Gas Used</p>
                                <p className="font-mono text-foreground">{parseInt(transaction.gasUsed).toLocaleString()}</p>
                            </div>
                        )}
                    </div>

                    {/* Explorer Link */}
                    <a
                        href={transaction.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View on Shardeum Explorer
                    </a>
                </div>
            )}

            {/* Location Info */}
            <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
                <h4 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                    📍 Where is this recorded?
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                        <strong className="text-foreground">Network:</strong> Shardeum Sphinx 1.X Testnet
                    </p>
                    <p>
                        <strong className="text-foreground">Chain ID:</strong> 8082 (0x1F92)
                    </p>
                    <p>
                        <strong className="text-foreground">RPC URL:</strong>{" "}
                        <code className="bg-background px-1 py-0.5 rounded text-xs">https://sphinx.shardeum.org/</code>
                    </p>
                    <p>
                        <strong className="text-foreground">Explorer:</strong>{" "}
                        <a
                            href="https://explorer-sphinx.shardeum.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            https://explorer-sphinx.shardeum.org/
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BlockchainPipeline;
