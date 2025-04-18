import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Snapshots from "./pages/Snapshots";
import Metadata from "./pages/Metadata";
import Analysis from "./pages/Analysis";
import Visualization from "./pages/Visualization";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthCallback } from "./components/salesforce/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="h-screen w-screen overflow-hidden">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/snapshots" element={<Snapshots />} />
            <Route path="/metadata" element={<Metadata />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/visualization" element={<Visualization />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Authentication Routes */}
            <Route path="/auth" element={<Auth />} />
            {/* Salesforce OAuth callback handler - Processes the redirect after Salesforce authentication */}
            <Route path="/auth/callback/salesforce" element={<AuthCallback />} />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
