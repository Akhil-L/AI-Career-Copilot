import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import WorkerDashboard from "@/pages/dashboard-worker";
import AdminDashboard from "@/pages/dashboard-admin";
import TaskDetail from "@/pages/task-detail";
import TrainingPage from "@/pages/training";
import PayoutsPage from "@/pages/payouts-worker";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import ForBusinesses from "@/pages/for-businesses";
import ClientDashboard from "@/pages/dashboard-client";
import { TermsPage, PrivacyPage, PayoutPolicyPage } from "@/pages/legal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={WorkerDashboard} />
      <Route path="/client" component={ClientDashboard} />
      <Route path="/payouts" component={PayoutsPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/training" component={TrainingPage} />
      <Route path="/task/:id" component={TaskDetail} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
