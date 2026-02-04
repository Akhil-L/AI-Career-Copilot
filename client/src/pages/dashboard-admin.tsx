import { Layout } from "@/components/layout";
import { useStore } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, FileCheck, AlertCircle, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { currentUser, tasks, submissions, reviewSubmission, addTask } = useStore();
  const { toast } = useToast();
  
  const pendingSubmissions = submissions.filter(s => s.status === "pending");
  const completedTasks = tasks.filter(t => t.status === "approved").length;
  const totalPayout = tasks.filter(t => t.status === "approved").reduce((sum, t) => sum + t.payAmount, 0);

  // Simple state for new task form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", payAmount: "1.00", dataFields: "" });

  const handleCreateTask = () => {
    addTask({
      title: newTask.title,
      description: newTask.description,
      payAmount: parseFloat(newTask.payAmount),
      dataFields: newTask.dataFields.split(",").map(s => s.trim())
    });
    setIsDialogOpen(false);
    toast({ title: "Job Created", description: "New task is now available for workers." });
  };

  if (!currentUser || currentUser.role !== "admin") return <div className="p-8 text-center">Access Denied</div>;

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">Admin Portal</h1>
            <p className="text-muted-foreground">Manage jobs, review work, and payouts.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-blue-500/20">
                <Plus className="h-4 w-4" /> Create New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Data Entry Job</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Invoice Transcription" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Instructions for the worker..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pay">Pay Amount ($)</Label>
                    <Input id="pay" type="number" step="0.01" value={newTask.payAmount} onChange={e => setNewTask({...newTask, payAmount: e.target.value})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fields">Data Fields (comma separated)</Label>
                  <Input id="fields" value={newTask.dataFields} onChange={e => setNewTask({...newTask, dataFields: e.target.value})} placeholder="Date, Amount, Invoice ID" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTask}>Publish Job</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
              <FileCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPayout.toFixed(2)}</div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Reviews Table */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Submission Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingSubmissions.length === 0 ? (
               <div className="text-center py-8 text-muted-foreground">No pending submissions to review.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Data Preview</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSubmissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-mono text-xs">{sub.taskId}</TableCell>
                      <TableCell>{sub.workerId}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {JSON.stringify(sub.content)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => {
                            reviewSubmission(sub.id, "rejected");
                            toast({ title: "Rejected", description: "Submission marked as rejected." });
                          }}
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-500"
                          onClick={() => {
                            reviewSubmission(sub.id, "approved");
                            toast({ title: "Approved", description: "Worker has been paid." });
                          }}
                        >
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
