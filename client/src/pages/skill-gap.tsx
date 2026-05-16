import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Zap, BookOpen, ExternalLink, ArrowRight, Code } from "lucide-react";
import { Link } from "wouter";

export default function SkillGap() {
  const missingSkills = [
    { name: "Docker", category: "DevOps", importance: "High", match: 0 },
    { name: "AWS/Cloud", category: "Infrastructure", importance: "High", match: 20 },
    { name: "System Design", category: "Architecture", importance: "Medium", match: 40 },
  ];

  const presentSkills = [
    { name: "React.js", category: "Frontend" },
    { name: "TypeScript", category: "Language" },
    { name: "Node.js", category: "Backend" },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-heading font-black text-slate-900">Skill Gap</h1>
            <p className="text-slate-500 mt-1">Compared against "Software Engineer (SDE-1)".</p>
          </div>
          <Link href="/interview-prep">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 rounded-xl">
              Start Mock Interview <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-white rounded-[1.5rem] border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-amber-50/50 border-b border-amber-100/50 pb-4 p-6">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg font-bold text-slate-900">Missing Key Skills</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {missingSkills.map(skill => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">{skill.name}</span>
                    <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200">{skill.importance} Priority</Badge>
                  </div>
                  <Progress value={skill.match} className="h-2 bg-slate-100" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white rounded-[1.5rem] border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-100/50 pb-4 p-6">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-lg font-bold text-slate-900">Verified Strengths</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-3">
                {presentSkills.map(skill => (
                  <div key={skill.name} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center gap-3">
                    <Code className="h-4 w-4 text-slate-400" />
                    <span className="font-bold text-slate-700 text-sm">{skill.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="pt-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">Learning Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="rounded-xl hover:border-purple-200 transition-colors border-slate-100 shadow-sm cursor-pointer group">
              <CardContent className="p-5 flex gap-4 items-center">
                <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm">Docker Crash Course</h3>
                  <p className="text-xs text-slate-500">2 hours • Free</p>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-purple-500" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
