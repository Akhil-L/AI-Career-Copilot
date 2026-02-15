import { Layout } from "@/components/layout";
import { useStore, Task, TRAINING_MODULES, User } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { DollarSign, Clock, CheckCircle2, TrendingUp, ArrowRight, FileText, ShieldAlert, GraduationCap, AlertTriangle, Star, Award, BarChart3, Zap, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MOCK_CHART_DATA = [
  { name: 'Mon', earnings: 12 },
  { name: 'Tue', earnings: 18 },
  { name: 'Wed', earnings: 15 },
  { name: 'Thu', earnings: 25 },
  { name: 'Fri', earnings: 32 },
  { name: 'Sat', earnings: 28 },
  { name: 'Sun', earnings: 40 },
];

export function getWorkerRank(user: User) {
  const accuracy = user.accuracyScore || 0;
  const completed = user.approvedSubmissions || 0;
  
  if (completed > 50 && accuracy >= 98) return { label: "Top Performer", color: "bg-purple-100 text-purple-700 border-purple-200" };
  if (completed > 10 && accuracy >= 90) return { label: "Verified", color: "bg-blue-100 text-blue-700 border-blue-200" };
  return { label: "Beginner", color: "bg-slate-100 text-slate-700 border-slate-200" };
}

export default function WorkerDashboard() {
  const { currentUser, tasks, assignTask } = useStore();
  const [, setLocation] = useLocation();
  
  if (!currentUser) return <div className="p-8 text-center">Please log in</div>;

  if (currentUser.role !== 'worker') {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-6">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Wrong Dashboard</h1>
          <p className="text-slate-500 mb-8 max-w-md text-center">You are logged in as an administrator. Please use the admin portal to manage the platform.</p>
          <Button onClick={() => setLocation("/admin")} className="font-semibold">
            Go to Admin Portal
          </Button>
        </div>
      </Layout>
    );
  }

  const isFullyTrained = currentUser.completedModules.length === TRAINING_MODULES.length;
  const trainingProgress = Math.round((currentUser.completedModules.length / TRAINING_MODULES.length) * 100);
  const myTasks = tasks.filter(t => t.assignedTo === currentUser.id && t.status !== "approved" && t.status !== "rejected");
  const availableTasks = tasks.filter(t => t.status === "open" && t.sourceDataUrl); // Rule: Only show tasks with source data
  const completedTasks = tasks.filter(t => t.assignedTo === currentUser.id && t.status === "approved");
  const rank = getWorkerRank(currentUser);

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {!isFullyTrained && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900">Training in Progress ({trainingProgress}%)</h3>
              <p className="text-amber-700 text-sm">You must complete all training modules before you can accept and submit data entry tasks.</p>
            </div>
            <Link href="/training">
              <Button className="bg-amber-600 hover:bg-amber-500 font-bold gap-2">
                <GraduationCap className="h-4 w-4" /> Continue Training
              </Button>
            </Link>
          </div>
        )}

        {/* Welcome & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-heading font-bold text-slate-900">Dashboard</h1>
              <Badge variant="outline" className={`font-bold px-3 py-1 ${rank.color}`}>
                <Star className="h-3 w-3 mr-1.5 fill-current" /> {rank.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">Welcome back, {currentUser.name}. Here's your activity overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current Balance:</span>
            <div className="text-2xl font-bold font-mono text-primary">${currentUser.balance.toFixed(2)}</div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <h3 className="text-2xl font-bold text-slate-900">${currentUser.balance.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                <h3 className="text-2xl font-bold text-slate-900">{completedTasks.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accuracy Score</p>
                <h3 className="text-2xl font-bold text-slate-900">{currentUser.accuracyScore || 0}%</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-bold">Earnings Performance</CardTitle>
                  <CardDescription>Daily earnings trend for the last 7 days</CardDescription>
                </div>
                <BarChart3 className="h-5 w-5 text-slate-400" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_CHART_DATA}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Earnings']}
                      />
                      <Area type="monotone" dataKey="earnings" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Tabs */}
            <Tabs defaultValue="available" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="available">Available Jobs ({availableTasks.length})</TabsTrigger>
              <TabsTrigger value="my-tasks">My Tasks ({myTasks.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="available" className="space-y-4">
            {availableTasks.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-xl">
                <p className="text-muted-foreground">No available tasks at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    actionLabel="Accept Task"
                    onAction={() => isFullyTrained ? assignTask(task.id, currentUser.id) : setLocation("/training")}
                    variant="default"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-tasks" className="space-y-4">
            {myTasks.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-xl">
                <p className="text-muted-foreground">You don't have any active tasks. Go pick some up!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    actionLabel={task.status === "submitted" ? "Under Review" : "Continue Work"}
                    linkTo={`/task/${task.id}`}
                    variant="outline"
                    disabled={task.status === "submitted"}
                  />
                ))}
              </div>
            )}
          </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar / Activity Feed */}
          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Activity Feed</CardTitle>
                <CardDescription>Recent platform events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {[
                  { title: 'Earnings Released', desc: 'Payout of $45.00 completed', time: '2h ago', icon: DollarSign, color: 'text-emerald-500 bg-emerald-50' },
                  { title: 'Task Approved', desc: 'Inventory Log Update verified', time: '5h ago', icon: CheckCircle2, color: 'text-blue-500 bg-blue-50' },
                  { title: 'Rank Up!', desc: 'You are now a Verified worker', time: '1d ago', icon: Star, color: 'text-purple-500 bg-purple-50' },
                  { title: 'Academy Award', desc: 'Training Module 4 completed', time: '2d ago', icon: Award, color: 'text-amber-500 bg-amber-50' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-default">
                    <div className={`mt-1 h-8 w-8 rounded-lg ${item.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-tight">{item.desc}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-2 border-t mt-2">
                <Button variant="ghost" size="sm" className="w-full text-xs text-slate-500 font-bold hover:text-blue-600">
                  View Full History
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldAlert className="h-20 w-20" />
              </div>
              <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-sm font-bold text-blue-400 uppercase tracking-widest">Support Tip</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Maintain an accuracy score above <span className="text-white font-bold">95%</span> to qualify for premium high-pay enterprise tasks.
                </p>
              </CardContent>
              <CardFooter className="relative z-10">
                <Button variant="link" className="text-blue-400 p-0 h-auto font-bold text-xs hover:text-blue-300">
                  Read quality guidelines <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function TaskCard({ task, actionLabel, onAction, linkTo, variant, disabled }: { task: Task, actionLabel: string, onAction?: () => void, linkTo?: string, variant?: "default" | "outline", disabled?: boolean }) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full border-slate-200 bg-white">
      {children}
    </Card>
  );

  return (
    <CardWrapper>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 w-fit">
              Data Entry
            </Badge>
            {task.priority === 'high' && (
              <Badge className="bg-red-50 text-red-700 border-red-100 w-fit text-[10px] h-5">
                <Zap className="h-3 w-3 mr-1" /> Priority SLA
              </Badge>
            )}
          </div>
          <span className="font-mono font-bold text-green-600 bg-green-50 px-2 py-1 rounded text-sm">
            ${task.payPerRow.toFixed(2)}/row
          </span>
        </div>
        <CardTitle className="text-lg leading-tight mt-2">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {task.description}
        </p>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            <span>{task.slaHours || 24}h Turnaround</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>{task.revisionPolicy || "Standard"} SLA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <span>{task.dataFields.length} Fields</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
            <span>{task.maxRows} Max Rows</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {linkTo && !disabled ? (
          <Link href={linkTo} className="w-full">
            <Button className="w-full" variant={variant || "default"}>
              {actionLabel} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button 
            className="w-full" 
            variant={variant || "default"} 
            onClick={onAction}
            disabled={disabled}
          >
            {actionLabel}
          </Button>
        )}
      </CardFooter>
    </CardWrapper>
  );
}
