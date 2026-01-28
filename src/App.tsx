import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import FacultyList from "./pages/FacultyList";
import CGPACalculator from "./pages/CGPACalculator";
import SGPACalculator from "./pages/SGPACalculator";
import ContributeFaculty from "./pages/ContributeFaculty";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/faculty" element={<FacultyList />} />
            <Route path="/cgpa-calculator" element={<CGPACalculator />} />
            <Route path="/sgpa-calculator" element={<SGPACalculator />} />
            <Route path="/contribute" element={<ContributeFaculty />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
