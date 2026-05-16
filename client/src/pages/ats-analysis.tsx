import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, AlertTriangle, CheckCircle2, ArrowRight, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

export default function ATSAnalysis() {
  const radarData = [
    { subject: 'Impact', A: 45, fullMark: 100 },
    { subject: 'Keywords', A: 80, fullMark: 100 },
    { subject: 'Format', A: 95, fullMark: 100 },
    { subject: 'Verbs', A: 60, fullMark: 100 },
    { subject: 'Clarity', A: 85, fullMark: 100 },
    { subject: 'Skills', A: 70, fullMark: 100 },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-heading font-black text-slate-900">Analysis Report</h1>
            <p className="text-slate-500 mt-1">Based on "Software Engineer" role.</p>
          </div>
          <Link href="/skill-gap">
            <Button className="bg-slate-900 hover:bg-slate-800 font-bold px-6 rounded-xl">
              View Missing Skills <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Card */}
          <Card className="lg:col-span-1 bg-white border-slate-100 rounded-[1.5rem] shadow-sm flex flex-col items-center justify-center p-8 text-center">
            <h3 className="font-bold text-slate-500 mb-6 uppercase tracking-widest text-xs">Overall Match</h3>
            <div className="relative flex items-center justify-center mb-6">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="452" strokeDashoffset="126" className="text-amber-500" strokeLinecap="round" />
              </svg>
              <div className="absolute text-4xl font-black text-slate-900">72<span className="text-lg text-slate-400">%</span></div>
            </div>
            <Badge className="bg-amber-100 text-amber-700 border-none font-bold px-3 py-1 mb-2">Needs Work</Badge>
            <p className="text-slate-500 text-sm">Parses well but lacks quantifiable metrics.</p>
          </Card>

          {/* Radar Chart */}
          <Card className="lg:col-span-2 bg-white border-slate-100 rounded-[1.5rem] shadow-sm">
            <CardContent className="h-[300px] p-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Resume" dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Fixes */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-slate-900 px-2">Recommended Fixes</h2>
          
          <Card className="rounded-xl border-l-4 border-l-amber-500 bg-white border-y-slate-100 border-r-slate-100 shadow-sm">
            <CardContent className="p-5 flex gap-4 items-start">
              <div className="mt-1"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
              <div>
                <h4 className="font-bold text-slate-900">Add Quantifiable Metrics</h4>
                <p className="text-slate-600 text-sm mt-1 mb-3">Recruiters look for numbers. Replace vague statements with concrete results.</p>
                <div className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-100">
                  <p className="text-red-500 line-through mb-1">"Worked on improving API."</p>
                  <p className="text-emerald-600 font-medium">"Decreased API latency by 45% using Redis."</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-l-4 border-l-amber-500 bg-white border-y-slate-100 border-r-slate-100 shadow-sm">
            <CardContent className="p-5 flex gap-4 items-start">
              <div className="mt-1"><Lightbulb className="h-5 w-5 text-blue-500" /></div>
              <div>
                <h4 className="font-bold text-slate-900">Stronger Action Verbs</h4>
                <p className="text-slate-600 text-sm mt-1 mb-3">Replace passive words like "Helped with" to strong verbs like "Architected" or "Executed".</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
