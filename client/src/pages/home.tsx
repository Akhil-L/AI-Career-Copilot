import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Zap, DollarSign, Globe } from "lucide-react";
import { Layout } from "@/components/layout";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white mb-16">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40 z-10"></div>
           <img 
            src="/images/hero-office.png" 
            alt="Office background" 
            className="w-full h-full object-cover object-center opacity-60"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-8 py-24 md:py-32 flex flex-col items-start gap-6 max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
            Now Hiring Remote Data Specialists
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight tracking-tight text-white">
            Secure Data Entry Work <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              On Your Schedule
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Join thousands of professionals earning money by processing data for top companies. 
            Flexible hours, guaranteed payouts, and a trusted platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/auth?tab=register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white border-none h-12 px-8 text-base shadow-lg shadow-blue-900/20">
                Start Earning Today
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-slate-700 hover:bg-slate-800 text-white hover:text-white">
                Worker Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { label: "Active Workers", value: "12,000+", icon: Globe },
          { label: "Tasks Completed", value: "8.5M", icon: CheckSquare },
          { label: "Paid Out", value: "$4.2M", icon: DollarSign },
          { label: "Uptime", value: "99.99%", icon: Zap },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white/50 hover:bg-white transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
              <stat.icon className="h-6 w-6 text-primary mb-2 opacity-80" />
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Features Grid */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-slate-900 mb-4">Why Choose DataEntry Pro?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">We've built a platform that respects your time and skill. No bidding wars, just fair pay for accurate work.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Guaranteed Payouts", 
              desc: "Payments are processed weekly directly to your account. No minimum withdrawal limits for active workers.",
              icon: DollarSign
            },
            { 
              title: "Secure Environment", 
              desc: "Bank-grade encryption keeps data safe. Work confidently knowing our platform is monitored 24/7.",
              icon: ShieldCheck
            },
            { 
              title: "Instant Approval", 
              desc: "Our AI-assisted review system approves 80% of tasks instantly, so you get feedback faster.",
              icon: Zap
            }
          ].map((feature, i) => (
            <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-slate-100 overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-6">Ready to start working?</h2>
          <p className="text-slate-300 mb-8 text-lg">Create your account in minutes and get access to thousands of data entry tasks immediately.</p>
          <Link href="/auth?tab=register">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-none px-8 font-semibold">
              Create Free Account
            </Button>
          </Link>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>
    </Layout>
  );
}

import { CheckSquare } from "lucide-react";
