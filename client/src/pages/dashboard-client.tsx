import { Layout } from "@/components/layout";
import { useStore, Task } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Briefcase,
  PieChart as PieIcon,
  Search,
  Users
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function ClientDashboard() {
  const { currentUser, tasks, clientSubmitTask } = useStore();
  const { toast } = useToast();
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", payPerRow: "0.10", dataFields: "", maxRows: "100" });

  if (!currentUser || currentUser.role !== "client") {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="text-slate-500">Only clients can access this portal.</p>
        </div>
      </Layout>
    );
  }

  const myTasks = tasks.filter(t => t.clientId === currentUser.id);
  const totalRowsRequested = myTasks.reduce((sum, t) => sum + (t.maxRows || 0), 0);
  const pendingProjects = myTasks.filter(t => t.status === 'pending_review').length;
  
  const PIE_DATA = [
    { name: 'Completed', value: myTasks.filter(t => t.status === 'approved').length || 1, color: '#10b981' },
    { name: 'In Progress', value: myTasks.filter(t => t.status === 'open' || t.status === 'assigned' || t.status === 'submitted').length || 0, color: '#3b82f6' },
    { name: 'Pending', value: pendingProjects || 0, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const handleCreateTask = () => {
    clientSubmitTask({
      title: newTask.title,
      description: newTask.description,
      payPerRow: parseFloat(newTask.payPerRow),
      maxRows: parseInt(newTask.maxRows),
      dataFields: newTask.dataFields.split(",").map(s => s.trim()),
      sourceDataUrl: "/data/client_source_data.csv" // Mock source file
    });
    setIsNewTaskOpen(false);
    toast({ title: "Task Submitted", description: "Your task is now pending admin review." });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">Client Portal</h1>
            <p className="text-slate-500">Manage your data entry projects and track progress.</p>
          </div>
          
          <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-500 font-bold shadow-lg shadow-blue-200 h-12 px-6">
                <Plus className="h-5 w-5" /> Submit New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader><DialogTitle>Submit Project for Review</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2"><Label>Project Title</Label><Input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g., Customer List Cleanup" /></div>
                <div className="grid gap-2"><Label>Requirements</Label><Textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Describe what needs to be done..." /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label>Budget per Row ($)</Label><Input type="number" step="0.01" value={newTask.payPerRow} onChange={e => setNewTask({...newTask, payPerRow: e.target.value})} /></div>
                  <div className="grid gap-2"><Label>Estimated Rows</Label><Input type="number" value={newTask.maxRows} onChange={e => setNewTask({...newTask, maxRows: e.target.value})} /></div>
                </div>
                <div className="grid gap-2"><Label>Required Columns (comma separated)</Label><Input placeholder="Name, Email, Status" value={newTask.dataFields} onChange={e => setNewTask({...newTask, dataFields: e.target.value})} /></div>
                <div className="grid gap-2">
                  <Label>Source File</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center text-sm text-slate-500">
                    <Briefcase className="h-6 w-6 mx-auto mb-2 opacity-30" />
                    Click to upload source data
                  </div>
                </div>
              </div>
              <DialogFooter><Button onClick={handleCreateTask} className="w-full h-12 font-bold">Submit for Admin Review</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Client Stats & Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 w-fit mb-4">
                <Briefcase className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Projects</p>
              <h3 className="text-2xl font-bold text-slate-900">{myTasks.length}</h3>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 w-fit mb-4">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Rows Processed</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalRowsRequested.toLocaleString()}</h3>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 w-fit mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending Review</p>
              <h3 className="text-2xl font-bold text-slate-900">{pendingProjects}</h3>
            </CardContent>
          </Card>
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 w-fit mb-4">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assigned Specialists</p>
              <h3 className="text-2xl font-bold text-slate-900">12</h3>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" /> Current Campaigns
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {myTasks.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900">No Projects Found</h3>
                  <p className="text-slate-500">Start by submitting your first data entry project.</p>
                </div>
              ) : (
                myTasks.map(task => (
                  <Card key={task.id} className="hover:shadow-lg transition-all border-slate-100">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={task.status === "pending_review" ? "outline" : "secondary"} className={task.status === "pending_review" ? "text-amber-600 border-amber-200 bg-amber-50" : "bg-emerald-50 text-emerald-700"}>
                          {task.status === "pending_review" ? "Review Pending" : task.status.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-1"><Clock className="h-4 w-4" /> {new Date(task.createdAt).toLocaleDateString()}</span>
                        <span className="font-bold text-blue-600">${task.payPerRow.toFixed(2)} / row</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Progress</span>
                        <span className="text-sm font-bold">{task.status === 'approved' ? '100%' : '0%'}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full text-xs h-9">Configure Rules</Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Project Allocation</CardTitle>
                <CardDescription>Status distribution of submitted data</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-600 text-white shadow-xl shadow-blue-200">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <PieIcon className="h-5 w-5" /> Enterprise Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Your projects are being handled by <span className="text-white font-bold">Verified</span> specialists, maintaining a <span className="text-white font-bold">99.4%</span> verification accuracy rate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
