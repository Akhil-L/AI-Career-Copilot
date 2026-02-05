import { Layout } from "@/components/layout";
import { useStore, Submission } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, FileCheck, AlertCircle, Plus, Eye, Check, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { currentUser, tasks, submissions, reviewSubmission, addTask } = useStore();
  const { toast } = useToast();
  
  const pendingSubmissions = submissions.filter(s => s.status === "pending");
  const totalPayout = tasks.filter(t => t.status === "approved").reduce((sum, t) => {
    const sub = submissions.find(s => s.taskId === t.id && s.status === 'approved');
    return sum + (sub ? sub.rowCount * t.payPerRow : 0);
  }, 0);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", payPerRow: "0.10", dataFields: "" });

  const [reviewSub, setReviewSub] = useState<Submission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleCreateTask = () => {
    addTask({
      title: newTask.title,
      description: newTask.description,
      payPerRow: parseFloat(newTask.payPerRow),
      dataFields: newTask.dataFields.split(",").map(s => s.trim())
    });
    setIsCreateOpen(false);
    toast({ title: "Job Created", description: "New task is now available." });
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

  if (!currentUser || currentUser.role !== "admin") return <div className="p-8 text-center">Access Denied</div>;

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold">Admin Portal</h1>
            <p className="text-muted-foreground">Manage platform operations.</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Create New Job</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Data Entry Job</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2"><Label>Title</Label><Input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} /></div>
                <div className="grid gap-2"><Label>Description</Label><Textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} /></div>
                <div className="grid gap-2"><Label>Pay per row ($)</Label><Input type="number" step="0.01" value={newTask.payPerRow} onChange={e => setNewTask({...newTask, payPerRow: e.target.value})} /></div>
                <div className="grid gap-2"><Label>Required Columns (csv)</Label><Input placeholder="Name, Email, Phone" value={newTask.dataFields} onChange={e => setNewTask({...newTask, dataFields: e.target.value})} /></div>
              </div>
              <DialogFooter><Button onClick={handleCreateTask}>Publish</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pending Reviews</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{pendingSubmissions.length}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Paid Out</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totalPayout.toFixed(2)}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Platform Workers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">2,541</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Submissions to Review</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Worker</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSubmissions.map(sub => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.workerId}</TableCell>
                    <TableCell className="font-medium">{sub.fileName}</TableCell>
                    <TableCell>{sub.rowCount}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(sub.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setReviewSub(sub)}><Eye className="h-4 w-4 mr-2" /> Review</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader><DialogTitle>Review Submission: {sub.fileName}</DialogTitle></DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Data Preview ({sub.rowCount} rows total)</p>
                              <div className="max-h-48 overflow-auto border rounded bg-white">
                                <Table>
                                  <TableBody>
                                    {sub.previewData.map((row, i) => (
                                      <TableRow key={i}>
                                        {Object.values(row).map((val: any, j) => <TableCell key={j} className="py-2 text-xs">{val}</TableCell>)}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label>Rejection Reason (only if rejecting)</Label>
                              <Textarea placeholder="Explain why the work was rejected..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
                            </div>
                          </div>
                          <DialogFooter className="gap-2">
                            <Button variant="destructive" onClick={() => handleReview("rejected")}><X className="h-4 w-4 mr-2" /> Reject</Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-500" onClick={() => handleReview("approved")}><Check className="h-4 w-4 mr-2" /> Approve & Pay</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
                {pendingSubmissions.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No submissions pending review.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
