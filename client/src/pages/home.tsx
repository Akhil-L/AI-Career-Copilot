import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Target, Users, CheckCircle2, FileText, Briefcase, GraduationCap, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";

export default function Home() {
  return (
    <Layout>
      {/* Soft Modern Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-50 via-white to-purple-50 mb-16 pt-24 pb-20 px-8 text-center border border-white/50 premium-shadow">
        <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-gradient-to-b from-purple-200/40 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
          <Badge className="bg-white text-purple-600 border border-purple-100 font-bold px-4 py-1.5 rounded-full shadow-sm text-sm">
            <Sparkles className="h-3.5 w-3.5 mr-2" /> AI-Powered Career Growth
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight text-slate-900 leading-[1.1]">
            Land Your Dream <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Tech Role Faster.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
            Upload your resume, get instant ATS scoring, identify missing skills, and practice with AI-generated interviews tailored for modern tech companies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link href="/auth?tab=register">
              <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white h-14 px-10 text-base font-bold shadow-xl shadow-purple-500/20 rounded-2xl transition-all hover:-translate-y-1">
                Start for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold rounded-2xl h-14 px-10 text-base shadow-sm transition-all hover:-translate-y-1">
                See How It Works
              </Button>
            </Link>
          </div>

          <div className="pt-12 mt-8 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-400 font-medium">
            <div className="flex flex-col items-center gap-2">
              <p className="text-3xl font-black text-slate-800">10k+</p>
              <p className="text-sm">Resumes Optimized</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-3xl font-black text-slate-800">85%</p>
              <p className="text-sm">Interview Success</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-3xl font-black text-slate-800">50+</p>
              <p className="text-sm">Tech Giants Targeted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="mb-24 py-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-heading font-black text-slate-900 tracking-tight">Your Unfair Advantage</h2>
          <p className="text-lg text-slate-500 font-medium">
            We've analyzed thousands of successful job applications to build an AI that tells you exactly what recruiters want.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Instant ATS Scoring', desc: 'Know exactly how your resume parses before applying.', icon: Target, color: 'purple' },
            { title: 'Actionable Fixes', desc: 'Line-by-line recommendations to improve impact.', icon: Zap, color: 'indigo' },
            { title: 'Skill Gap Analysis', desc: 'Identify missing keywords for your target role.', icon: Briefcase, color: 'blue' },
            { title: 'AI Mock Interviews', desc: 'Practice technical rounds tailored to your weaknesses.', icon: Users, color: 'emerald' },
          ].map((feature, i) => (
            <Card key={i} className="bg-white border-slate-100 rounded-3xl premium-shadow hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className={`h-12 w-12 rounded-2xl bg-${feature.color}-50 text-${feature.color}-600 flex items-center justify-center mb-6`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="mb-24">
        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 premium-shadow">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold px-4 py-1.5 rounded-full">The Process</Badge>
              <h2 className="text-4xl font-heading font-black text-slate-900 tracking-tight leading-tight">Your Path to the Offer Letter</h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {[
                  { step: '1', title: 'Upload Resume', desc: 'Drop your current PDF or DOCX. We keep it secure and private.' },
                  { step: '2', title: 'Analyze & Fix', desc: 'Get instant ATS scoring and line-by-line feedback.' },
                  { step: '3', title: 'Prep & Conquer', desc: 'Practice with customized AI mock interviews.' },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-indigo-100 text-indigo-600 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                      {item.step}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-indigo-50 rounded-[2.5rem] blur-2xl opacity-60"></div>
              <Card className="relative bg-white/60 backdrop-blur-xl border-white/50 rounded-[2rem] p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Software_Engineer.pdf</p>
                        <p className="text-xs text-slate-500">Uploaded just now</p>
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      85%
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <p className="text-sm font-medium">Keywords optimized for Frontend Role</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <p className="text-sm font-medium">Action verbs improved by 40%</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                      <p className="text-sm font-medium">ATS parsing successful</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="bg-slate-900 rounded-[3rem] p-16 text-center text-white mb-12 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight text-white">Ready to Land Your Dream Job?</h2>
          <p className="text-slate-300 text-lg font-medium">
            Join thousands of students who have cracked interviews at top tier companies using AI Copilot.
          </p>
          <Link href="/auth?tab=register">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-10 rounded-2xl font-bold text-base transition-all hover:-translate-y-1">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
