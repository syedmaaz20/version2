import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import HowItWorks from "./pages/HowItWorks";
import StudentProfile from "./pages/StudentProfile";
import StudentDashboard from "./pages/StudentDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import DonorProfile from "./pages/DonorProfile";
import AdminDashboard from "./pages/AdminDashboard";
import { findCampaignByShareCode } from "@/utils/campaignShortUrl";
import React from "react";

const queryClient = new QueryClient();

const ShortCampaignDetail = () => {
  // Special page for /c/:shareCode
  // Needs to match the campaign by shareCode. If not found, render NotFound
  const { shareCode } = window.location.pathname.match(/^\/c\/(?<shareCode>[^/]+)/)?.groups || {};
  const campaign = shareCode ? findCampaignByShareCode(shareCode) : undefined;
  if (!campaign) return <NotFound />;
  return <CampaignDetail campaign={campaign} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            
            {/* Protected Routes */}
            <Route 
              path="/student-profile" 
              element={
                <PrivateRoute requiredUserType="student">
                  <StudentProfile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/student-dashboard" 
              element={
                <PrivateRoute requiredUserType="student">
                  <StudentDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/donor-dashboard" 
              element={
                <PrivateRoute requiredUserType="donor">
                  <DonorDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/donor-profile" 
              element={
                <PrivateRoute requiredUserType="donor">
                  <DonorProfile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <PrivateRoute requiredUserType="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            
            {/* NEW: Share-friendly short campaign route */}
            <Route path="/c/:shareCode" element={<ShortCampaignDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;