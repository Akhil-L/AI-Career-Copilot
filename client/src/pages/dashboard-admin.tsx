import { Layout } from "@/components/layout";
import { useStore, Submission, Payout, MOCK_USERS } from "@/lib/mock-data";
import { getWorkerRank } from "./dashboard-worker";
import { CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Eye, 
  Check, 
  X, 
  TrendingUp, 
  DollarSign,
  CreditCard,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Award,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { currentUser, tasks, submissions, payouts, reviewSubmission, addTask, markAsPaid } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", payPerRow: "0.10", dataFields: "", maxRows: CONFIG.DEFAULT_MAX_ROWS.toString() });

  const [reviewSub, setReviewSub] = useState<Submission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 rounded-full bg-red-50 text-red-600 mb-6">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Unauthorized Access</h1>
          <p className="text-slate-500 mb-8 max-w-md text-center">You do not have the required administrative permissions to view this page.</p>
          <Button onClick={() => setLocation("/dashboard")} className="font-semibold">
            Return to My Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === "pending");
  const pendingPayouts = payouts.filter(p => p.status === "pending");
  
  const totalApprovedEarnings = payouts.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPendingPayout = payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const handleCreateTask = () => {
    addTask({
      title: newTask.title,
      description: newTask.description,
      payPerRow: parseFloat(newTask.payPerRow),
      maxRows: parseInt(newTask.maxRows),
      dataFields: newTask.dataFields.split(",").map(s => s.trim())
    });
    setIsCreateOpen(false);
    toast({ title: "Job Created", description: "New task is now live." });
  };

  const handleReview = (status: "approved" | "rejected") => {
    if (!reviewSub) return;
    reviewSubmission(reviewSub.id, status, status === 'rejected' ? rejectionReason : undefined);
    setReviewSub(null);
    setRejectionReason("");
    toast({ 
      title: status === 'approved' ? "Submission Approved" : "Submission Rejected",
      description: status === 'approved' ? "Worker earnings updated." : "Worker notified."
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">Platform Analytics</h1>
            <p className="text-slate-500">Comprehensive overview of platform activity and finances.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" /> New Job Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader><DialogTitle className="text-xl">Launch New Data Campaign</DialogTitle></DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2"><Label className="text-xs font-bold uppercase text-slate-500">Campaign Title</Label><Input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g., Q1 Customer Feedback Processing" /></div>
                <div className="grid gap-2"><Label className="text-xs font-bold uppercase text-slate-500">Instructions</Label><Textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Detailed steps for workers..." className="min-h-[100px]" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label className="text-xs font-bold uppercase text-slate-500">Pay per Row ($)</Label><Input type="number" step="0.01" value={newTask.payPerRow} onChange={e => setNewTask({...newTask, payPerRow: e.target.value})} /></div>
                  <div className="grid gap-2"><Label className="text-xs font-bold uppercase text-slate-500">Max Rows</Label><Input type="number" value={newTask.maxRows} onChange={e => setNewTask({...newTask, maxRows: e.target.value})} /></div>
                </div>
                <div className="grid gap-2"><Label className="text-xs font-bold uppercase text-slate-500">Required Columns (comma separated)</Label><Input placeholder="Email, Name, ID" value={newTask.dataFields} onChange={e => setNewTask({...newTask, dataFields: e.target.value})} /></div>
              </div>
              <DialogFooter><Button onClick={handleCreateTask} className="w-full">Publish Job</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard title="Total Approved" value={`$${totalApprovedEarnings.toFixed(2)}`} icon={DollarSign} color="blue" />
          <AnalyticsCard title="Pending Payouts" value={`$${totalPendingPayout.toFixed(2)}`} icon={CreditCard} color="orange" />
          <AnalyticsCard title="Paid to Workers" value={`$${totalPaid.toFixed(2)}`} icon={CheckCircle2} color="emerald" />
          <AnalyticsCard title="Active Workers" value="2,541" icon={Users} color="slate" />
        </div>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="bg-white border p-1 h-12 mb-6">
            <TabsTrigger value="client-tasks" className="data-[state=active]:bg-primary data-[state=active]:text-white px-8">
              New Project Requests ({tasks.filter(t => t.status === 'pending_review').length})
            </TabsTrigger>
            <TabsTrigger value="submissions" className="data-[state=active]:bg-primary data-[state=active]:text-white px-8">
              Work Reviews ({pendingSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="payouts" className="data-[state=active]:bg-primary data-[state=active]:text-white px-8">
              Payout Queue ({pendingPayouts.length})
            </TabsTrigger>
            <TabsTrigger value="workers" className="data-[state=active]:bg-primary data-[state=active]:text-white px-8">
              Worker Ranks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workers">
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Worker Performance Directory</CardTitle>
                <CardDescription>Monitor accuracy scores and reward high-performing specialists.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="pl-6">Worker Name</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead className="text-right pr-6">Reliability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_USERS.filter(u => u.role === 'worker').map(worker => {
                      const rank = getWorkerRank(worker);
                      return (
                        <TableRow key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="pl-6 font-medium">{worker.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`font-bold ${rank.color}`}>
                              {rank.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-bold ${worker.accuracyScore && worker.accuracyScore >= 95 ? 'text-emerald-600' : 'text-slate-900'}`}>
                              {worker.accuracyScore || 0}%
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-500">{worker.approvedSubmissions || 0} jobs</TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-1">
                              {worker.accuracyScore && worker.accuracyScore >= 98 && <ShieldCheck className="h-4 w-4 text-blue-500" title="High Reliability" />}
                              {worker.approvedSubmissions && worker.approvedSubmissions > 20 && <Award className="h-4 w-4 text-purple-500" title="Veteran Status" />}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client-tasks">
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Project Approval Queue</CardTitle>
                <CardDescription>Review and approve projects submitted by enterprise clients.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="pl-6">Client ID</TableHead>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.filter(t => t.status === 'pending_review').map(task => (
                      <TableRow key={task.id}>
                        <TableCell className="pl-6 font-medium">{task.clientId || "N/A"}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell className="font-bold">${task.payPerRow.toFixed(2)}</TableCell>
                        <TableCell className="text-slate-500 text-sm">{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right pr-6">
                          <Button size="sm" onClick={() => {
                            useStore.getState().approveTask(task.id);
                            toast({ title: "Project Approved", description: "This job is now available to workers." });
                          }}>Approve & Publish</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {tasks.filter(t => t.status === 'pending_review').length === 0 && <div className="p-12 text-center text-slate-400 italic">No new project requests.</div>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Recent Submissions</CardTitle>
                <CardDescription>Review worker submissions and approve for payment.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="pl-6">Worker ID</TableHead>
                      <TableHead>File Source</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingSubmissions.map(sub => (
                      <TableRow key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="pl-6 font-medium">{sub.workerId}</TableCell>
                        <TableCell className="font-mono text-xs">{sub.fileName}</TableCell>
                        <TableCell><Badge variant="outline">{sub.rowCount} rows</Badge></TableCell>
                        <TableCell className="text-slate-500 text-sm">{new Date(sub.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right pr-6">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8" onClick={() => setReviewSub(sub)}>
                                <Eye className="h-3.5 w-3.5 mr-1.5" /> Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader><DialogTitle>Worker Submission Detail</DialogTitle></DialogHeader>
                              <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 bg-slate-50 rounded-lg border">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Submission Volume</p>
                                    <p className="text-xl font-bold">{sub.rowCount} Data Rows</p>
                                  </div>
                                  <div className="p-4 bg-slate-50 rounded-lg border">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">File Name</p>
                                    <p className="text-xl font-bold truncate">{sub.fileName}</p>
                                  </div>
                                </div>
                                <div className="border rounded-lg overflow-hidden">
                                  <div className="bg-slate-100 px-4 py-2 border-b flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-600">Sample Preview (Top 10)</span>
                                    <Badge className="bg-white text-slate-900 border-slate-300">Verified Format</Badge>
                                  </div>
                                  <div className="max-h-40 overflow-auto">
                                    <Table>
                                      <TableBody>
                                        {sub.previewData.map((row, i) => (
                                          <TableRow key={i} className="hover:bg-transparent">
                                            {Object.values(row).map((val: any, j) => <TableCell key={j} className="py-2 text-[11px] font-mono">{val}</TableCell>)}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-bold">Feedback / Rejection Reason</Label>
                                  <Textarea 
                                    placeholder="Provide feedback if rejecting..." 
                                    className="bg-slate-50 focus:bg-white min-h-[80px]" 
                                    value={rejectionReason} 
                                    onChange={e => setRejectionReason(e.target.value)} 
                                  />
                                </div>
                              </div>
                              <DialogFooter className="gap-2 sm:justify-between border-t pt-4">
                                <Button variant="ghost" onClick={() => setReviewSub(null)}>Cancel</Button>
                                <div className="flex gap-2">
                                  <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={() => handleReview("rejected")}>
                                    <X className="h-4 w-4 mr-1.5" /> Reject Work
                                  </Button>
                                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => handleReview("approved")}>
                                    <Check className="h-4 w-4 mr-1.5" /> Approve & Payout
                                  </Button>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {pendingSubmissions.length === 0 && <div className="p-12 text-center text-slate-400 italic">No submissions awaiting review.</div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Payout Management</CardTitle>
                <CardDescription>Release approved earnings to worker accounts.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="pl-6">Worker</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Approved Date</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayouts.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="pl-6 font-medium">{p.workerId}</TableCell>
                        <TableCell className="font-bold text-slate-900">${p.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right pr-6">
                          <Button 
                            size="sm" 
                            className="bg-primary hover:bg-primary/90 shadow-sm"
                            onClick={() => {
                              markAsPaid(p.id);
                              toast({ title: "Paid", description: "Worker payout marked as paid." });
                            }}
                          >
                            <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Mark Paid
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingPayouts.length === 0 && <div className="p-12 text-center text-slate-400 italic">No payouts currently in queue.</div>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function AnalyticsCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    slate: "bg-slate-100 text-slate-600 border-slate-200"
  };

  return (
    <Card className="border-slate-200 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg border ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <TrendingUp className="h-4 w-4 text-slate-300" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
