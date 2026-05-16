import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, CheckCircle2, Download, Trash2 } from "lucide-react";
import { Link } from "wouter";

export default function ResumeHistory() {
  const history = [
    { id: 1, name: "Software_Engineer_V2.pdf", date: "Today", score: 85, target: "Frontend Dev" },
    { id: 2, name: "SDE_Resume_Final.pdf", date: "2 days ago", score: 72, target: "SDE-1" },
    { id: 3, name: "Old_Resume.pdf", date: "1 week ago", score: 55, target: "General" },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-heading font-black text-slate-900">Resume History</h1>
            <p className="text-slate-500 mt-1">Track your progress and previous analyses.</p>
          </div>
          <Link href="/resume-upload">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl h-11 px-6 shadow-sm">
              New Analysis
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {history.map(item => (
            <Card key={item.id} className="border-slate-100 shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-medium text-slate-500">{item.date}</span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-xs font-medium text-slate-500">Target: {item.target}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="text-center sm:text-right shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Score</p>
                    <Badge className={
                      item.score >= 80 ? "bg-emerald-100 text-emerald-700 border-none font-bold" :
                      item.score >= 70 ? "bg-amber-100 text-amber-700 border-none font-bold" :
                      "bg-slate-100 text-slate-700 border-none font-bold"
                    }>
                      {item.score}%
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto ml-auto">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900"><Download className="h-4 w-4" /></Button>
                    <Link href="/ats-analysis">
                      <Button variant="outline" className="font-bold border-slate-200 rounded-lg">View Report</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
