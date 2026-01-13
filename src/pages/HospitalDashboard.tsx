import { useState } from "react";
import { useCampaigns } from "@/context/CampaignContext";
import { HOSPITALS, getHospitalById } from "@/data/hospitals";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ShieldCheck, Lock, Unlock, LogOut, Stethoscope, Activity, FileCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const HospitalDashboard = () => {
    const { campaigns, updateCampaign } = useCampaigns();
    const [session, setSession] = useState<{ hospitalId: string; adminId: string } | null>(null);
    const [loginForm, setLoginForm] = useState({ hospitalId: "", adminId: "" });
    const [isVerifying, setIsVerifying] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const hospital = getHospitalById(loginForm.hospitalId);
        if (hospital && hospital.adminId === loginForm.adminId) {
            setSession({ hospitalId: loginForm.hospitalId, adminId: loginForm.adminId });
            toast.success(`Welcome, Admin of ${hospital.name}`);
        } else {
            toast.error("Invalid Credentials. Access Denied.");
        }
    };

    const currentHospital = session ? getHospitalById(session.hospitalId) : null;

    // Filter Logic
    // 1. Identity Match: Only campaigns.hospitalId === session.hospitalId
    const myCampaigns = campaigns.filter(c => c.hospitalId === session?.hospitalId);

    // 2. Pending Actions: Anything NOT released yet (PENDING or VERIFIED but waiting for funds)
    // Actually, we show all active campaigns in the "Queue".
    const activeQueue = myCampaigns.filter(c => c.verificationStatus === 'PENDING' || c.verificationStatus === 'VERIFIED');

    const releasedHistory = myCampaigns.filter(c => c.verificationStatus === 'RELEASED');

    const handleVerifyIdentity = async (campaignId: string) => {
        setIsVerifying(campaignId);
        toast.info("Verifying Identity On-Chain...");
        await new Promise(resolve => setTimeout(resolve, 1500));

        updateCampaign(campaignId, {
            isVerified: true,
            verificationStatus: 'VERIFIED'
        });
        setIsVerifying(null);
        toast.success("Identity Verified! Campaign is now trusted.");
    };

    const handleReleaseFunds = async (campaignId: string) => {
        setIsVerifying(campaignId);
        toast.info("Releasing Funds...", { description: "Interacting with Vault Contract..." });
        await new Promise(resolve => setTimeout(resolve, 2500));

        const txHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

        updateCampaign(campaignId, {
            verificationStatus: 'RELEASED',
            verificationTxHash: txHash,
        });

        setIsVerifying(null);
        toast.success("Funds Released Successfully!", {
            description: `Transaction Hash: ${txHash.substring(0, 10)}...`
        });
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-display">Hospital Portal</CardTitle>
                            <CardDescription>Secure Gateway for Medical Verification</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Hospital ID</label>
                                    <Input
                                        placeholder="e.g. 890123"
                                        value={loginForm.hospitalId}
                                        onChange={e => setLoginForm({ ...loginForm, hospitalId: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Admin Access ID</label>
                                    <Input
                                        type="password"
                                        placeholder="Security Code"
                                        value={loginForm.adminId}
                                        onChange={e => setLoginForm({ ...loginForm, adminId: e.target.value })}
                                    />
                                </div>
                                <Button type="submit" className="w-full gradient-heart">
                                    <Lock className="w-4 h-4 mr-2" /> Authenticate
                                </Button>

                                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground border border-dashed">
                                    <p className="font-semibold mb-1">Demo Credentials:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <span>Apollo: 890123 / 1001</span>
                                        <span>AIIMS: 774129 / 1003</span>
                                        <span>Mayo: 556214 / 1002</span>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Dashboard Header */}
            <header className="bg-white border-b pt-24 pb-8 px-4">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <Stethoscope className="w-8 h-8 text-green-700" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{currentHospital?.name}</h1>
                            <p className="text-slate-500 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Verified Partner Node • {currentHospital?.region}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => setSession(null)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-2" /> Logout Session
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="mb-8 w-full md:w-auto h-auto p-1 bg-white border shadow-sm">
                        <TabsTrigger value="pending" className="py-2 px-4 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                            <Activity className="w-4 h-4" />
                            Active Queue
                            {activeQueue.length > 0 &&
                                <Badge className="ml-2 bg-red-500 hover:bg-red-600">{activeQueue.length}</Badge>
                            }
                        </TabsTrigger>
                        <TabsTrigger value="history" className="py-2 px-4 gap-2">
                            <FileCheck className="w-4 h-4" />
                            Released Funds
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-6">
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Stats Cards */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-500">Funds Pending Release</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ₹ {activeQueue.reduce((acc, c) => acc + c.raisedAmount, 0).toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-500">Awaiting Verification</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {activeQueue.filter(c => c.verificationStatus === 'PENDING').length} Campaigns
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <h3 className="text-lg font-semibold flex items-center gap-2 mt-8 mb-4">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Verification & Release Queue
                        </h3>

                        {activeQueue.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed text-slate-500">
                                <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No active campaigns found.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {activeQueue.map(campaign => {
                                    const percent = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);
                                    const isFullyFunded = percent >= 100;
                                    const isVerified = campaign.verificationStatus === 'VERIFIED';

                                    return (
                                        <Card key={campaign.id} className={cn("overflow-hidden transition-all hover:shadow-md", isFullyFunded ? "border-l-4 border-l-green-500" : "border-l-4 border-l-amber-500")}>
                                            <CardContent className="p-0">
                                                <div className="flex flex-col md:flex-row gap-6 p-6">
                                                    <img src={campaign.imageUrl} alt="" className="w-full md:w-48 h-32 object-cover rounded-lg bg-slate-200" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="font-bold text-lg flex items-center gap-2">
                                                                    {campaign.title}
                                                                    {isVerified && <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</Badge>}
                                                                </h3>
                                                                <p className="text-sm text-slate-500">Beneficiary: {campaign.beneficiaryName}</p>
                                                            </div>
                                                            <Badge variant={isFullyFunded ? "default" : "secondary"} className={cn(isFullyFunded ? "bg-green-600" : "")}>
                                                                {isFullyFunded ? "Goal Reached" : `${percent.toFixed(0)}% Funded`}
                                                            </Badge>
                                                        </div>

                                                        <p className="text-sm text-slate-600 line-clamp-2">{campaign.story}</p>

                                                        <div className="flex items-center justify-between pt-2">
                                                            <div className="text-sm">
                                                                Raised: <span className="font-semibold text-slate-900">₹{campaign.raisedAmount.toLocaleString()}</span>
                                                                <span className="text-slate-400 mx-1">/</span>
                                                                Goal: <span>₹{campaign.goalAmount.toLocaleString()}</span>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                {!isVerified && (
                                                                    <Button
                                                                        onClick={() => handleVerifyIdentity(campaign.id)}
                                                                        disabled={isVerifying === campaign.id}
                                                                        variant="outline"
                                                                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                                                    >
                                                                        {isVerifying === campaign.id ? "Verifying..." : "Verify Identity"}
                                                                    </Button>
                                                                )}

                                                                {isVerified && (
                                                                    isFullyFunded ? (
                                                                        <Button
                                                                            onClick={() => handleReleaseFunds(campaign.id)}
                                                                            disabled={isVerifying === campaign.id}
                                                                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                                                                        >
                                                                            {isVerifying === campaign.id ? "Processing..." : "Release Funds"}
                                                                        </Button>
                                                                    ) : (
                                                                        <Button variant="ghost" disabled className="text-slate-400 italic">
                                                                            <Lock className="w-4 h-4 mr-2" /> Awaiting Funds
                                                                        </Button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 px-6 py-2 border-t text-xs text-slate-500 flex justify-between items-center">
                                                    <span className="flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Status: <span className="font-semibold uppercase">{campaign.verificationStatus}</span>
                                                    </span>
                                                    <span>ID: {campaign.id}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="history">
                        <div className="bg-white rounded-xl border shadow-sm">
                            <div className="p-4 border-b bg-slate-50 font-medium grid grid-cols-4 gap-4 text-sm text-slate-500">
                                <div className="col-span-2">Campaign</div>
                                <div>Amount Released</div>
                                <div>Proof (TX Hash)</div>
                            </div>
                            {releasedHistory.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">No history found.</div>
                            ) : (
                                releasedHistory.map(campaign => (
                                    <div key={campaign.id} className="p-4 border-b last:border-0 grid grid-cols-4 gap-4 items-center">
                                        <div className="col-span-2">
                                            <p className="font-medium text-slate-900 truncate">{campaign.title}</p>
                                            <p className="text-xs text-slate-500">Verified by: {currentHospital?.adminId}</p>
                                        </div>
                                        <div className="font-mono text-green-600">
                                            ₹ {campaign.raisedAmount.toLocaleString()}
                                        </div>
                                        <div>
                                            <a href="#" className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-mono bg-blue-50 px-2 py-1 rounded max-w-[140px] truncate">
                                                {campaign.verificationTxHash?.substring(0, 10)}...
                                                <FileCheck className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
            <Footer />
        </div>
    );
};

export default HospitalDashboard;
