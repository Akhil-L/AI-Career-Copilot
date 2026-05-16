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
    { name: "GraphQL", category: "API", importance: "Low", match: 0 },
  ];

  const presentSkills = [
    { name: "React.js", category: "Frontend" },
    { name: "TypeScript", category: "Language" },
    { name: "Node.js", category: "Backend" },
    { name: "PostgreSQL", category: "Database" },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">Skill Gap Analysis</h1>
            <p className="text-slate-500 mt-1">Comparing your profile against "Full Stack Engineer (SDE-1)" requirements.</p>
          </div>
          <Link href="/interview-prep">
            <Button className="bg-slate-900 hover:bg-slate-800 font-bold px-6 shadow-xl">
              Start Interview Prep <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Missing Skills */}
          <Card className="bg-white rounded-[2rem] premium-shadow border-slate-200/60 overflow-hidden">
            <CardHeader className="bg-amber-50/50 border-b border-amber-100/50 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                  <Target className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-black text-slate-900">Missing Key Skills</CardTitle>
              </div>
              <CardDescription className="font-medium mt-2">These skills appear in 85% of target job descriptions but are missing from your resume.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {missingSkills.map(skill => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{skill.name}</span>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-slate-400">{skill.category}</Badge>
                    </div>
                    <Badge className={skill.importance === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}>
                      {skill.importance} Priority
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={skill.match} className="h-2 bg-slate-100" />
                    <span className="text-xs font-bold text-slate-400 w-8">{skill.match}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Verified Skills */}
          <Card className="bg-white rounded-[2rem] premium-shadow border-slate-200/60 overflow-hidden">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-100/50 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Zap className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-black text-slate-900">Verified Strengths</CardTitle>
              </div>
              <CardDescription className="font-medium mt-2">Core requirements successfully detected in your profile.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {presentSkills.map(skill => (
                  <div key={skill.name} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-3">
                    <Code className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{skill.name}</p>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500">{skill.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Resources */}
        <h2 className="text-2xl font-black text-slate-900 mt-12 mb-6">Recommended Learning Path</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="rounded-[1.5rem] hover:shadow-xl transition-all border-slate-200/60 group cursor-pointer">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">Docker for Beginners</h3>
              <p className="text-sm text-slate-500">Master containerization basics to satisfy DevOps requirements in 3 hours.</p>
              <Button variant="link" className="px-0 text-blue-600 font-bold">Start Course <ExternalLink className="ml-1 h-3 w-3" /></Button>
            </CardContent>
          </Card>
          <Card className="rounded-[1.5rem] hover:shadow-xl transition-all border-slate-200/60 group cursor-pointer">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-600 transition-colors">AWS Essentials</h3>
              <p className="text-sm text-slate-500">Learn EC2, S3, and basic deployment to pass cloud infrastructure filters.</p>
              <Button variant="link" className="px-0 text-orange-600 font-bold">Start Course <ExternalLink className="ml-1 h-3 w-3" /></Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </Layout>
  );
}
