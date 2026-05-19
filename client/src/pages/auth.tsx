import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { login } = useStore();
  const { toast } = useToast();
  
  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const userData = await response.json();
        login(userData.email, userData.name);
        toast({ title: "Welcome back", description: "Successfully logged in." });
        setLocation("/dashboard");
      } else {
        const error = await response.json();
        toast({ variant: "destructive", title: "Login failed", description: error.error || "Invalid credentials." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Network error." });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please fill out all fields." });
      return;
    }
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        const userData = await response.json();
        login(userData.email, userData.name);
        toast({ title: "Account created", description: "Welcome to AI Career Copilot!" });
        setLocation("/dashboard");
      } else {
        const error = await response.json();
        toast({ variant: "destructive", title: "Error", description: error.error || "Registration failed." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Network error." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden selection:bg-purple-100 selection:text-purple-900">
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-slate-900 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900 to-slate-900"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-heading font-black tracking-tight text-white">Copilot</span>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-heading font-black text-white leading-[1.1]">
            Your Resume's <br />
            <span className="text-purple-400">Secret Weapon.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-md font-medium">
            Join thousands of students who cracked their dream tech interviews with AI-powered resume analysis.
          </p>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold text-sm">
            <Sparkles className="h-4 w-4 text-purple-400" /> Trusted by students from Tier-1/Tier-2 colleges
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="w-full max-w-md relative z-10">
          <Card className="bg-white/80 backdrop-blur-xl border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <CardContent className="p-8">
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-xl">
                  <TabsTrigger value="login" className="rounded-lg font-bold">Log In</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-lg font-bold">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-heading font-black text-slate-900">Welcome Back</h2>
                    <p className="text-sm text-slate-500 font-medium">Enter your details to access your dashboard.</p>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-bold text-slate-700">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-purple-500 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="font-bold text-slate-700">Password</Label>
                        <a href="#" className="text-xs font-bold text-purple-600 hover:text-purple-700">Forgot password?</a>
                      </div>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-purple-500 font-medium" />
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base shadow-sm transition-all hover:-translate-y-0.5">
                      Log In <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="register">
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-heading font-black text-slate-900">Create Account</h2>
                    <p className="text-sm text-slate-500 font-medium">Start optimizing your resume for free.</p>
                  </div>
                  <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name" className="font-bold text-slate-700">Full Name</Label>
                      <Input id="reg-name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-purple-500 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email" className="font-bold text-slate-700">Email</Label>
                      <Input id="reg-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-purple-500 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password" className="font-bold text-slate-700">Password</Label>
                      <Input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-purple-500 font-medium" />
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base shadow-sm transition-all hover:-translate-y-0.5">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}