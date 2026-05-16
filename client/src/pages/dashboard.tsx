import { Layout } from "@/components/layout";
import { useStore, Task, TRAINING_MODULES, User } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { FileText, Target, CheckCircle2, ArrowRight, ShieldAlert, GraduationCap, AlertTriangle, Star, Award, LineChart, Sparkles, UploadCloud, Briefcase } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function getStudentRank(user: User) {
  const score = user.accuracyScore || 0;
  const analyzed = user.approvedSubmissions || 0;
  
  if (analyzed > 10 && score >= 90) return { label: "Top Candidate", color: "bg-emerald-100 text-emerald-700 border-none" };
  if (analyzed > 3 && score >= 75) return { label: "Interview Ready", color: "bg-purple-100 text-purple-700 border-none" };
  return { label: "Improving", color: "bg-slate-100 text-slate-700 border-none" };
}

export default function Dashboard() {
  const { currentUser, tasks, assignTask } = useStore();
  const [, setLocation] = useLocation();
  
  if (!currentUser) return <div className="p-8 text-center">Please log in</div>;

  if (currentUser.role === 'admin') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-6"><ShieldAlert className="h-12 w-12" /></div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Admin View</h1>
          <Button onClick={() => setLocation("/admin")} className="font-bold mt-4">Go to Admin Portal</Button>
        </div>
      </Layout>
    );
  }

  const isPrepComplete = currentUser.completedModules.length === TRAINING_MODULES.length;
  const prepProgress = Math.round((currentUser.completedModules.length / TRAINING_MODULES.length) * 100);
  
  const targetRoles = tasks.filter(t => t.status === "open" || t.assignedTo === currentUser.id);
  const completedAnalyses = tasks.filter(t => t.assignedTo === currentUser.id && t.status === "approved");
  
  const atsScoreAvg = currentUser.accuracyScore || 72;
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
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
        {!isPrepComplete && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-[1.5rem] p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="p-3 bg-white rounded-xl text-purple-600 shadow-sm"><Sparkles className="h-6 w-6" /></div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">AI Interview Prep ({prepProgress}%)</h3>
              <p className="text-slate-600 text-sm">Complete your AI-guided interview prep modules to increase your chances of clearing technical rounds.</p>
            </div>
            <Link href="/interview-prep">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2 rounded-xl h-11 shadow-sm">
                Continue Prep
              </Button>
            </Link>
          </div>
        )}

        {/* Welcome */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-heading font-black text-slate-900">Overview</h1>
              <Badge className={`font-bold px-3 py-1 shadow-sm ${rank.color}`}>
                <Star className="h-3 w-3 mr-1.5 fill-current" /> {rank.label}
              </Badge>
            </div>
            <p className="text-slate-500">Welcome back, {currentUser.name}. Ready for your next application?</p>
          </div>
          <Link href="/resume-upload">
            <Button className="font-bold gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-6 shadow-md">
              <UploadCloud className="h-4 w-4" /> Analyze Resume
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-100 shadow-sm rounded-[1.5rem] bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-purple-50 text-purple-600 shrink-0"><Target className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Avg ATS Score</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-slate-900">{atsScoreAvg}%</h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-100 shadow-sm rounded-[1.5rem] bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 shrink-0"><FileText className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Resumes Analyzed</p>
                <h3 className="text-3xl font-black text-slate-900">{completedAnalyses.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm rounded-[1.5rem] bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0"><CheckCircle2 className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Interviews Prepped</p>
                <h3 className="text-3xl font-black text-slate-900">4</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-slate-100 shadow-sm rounded-[1.5rem] bg-white overflow-hidden">
              <CardHeader className="p-6 pb-2 border-b border-slate-50">
                <CardTitle className="text-lg font-bold text-slate-900">ATS Progression</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="roles" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Target Roles</h2>
                <TabsList className="bg-slate-100 p-1 rounded-xl">
                  <TabsTrigger value="roles" className="rounded-lg font-bold text-sm">Suggested</TabsTrigger>
                  <TabsTrigger value="analyzed" className="rounded-lg font-bold text-sm">Analyzed</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="roles" className="space-y-4">
                {targetRoles.map(task => (
                  <RoleCard key={task.id} task={task} actionLabel="Analyze Resume" onAction={() => isPrepComplete ? assignTask(task.id, currentUser.id) : setLocation("/interview-prep")} />
                ))}
              </TabsContent>
              <TabsContent value="analyzed" className="space-y-4">
                {completedAnalyses.map(task => (
                  <RoleCard key={task.id} task={task} actionLabel="View Report" linkTo={`/ats-analysis`} />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-100 shadow-sm rounded-[1.5rem] bg-white">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-bold text-slate-900">Copilot Advice</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Briefcase className="h-5 w-5" /></div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Keyword Missing</p>
                    <p className="text-sm text-slate-500 mt-1">Add "React Hooks" to match 80% of frontend roles.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><CheckCircle2 className="h-5 w-5" /></div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Formatting Solid</p>
                    <p className="text-sm text-slate-500 mt-1">Your layout parses perfectly in Workday ATS.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-white rounded-[1.5rem] border-none shadow-xl overflow-hidden relative">
              <div className="absolute -right-4 -top-4 opacity-10"><Sparkles className="h-32 w-32" /></div>
              <CardContent className="p-6 relative z-10">
                <Badge className="bg-white/10 hover:bg-white/10 text-white border-none font-bold mb-4">Pro Tip</Badge>
                <p className="text-sm font-medium leading-relaxed text-slate-300">
                  Companies prefer measurable results. Change "Worked on UI" to "Improved load time by 40%".
                </p>
                <Button variant="link" className="text-blue-400 p-0 h-auto mt-4 font-bold" onClick={() => setLocation("/resume-upload")}>Fix Resume <ArrowRight className="ml-1 h-3 w-3" /></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function RoleCard({ task, actionLabel, onAction, linkTo }: { task: Task, actionLabel: string, onAction?: () => void, linkTo?: string }) {
  return (
    <Card className="border-slate-100 shadow-sm rounded-xl bg-white hover:border-purple-200 transition-colors">
      <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-bold text-slate-900">{task.title}</h4>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px]">SDE-1</Badge>
          </div>
          <p className="text-sm text-slate-500 line-clamp-1">{task.description || "Looking for a skilled frontend engineer proficient in React."}</p>
        </div>
        {linkTo ? (
          <Link href={linkTo} className="shrink-0 w-full sm:w-auto">
            <Button variant="outline" className="w-full font-bold rounded-lg border-slate-200">{actionLabel}</Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="shrink-0 w-full sm:w-auto font-bold rounded-lg bg-purple-600 hover:bg-purple-700 text-white">{actionLabel}</Button>
        )}
      </CardContent>
    </Card>
  );
}
