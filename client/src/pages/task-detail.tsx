import { useParams, useLocation } from "wouter";
import { useStore } from "@/lib/mock-data";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Link } from "wouter";
import { useState, useRef } from "react";

export default function TaskDetail() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { tasks, submissions, submitTask, currentUser } = useStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  
  const task = tasks.find(t => t.id === id);
  const submission = submissions.find(s => s.taskId === id && s.workerId === currentUser?.id);

  if (!currentUser) return <Layout><div className="p-8 text-center">Please log in to view task details.</div></Layout>;

  if (!task) return <Layout><div>Task not found</div></Layout>;

  // Security: Workers can only view tasks assigned to them (or open tasks)
  const isAssignedToMe = task.assignedTo === currentUser.id;
  const isOpenTask = task.status === 'open';

  if (currentUser.role !== 'admin' && !isAssignedToMe && !isOpenTask) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 rounded-full bg-red-50 text-red-600 mb-6">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Access Restricted</h1>
          <p className="text-slate-500 mb-8 max-w-md text-center">You are not authorized to view the details of this specific task as it is not assigned to you.</p>
          <Button onClick={() => setLocation("/dashboard")} className="font-semibold">
            Back to My Tasks
          </Button>
        </div>
      </Layout>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv' && ext !== 'xlsx') {
      toast({ 
        title: "Invalid file type", 
        description: "Only CSV and XLSX files are allowed.", 
        variant: "destructive" 
      });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({ 
        title: "File too large", 
        description: "Maximum file size is 5MB.", 
        variant: "destructive" 
      });
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;

    // Simulate parsing data
    const mockData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      row: `Data row ${i + 1}`
    }));

    submitTask(task.id, file.name, mockData);
    toast({ 
      title: "Task Submitted", 
      description: `Successfully uploaded ${file.name} with ${mockData.length} rows.` 
    });
    setLocation("/dashboard");
  };

  const canSubmit = (task.status === 'assigned' || task.status === 'rejected') && isAssignedToMe;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button onClick={() => setLocation(currentUser.role === 'admin' ? "/admin" : "/dashboard")} variant="ghost" className="pl-0 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{task.title}</CardTitle>
                    <p className="text-muted-foreground mt-1">{task.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">${task.payPerRow.toFixed(2)} / row</div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">Status: {task.status}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-700">
                    <FileText className="h-4 w-4" /> Required Columns
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {task.dataFields.map(f => (
                      <span key={f} className="bg-white border px-2 py-1 rounded text-sm font-mono text-slate-600">{f}</span>
                    ))}
                  </div>
                </div>

                {task.status === 'rejected' && submission?.rejectionReason && (
                  <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-bold">Rejection Reason</AlertTitle>
                    <AlertDescription>{submission.rejectionReason}</AlertDescription>
                  </Alert>
                )}

                {task.status === 'submitted' && (
                  <Alert className="bg-blue-50 border-blue-100 text-blue-800">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-bold">Under Review</AlertTitle>
                    <AlertDescription>Your submission is being reviewed by the admin team. You will be notified once it is processed.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className={`${!canSubmit ? "opacity-60 grayscale" : "border-primary shadow-lg"} bg-white`}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-4 w-4" /> File Submission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${file ? 'border-primary bg-primary/5' : 'border-slate-200'} ${canSubmit ? 'hover:border-primary/50' : ''}`}
                  onClick={() => canSubmit && fileInputRef.current?.click()}
                  style={{ cursor: canSubmit ? 'pointer' : 'not-allowed' }}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept=".csv,.xlsx"
                    disabled={!canSubmit}
                  />
                  {file ? (
                    <div className="space-y-2">
                      <FileText className="h-8 w-8 mx-auto text-primary" />
                      <p className="text-sm font-medium truncate px-2">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-slate-300" />
                      <p className="text-sm font-medium">Click to upload file</p>
                      <p className="text-xs text-muted-foreground">CSV or XLSX (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full font-bold shadow-lg shadow-primary/20" 
                  disabled={!file || !canSubmit}
                  onClick={handleUpload}
                >
                  Submit for Approval
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
