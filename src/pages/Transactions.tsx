import { useState } from "react";
import { useWallet, BlockchainTransaction } from "@/context/WalletContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlockchainPipeline from "@/components/BlockchainPipeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Hash,
    ExternalLink,
    Clock,
    Wallet,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Database,
    Zap,
    Shield,
    ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Transactions = () => {
    const { transactions, isConnected, walletAddress, balance, connectWallet, isCorrectNetwork, switchToShardeum } = useWallet();
    const [selectedTx, setSelectedTx] = useState<BlockchainTransaction | null>(null);
    const [expandedTx, setExpandedTx] = useState<string | null>(null);

    const toggleExpanded = (hash: string) => {
        setExpandedTx(expandedTx === hash ? null : hash);
    };

    const getStatusColor = (status: BlockchainTransaction["status"]) => {
        switch (status) {
            case "confirmed":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "pending":
                return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            case "failed":
                return "bg-red-500/20 text-red-400 border-red-500/30";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <Database className="w-4 h-4" />
                            Blockchain Transparency
                        </div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Transaction{" "}
                            <span className="bg-gradient-to-r from-primary via-rose-400 to-amber-500 bg-clip-text text-transparent">
                                Ledger
                            </span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Every donation is permanently recorded on the Shardeum blockchain.
                            Full transparency, forever verifiable.
                        </p>
                    </div>

                    {/* Wallet Status Card */}
                    <div className="mb-12 p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center",
                                    isConnected ? "bg-emerald-500/20" : "bg-gray-500/20"
                                )}>
                                    <Wallet className={cn(
                                        "w-7 h-7",
                                        isConnected ? "text-emerald-400" : "text-gray-400"
                                    )} />
                                </div>
                                <div>
                                    {isConnected ? (
                                        <>
                                            <p className="text-sm text-muted-foreground">Connected Wallet</p>
                                            <p className="font-mono text-foreground font-semibold">
                                                {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs">
                                                    {balance} SHM
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs",
                                                        isCorrectNetwork
                                                            ? "border-emerald-500/30 text-emerald-400"
                                                            : "border-amber-500/30 text-amber-400"
                                                    )}
                                                >
                                                    {isCorrectNetwork ? "Shardeum Sphinx" : "Wrong Network"}
                                                </Badge>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-foreground font-semibold">Wallet Not Connected</p>
                                            <p className="text-sm text-muted-foreground">
                                                Connect MetaMask to view your transactions
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {!isConnected ? (
                                    <Button onClick={connectWallet} className="gradient-heart">
                                        <Wallet className="w-4 h-4 mr-2" />
                                        Connect MetaMask
                                    </Button>
                                ) : !isCorrectNetwork ? (
                                    <Button onClick={switchToShardeum} variant="outline">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Switch to Shardeum
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Transaction Pipeline */}
                        <div className="order-2 lg:order-1">
                            <div className="sticky top-24">
                                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-primary" />
                                    Transaction Pipeline
                                </h2>
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800">
                                    <BlockchainPipeline
                                        transaction={selectedTx}
                                        isProcessing={false}
                                    />
                                </div>

                                {/* Info Cards */}
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 rounded-xl bg-card border border-border">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-8 h-8 text-emerald-400" />
                                            <div>
                                                <p className="font-semibold text-foreground">Immutable</p>
                                                <p className="text-xs text-muted-foreground">Cannot be altered</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-card border border-border">
                                        <div className="flex items-center gap-3">
                                            <Zap className="w-8 h-8 text-amber-400" />
                                            <div>
                                                <p className="font-semibold text-foreground">Fast</p>
                                                <p className="text-xs text-muted-foreground">~2 sec confirmation</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction List */}
                        <div className="order-1 lg:order-2">
                            <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <Hash className="w-5 h-5 text-primary" />
                                Your Transactions
                                {transactions.length > 0 && (
                                    <Badge variant="secondary" className="ml-2">
                                        {transactions.length}
                                    </Badge>
                                )}
                            </h2>

                            {transactions.length === 0 ? (
                                <div className="text-center py-16 px-6 rounded-2xl bg-card border border-border">
                                    <Database className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                                        No Transactions Yet
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        Your blockchain donations will appear here once you make your first contribution.
                                    </p>
                                    <Button asChild className="gradient-heart">
                                        <a href="/">
                                            <ArrowUpRight className="w-4 h-4 mr-2" />
                                            Browse Campaigns
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {transactions.map((tx) => (
                                        <div
                                            key={tx.hash}
                                            className={cn(
                                                "p-4 rounded-xl bg-card border transition-all cursor-pointer hover:border-primary/50",
                                                selectedTx?.hash === tx.hash
                                                    ? "border-primary shadow-lg shadow-primary/10"
                                                    : "border-border"
                                            )}
                                            onClick={() => setSelectedTx(tx)}
                                        >
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                                        getStatusColor(tx.status)
                                                    )}>
                                                        <Hash className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-mono text-sm text-foreground">
                                                            {tx.hash.slice(0, 12)}...{tx.hash.slice(-8)}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                            {tx.campaignTitle}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-foreground">
                                                        ₹{tx.amount.toLocaleString("en-IN")}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn("text-xs mt-1", getStatusColor(tx.status))}
                                                    >
                                                        {tx.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Expand/Collapse Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleExpanded(tx.hash);
                                                }}
                                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-3"
                                            >
                                                {expandedTx === tx.hash ? (
                                                    <>
                                                        <ChevronUp className="w-4 h-4" />
                                                        Hide Details
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="w-4 h-4" />
                                                        Show Details
                                                    </>
                                                )}
                                            </button>

                                            {/* Expanded Details */}
                                            {expandedTx === tx.hash && (
                                                <div className="mt-4 pt-4 border-t border-border space-y-3 text-sm animate-fade-in">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-muted-foreground">From</p>
                                                            <p className="font-mono text-foreground text-xs">
                                                                {tx.donorAddress.slice(0, 10)}...{tx.donorAddress.slice(-8)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                Time
                                                            </p>
                                                            <p className="text-foreground">
                                                                {tx.timestamp.toLocaleString()}
                                                            </p>
                                                        </div>
                                                        {tx.blockNumber && (
                                                            <div>
                                                                <p className="text-muted-foreground">Block</p>
                                                                <p className="font-mono text-foreground">#{tx.blockNumber}</p>
                                                            </div>
                                                        )}
                                                        {tx.gasUsed && (
                                                            <div>
                                                                <p className="text-muted-foreground">Gas Used</p>
                                                                <p className="font-mono text-foreground">
                                                                    {parseInt(tx.gasUsed).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <a
                                                        href={tx.explorerUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        View on Shardeum Explorer
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Network Info Footer */}
                    <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-amber-500/5 to-emerald-500/5 border border-primary/20">
                        <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
                            🔗 Shardeum Network Details
                        </h3>
                        <div className="grid md:grid-cols-4 gap-6 text-center">
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Network Name</p>
                                <p className="font-semibold text-foreground">Shardeum Sphinx 1.X</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Chain ID</p>
                                <p className="font-mono font-semibold text-foreground">8082 (0x1F92)</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Currency</p>
                                <p className="font-semibold text-foreground">SHM (Shardeum)</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">RPC Endpoint</p>
                                <code className="text-xs bg-background px-2 py-1 rounded text-primary">
                                    sphinx.shardeum.org
                                </code>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <a
                                href="https://explorer-sphinx.shardeum.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Open Shardeum Block Explorer
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Transactions;
