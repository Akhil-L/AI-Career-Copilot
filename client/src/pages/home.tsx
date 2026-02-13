import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Zap, DollarSign, Globe, CheckSquare, Target, Users, BarChart } from "lucide-react";
import { Layout } from "@/components/layout";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white mb-16">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40 z-10"></div>
           <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            alt="Global Data Operations Center" 
            className="w-full h-full object-cover object-center opacity-60"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-8 py-24 md:py-32 flex flex-col items-start gap-6 max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
            Global Operations: 24/7 Enterprise Data Solutions
          </div>
          
          <h1 className="text-4xl md:text-7xl font-heading font-bold leading-tight tracking-tight text-white">
            Precision Data <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              For Global Enterprise
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Lexington Global specializes in large-scale data processing, manual auditing, and verification services. We connect enterprise-grade projects with certified data specialists worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/auth?tab=register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white border-none h-14 px-10 text-lg shadow-xl shadow-blue-900/40 font-bold">
                Join our Global Network
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-slate-700 hover:bg-slate-800 text-white hover:text-white font-semibold">
                Specialist Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Scale Section */}
      <section className="mb-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Enterprise Infrastructure at Scale</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Lexington Global provides the structural backbone for companies requiring high-volume data verification and processing. Our platform ensures that every record meets rigorous quality standards before delivery.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Target className="h-5 w-5" /></div>
                <div>
                  <h4 className="font-bold text-slate-900">99.8% Accuracy</h4>
                  <p className="text-sm text-slate-500">Rigorous auditing for every task.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="h-5 w-5" /></div>
                <div>
                  <h4 className="font-bold text-slate-900">Global Workforce</h4>
                  <p className="text-sm text-slate-500">Certified specialists in 40+ countries.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-blue-600/10 blur-3xl -z-10 rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" 
              alt="Data Analytics" 
              className="rounded-2xl shadow-2xl border border-slate-100"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 rounded-3xl p-16 text-center text-white relative overflow-hidden mb-12">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">Ready to Scale Your Earnings?</h2>
          <p className="text-slate-300 mb-10 text-xl leading-relaxed">
            Lexington Global is currently accepting applications for certified data entry specialists. Get access to premium enterprise contracts today.
          </p>
          <Link href="/auth?tab=register">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 border-none px-12 h-14 font-bold text-lg shadow-2xl">
              Create Your Professional Profile
            </Button>
          </Link>
        </div>
        
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>
    </Layout>
  );
}
