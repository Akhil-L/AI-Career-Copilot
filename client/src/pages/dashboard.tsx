import { Layout } from "@/components/layout";
import { useStore, Task, TRAINING_MODULES, User } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { FileText, Target, CheckCircle2, TrendingUp, ArrowRight, ShieldAlert, GraduationCap, AlertTriangle, Star, Award, BarChart3, Zap, ShieldCheck, ArrowUpRight, UploadCloud, LineChart, Sparkles } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function getStudentRank(user: User) {
  const score = user.accuracyScore || 0; // Using accuracyScore as ATS score avg
  const analyzed = user.approvedSubmissions || 0;
  
  if (analyzed > 10 && score >= 90) return { label: "Top Candidate", color: "bg-purple-100 text-purple-700 border-purple-200" };
  if (analyzed > 3 && score >= 75) return { label: "Interview Ready", color: "bg-blue-100 text-blue-700 border-blue-200" };
  return { label: "Improving", color: "bg-slate-100 text-slate-700 border-slate-200" };
}

export default function Dashboard() {
  const { currentUser, tasks, assignTask } = useStore();
  const [, setLocation] = useLocation();
  
  if (!currentUser) return <div className="p-8 text-center">Please log in</div>;

  if (currentUser.role === 'admin') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-6">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Admin View</h1>
          <p className="text-slate-500 mb-8 max-w-md text-center">You are logged in as an administrator. Please use the admin portal to view system analytics.</p>
          <Button onClick={() => setLocation("/admin")} className="font-semibold">
            Go to Admin Portal
          </Button>
        </div>
      </Layout>
    );
  }

  const isPrepComplete = currentUser.completedModules.length === TRAINING_MODULES.length;
  const prepProgress = Math.round((currentUser.completedModules.length / TRAINING_MODULES.length) * 100);
  
  // Repurposing "tasks" as "Target Roles" or "Job Descriptions" to match against
  const targetRoles = tasks.filter(t => t.status === "open" || t.assignedTo === currentUser.id);
  const myApplications = tasks.filter(t => t.assignedTo === currentUser.id && t.status !== "approved" && t.status !== "rejected");
  const completedAnalyses = tasks.filter(t => t.assignedTo === currentUser.id && t.status === "approved");
  
  const atsScoreAvg = currentUser.accuracyScore || 72; // Mocking ATS Score
  const dynamicUser = { ...currentUser, accuracyScore: atsScoreAvg };
  const rank = getStudentRank(dynamicUser);

  const mockChartData = [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 68 },
    { name: 'Wed', score: 74 },
    { name: 'Thu', score: 72 },
    { name: 'Fri', score: 85 },
    { name: 'Sat', score: 88 },
    { name: 'Sun', score: 92 },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!isPrepComplete && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900">AI Interview Prep ({prepProgress}%)</h3>
              <p className="text-blue-700 text-sm">Complete your AI-guided interview prep modules to increase your chances of clearing technical rounds at top MNCs.</p>
            </div>
            <Link href="/interview-prep">
              <Button className="bg-blue-600 hover:bg-blue-500 font-bold gap-2">
                <GraduationCap className="h-4 w-4" /> Continue Prep
              </Button>
            </Link>
          </div>
        )}

        {/* Welcome & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-heading font-bold text-slate-900">Career Overview</h1>
              <Badge variant="outline" className={`font-bold px-3 py-1 ${rank.color}`}>
                <Star className="h-3 w-3 mr-1.5 fill-current" /> {rank.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">Welcome back, {currentUser.name}. Track your resume ATS scores and interview readiness.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/resume-upload">
              <Button className="font-bold gap-2 shadow-lg shadow-blue-500/20">
                <UploadCloud className="h-4 w-4" /> Analyze New Resume
              </Button>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-200/60 shadow-sm premium-shadow hover:translate-y-[-2px] transition-all duration-300 flex flex-col h-full rounded-[2rem]">
            <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
              <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/50 shrink-0">
                <Target className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 truncate">Avg ATS Score</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-3xl font-black text-slate-900 truncate">{atsScoreAvg}%</h3>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">Top 15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-slate-200/60 shadow-sm premium-shadow hover:translate-y-[-2px] transition-all duration-300 flex flex-col h-full rounded-[2rem]">
            <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 shrink-0">
                <FileText className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 truncate">Resumes Analyzed</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-3xl font-black text-slate-900 truncate">{completedAnalyses.length}</h3>
                  <span className="text-[10px] font-bold text-slate-400 italic shrink-0">Total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200/60 shadow-sm premium-shadow hover:translate-y-[-2px] transition-all duration-300 flex flex-col h-full rounded-[2rem]">
            <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
              <div className="p-4 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100/50 shrink-0">
                <Award className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 truncate">Skills Verified</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-3xl font-black text-slate-900 truncate">12</h3>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">+3 this week</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <Card className="border-slate-200/60 premium-shadow rounded-2xl overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-50 px-8 pt-8">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900">ATS Score Progression</CardTitle>
                  <CardDescription className="font-medium text-slate-500 mt-1">Your resume score improvements over time</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
                    <LineChart className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-8 pt-10">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                        itemStyle={{ fontWeight: 800, fontSize: '14px', color: '#1e293b' }}
                        labelStyle={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '4px' }}
                        formatter={(value: number) => [`${value}%`, 'ATS Score']}
                      />
                      <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" animationDuration={1500} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="roles" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">Target Roles</h2>
                  <p className="text-sm font-medium text-slate-500">Analyze your resume against top industry job descriptions</p>
                </div>
                <TabsList className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 h-auto">
                  <TabsTrigger value="roles" className="rounded-xl px-6 py-2.5 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all">
                    Open Roles ({targetRoles.length})
                  </TabsTrigger>
                  <TabsTrigger value="analyzed" className="rounded-xl px-6 py-2.5 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all">
                    Analyzed ({completedAnalyses.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="roles" className="space-y-6 focus-visible:outline-none">
                {targetRoles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-slate-300 rounded-3xl gap-4">
                    <div className="p-4 rounded-full bg-slate-50 text-slate-300">
                      <Target className="h-10 w-10 opacity-20" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-lg font-bold text-slate-900">No Target Roles</p>
                      <p className="text-sm text-slate-500">Add a job description to analyze your resume against it.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {targetRoles.map(task => (
                      <RoleCard 
                        key={task.id} 
                        task={task} 
                        actionLabel="Analyze Resume"
                        onAction={() => isPrepComplete ? assignTask(task.id, currentUser.id) : setLocation("/interview-prep")}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analyzed" className="space-y-6 focus-visible:outline-none">
                {completedAnalyses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-slate-300 rounded-3xl gap-4">
                    <div className="p-4 rounded-full bg-slate-50 text-slate-300">
                      <FileText className="h-10 w-10 opacity-20" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-lg font-bold text-slate-900">No analyses yet</p>
                      <p className="text-sm text-slate-500">Upload your resume to get started.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {completedAnalyses.map(task => (
                      <RoleCard 
                        key={task.id} 
                        task={task} 
                        actionLabel="View Analysis"
                        linkTo={`/ats-analysis/${task.id}`}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar / Activity Feed */}
          <div className="space-y-6">
            <Card className="border-slate-200/60 premium-shadow rounded-2xl overflow-hidden bg-white h-full">
              <CardHeader className="pb-2 pt-8 px-8">
                <CardTitle className="text-xl font-black text-slate-900">AI Insights</CardTitle>
                <CardDescription className="font-medium text-slate-500">Recent suggestions from your Copilot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 px-8 pb-8">
                {[
                  { title: 'Keyword Optimization', desc: 'Add "React Hooks" and "Zustand" to match frontend roles.', time: '2h ago', icon: Zap, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                  { title: 'Resume Uploaded', desc: 'SDE_Resume_v4.pdf analyzed successfully', time: '5h ago', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                  { title: 'Action Verbs Needed', desc: 'Replace "worked on" with "architected" or "developed"', time: '1d ago', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                  { title: 'Module Completed', desc: 'Technical Interview Prep Phase 1', time: '2d ago', icon: GraduationCap, color: 'text-purple-600 bg-purple-50 border-purple-100' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group cursor-default">
                    <div className={`mt-1 h-10 w-10 rounded-xl border ${item.color} flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</p>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden relative rounded-3xl premium-shadow">
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform hover:scale-110">
                <Sparkles className="h-24 w-24" />
              </div>
              <CardHeader className="pb-4 relative z-10 px-8 pt-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <CardTitle className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Copilot Tip</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-8 pb-4">
                <p className="text-base text-slate-300 leading-relaxed font-medium">
                  Companies like <span className="text-white font-black underline decoration-blue-500 decoration-2 underline-offset-4">Infosys & TCS</span> look for specific quantifiable metrics. Add numbers to your project bullet points.
                </p>
              </CardContent>
              <CardFooter className="relative z-10 px-8 pb-8">
                <Button variant="link" className="text-blue-400 p-0 h-auto font-black text-xs hover:text-blue-300 transition-colors group" onClick={() => setLocation("/skill-gap")}>
                  View Skill Gap <ArrowUpRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function RoleCard({ task, actionLabel, onAction, linkTo }: { task: Task, actionLabel: string, onAction?: () => void, linkTo?: string }) {
  return (
    <Card className="hover:shadow-2xl transition-all duration-500 flex flex-col h-full border-slate-200/60 bg-white group rounded-3xl premium-shadow hover:translate-y-[-4px]">
      <CardHeader className="pb-4 pt-8 px-8">
        <div className="flex justify-between items-start gap-4">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 w-fit font-black text-[10px] uppercase tracking-widest px-3 py-1">
            Software Engineering
          </Badge>
          <div className="flex flex-col items-end">
            <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-xs border border-emerald-100/50">
              88% Match
            </span>
          </div>
        </div>
        <CardTitle className="text-xl font-black text-slate-900 leading-tight mt-4 group-hover:text-blue-600 transition-colors">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-6 px-8">
        <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-6 leading-relaxed">
          {task.description || "Looking for a skilled frontend engineer proficient in React, TypeScript, and modern state management."}
        </p>
        <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-[11px] font-bold text-slate-400 border-t border-slate-50 pt-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500"><Target className="h-3.5 w-3.5" /></div>
            <span>3 Missing Skills</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500"><FileText className="h-3.5 w-3.5" /></div>
            <span>Needs Re-write</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-8 px-8">
        {linkTo ? (
          <Link href={linkTo} className="w-full">
            <Button className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/10 transition-all hover:shadow-blue-500/20 active:scale-[0.98]">
              {actionLabel} <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <Button 
            className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98]" 
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
