import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { CampaignProvider } from "@/context/CampaignContext";
import { UserProvider } from "@/context/UserContext";
import { WalletProvider } from "@/context/WalletContext";
import CampaignDetail from "./pages/CampaignDetail";
import SavedLives from "./pages/SavedLives";
import CreateCampaign from "./pages/CreateCampaign";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CampaignProvider>
      <UserProvider>
        <WalletProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create-campaign" element={<CreateCampaign />} />
                <Route path="/campaign/:id" element={<CampaignDetail />} />
                <Route path="/saved-lives" element={<SavedLives />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WalletProvider>
      </UserProvider>
    </CampaignProvider>
  </QueryClientProvider>
);

export default App;

