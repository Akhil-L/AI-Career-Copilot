import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, AlertTriangle, CheckCircle2, ArrowRight, Zap, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

export default function ATSAnalysis() {
  const radarData = [
    { subject: 'Impact/Results', A: 45, fullMark: 100 },
    { subject: 'Keywords', A: 80, fullMark: 100 },
    { subject: 'Formatting', A: 95, fullMark: 100 },
    { subject: 'Action Verbs', A: 60, fullMark: 100 },
    { subject: 'Clarity', A: 85, fullMark: 100 },
    { subject: 'Skills Match', A: 70, fullMark: 100 },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">ATS Analysis Report</h1>
            <p className="text-slate-500 mt-1">Review your automated resume score and suggested improvements.</p>
          </div>
          <Link href="/skill-gap">
            <Button className="bg-blue-600 hover:bg-blue-500 font-bold px-6 shadow-lg shadow-blue-500/20">
              View Skill Gaps <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Score Card */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2rem] overflow-hidden relative premium-shadow border-none">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Target className="h-48 w-48" />
            </div>
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-slate-200 text-sm font-black uppercase tracking-widest">Overall ATS Match</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-col items-center justify-center py-10">
              <div className="relative flex items-center justify-center mb-6">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-700" />
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="552.92" strokeDashoffset="154.81" className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" strokeLinecap="round" />
                </svg>
                <div className="absolute text-5xl font-black">72<span className="text-xl text-slate-400">%</span></div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-4 py-1">Needs Improvement</Badge>
              <p className="text-center text-slate-400 text-sm mt-6">
                Your resume parses well but lacks quantifiable achievements and specific technical keywords for SDE roles.
              </p>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="lg:col-span-2 bg-white rounded-[2rem] premium-shadow border-slate-200/60">
            <CardHeader>
              <CardTitle className="text-lg font-black text-slate-900">Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Resume" dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Fixes */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900">Critical Improvements</h2>
          
          <Card className="rounded-[1.5rem] border-l-4 border-l-amber-500 bg-white">
            <CardContent className="p-6 flex gap-6 items-start">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Missing Quantifiable Metrics</h4>
                <p className="text-slate-600 mt-1 mb-4">You have listed responsibilities but no measurable outcomes. Recruiters look for metrics like % improvement, $ saved, or number of users.</p>
                <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">
                  <span className="text-red-500 line-through mr-2">"Worked on improving API response time."</span>
                  <ArrowRight className="inline h-4 w-4 mx-2 text-slate-400" />
                  <span className="text-emerald-600 font-medium">"Decreased API latency by 45% using Redis caching, serving 10k+ daily users."</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.5rem] border-l-4 border-l-amber-500 bg-white">
            <CardContent className="p-6 flex gap-6 items-start">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Weak Action Verbs</h4>
                <p className="text-slate-600 mt-1 mb-4">Replace passive words with strong action verbs to make your bullet points more impactful.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-slate-500 line-through">Helped with</Badge>
                  <ArrowRight className="h-4 w-4 text-slate-300 self-center" />
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Architected</Badge>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Spearheaded</Badge>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Executed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.5rem] border-l-4 border-l-emerald-500 bg-white">
            <CardContent className="p-6 flex gap-6 items-start">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Good Formatting & Parsing</h4>
                <p className="text-slate-600 mt-1">Your resume uses standard fonts and a single-column layout, making it 100% readable by Applicant Tracking Systems.</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </Layout>
  );
}
