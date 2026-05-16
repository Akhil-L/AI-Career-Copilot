import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useStore } from "@/lib/store";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import SkillGap from "@/pages/skill-gap";
import ResumeUpload from "@/pages/resume-upload";
import InterviewPrep from "@/pages/interview-prep";
import ResumeHistory from "@/pages/resume-history";
import ProfilePage from "@/pages/profile";
import MessagesPage from "@/pages/messages";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import ForBusinesses from "@/pages/for-businesses";
import AtsAnalysis from "@/pages/ats-analysis";
import { TermsPage, PrivacyPage, PayoutPolicyPage } from "@/pages/legal";

function Router() {
  const [location, setLocation] = useLocation();
  const { currentUser, login, logout, fetchTasks, fetchSubmissions } = useStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("https://workflow-backend-mdfx.onrender.com/api/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (response.ok) {
          const userData = await response.json();
          // Store actual user data and map it to our UI store structure
          login(userData.email, userData.role || "worker", userData.name);
          
          // Route protection based on role
          const role = userData.role || "worker";
          const path = location;
          
          // Redirect to respective dashboards if on root but logged in (optional but good UX)
          if (path === "/" || path === "/auth") {
            setLocation("/dashboard");
          }
        } else {
          logout();
          if (location !== "/" && location !== "/auth" && !location.startsWith("/about") && !location.startsWith("/contact") && !location.startsWith("/businesses") && !location.startsWith("/terms") && !location.startsWith("/privacy") && !location.startsWith("/payout-policy")) {
             setLocation("/auth");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    
    checkAuth();
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ats-analysis" component={AtsAnalysis} />
      <Route path="/resume-history" component={ResumeHistory} />
      <Route path="/skill-gap" component={SkillGap} />
      <Route path="/interview-prep" component={InterviewPrep} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/resume-upload" component={ResumeUpload} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/businesses" component={ForBusinesses} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/payout-policy" component={PayoutPolicyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
