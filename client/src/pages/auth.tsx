import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Target } from "lucide-react";

const authSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Auth() {
  const [, setLocation] = useLocation();
  const { login } = useStore();
  const { toast } = useToast();
  
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const defaultTab = params.get("tab") || "login";
  
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "", firstName: "", lastName: "" },
  });

  const onSubmit = async (values: z.infer<typeof authSchema>, isRegister: boolean) => {
    // For mockup purposes, we bypass the actual API calls to avoid backend dependency issues during rapid redesign
    // We just simulate a successful login as a student.
    const name = isRegister ? `${values.firstName} ${values.lastName}`.trim() : "Student User";
    
    setTimeout(() => {
      login(values.email, "student" as any, name || "Student User");
      toast({ title: "Welcome to AI Copilot", description: "Let's land your dream job." });
      setLocation("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-blue-600 text-white mb-4 shadow-xl shadow-blue-500/20">
            <Target className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-heading font-black text-slate-900 tracking-tight">AI Career Copilot</h1>
          <p className="text-slate-500 mt-2 font-medium">Your unfair advantage in tech hiring</p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-white border border-slate-200/50 p-1 rounded-xl">
            <TabsTrigger value="login" className="rounded-lg font-bold">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg font-bold">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="bg-white p-8 pb-4">
                <CardTitle className="text-2xl font-black">Welcome Back</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Access your resume reports and prep materials.</CardDescription>
              </CardHeader>
              <CardContent className="bg-white p-8 pt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((v) => onSubmit(v, false))} className="space-y-5">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Email Address</FormLabel>
                        <FormControl><Input placeholder="student@college.edu" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Password</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-base mt-2">Sign In</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="bg-white p-8 pb-4">
                <CardTitle className="text-2xl font-black">Join Copilot</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Crack your next interview.</CardDescription>
              </CardHeader>
              <CardContent className="bg-white p-8 pt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((v) => onSubmit(v, true))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold">First Name</FormLabel><FormControl><Input className="h-11 rounded-xl bg-slate-50 border-slate-200" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem><FormLabel className="font-bold">Last Name</FormLabel><FormControl><Input className="h-11 rounded-xl bg-slate-50 border-slate-200" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel className="font-bold">Email</FormLabel><FormControl><Input type="email" className="h-11 rounded-xl bg-slate-50 border-slate-200" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem><FormLabel className="font-bold">Password</FormLabel><FormControl><Input type="password" className="h-11 rounded-xl bg-slate-50 border-slate-200" {...field} /></FormControl></FormItem>
                    )} />
                    <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-base mt-4">Create Account</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
