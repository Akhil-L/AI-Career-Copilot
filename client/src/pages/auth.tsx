import { useState, useEffect } from "wouter";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useStore } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { CheckSquare } from "lucide-react";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Auth() {
  const [location, setLocation] = useLocation();
  const { login } = useStore();
  const { toast } = useToast();
  
  // Parse query params properly (using a simple workaround as wouter doesn't have useSearchParams)
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const defaultTab = params.get("tab") || "login";
  
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof authSchema>, isRegister: boolean) => {
    if (isRegister) {
      try {
        const response = await fetch("https://e3530145-07c5-48e8-adfd-1ba958a88354-00-1rdomg3mwja33.riker.replit.dev/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.email,
            email: values.email,
            password: values.password,
            role: "worker"
          }),
        });

        if (response.ok) {
          toast({ title: "Registration successful", description: "Your account has been created." });
          login(values.email, "worker");
          setLocation("/dashboard");
        } else {
          const errorData = await response.json().catch(() => null);
          toast({ 
            title: "Registration failed", 
            description: errorData?.message || "An error occurred during registration.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({ 
          title: "Registration failed", 
          description: "Network error or server is unreachable.",
          variant: "destructive"
        });
      }
    } else {
      // Simple mock logic for demo
      if (values.email.includes("admin")) {
        login(values.email, "admin");
        toast({ title: "Welcome back, Admin", description: "You have full access." });
        setLocation("/admin");
      } else {
        login(values.email, "worker");
        toast({ title: "Welcome, Worker", description: "Ready to earn?" });
        setLocation("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-lg shadow-primary/20">
            <CheckSquare className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">DataEntry Pro</h1>
          <p className="text-muted-foreground mt-2">Secure access for professionals</p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-12">
            <TabsTrigger value="login" className="text-sm font-medium">Login</TabsTrigger>
            <TabsTrigger value="register" className="text-sm font-medium">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((v) => onSubmit(v, false))} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-11 text-base">Sign In</Button>
                    
                    <div className="text-xs text-center text-muted-foreground mt-4">
                      For Demo: Use "admin@test.com" for Admin View
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Start earning money with simple data entry tasks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((v) => onSubmit(v, true))} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <div className="flex items-center space-x-2 py-2">
                      <div className="h-4 w-4 rounded border border-primary bg-primary/20 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-sm bg-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">I agree to the Terms of Service</span>
                    </div>
                    <Button type="submit" className="w-full h-11 text-base">Create Account</Button>
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
