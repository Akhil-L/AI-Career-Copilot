import { useParams, useLocation } from "wouter";
import { useStore } from "@/lib/mock-data";
import { CONFIG } from "@/lib/config";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle2, ShieldAlert, ListChecks, Download } from "lucide-react";
import { useState, useRef } from "react";

export default function TaskDetail() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { tasks, submissions, submitTask, currentUser } = useStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const task = tasks.find(t => t.id === id);
  const submission = submissions.find(s => s.taskId === id && s.workerId === currentUser?.id);

  if (!currentUser) return <Layout><div className="p-8 text-center">Please log in to view task details.</div></Layout>;
  
  // Rule: If task doesn't exist or has no source data, it's not visible/accessible
  if (!task || !task.sourceDataUrl) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">Task Unavailable</h1>
          <p className="text-slate-500">This task is currently inactive or missing source data.</p>
          <Button onClick={() => setLocation("/dashboard")} variant="link">Return to Dashboard</Button>
        </div>
      </Layout>
    );
  }

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

  const validateAndParseFile = async (file: File): Promise<{ success: boolean; data?: any[]; error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const rows = content.split('\n').filter(row => row.trim());
          
          if (rows.length < 2) {
            resolve({ success: false, error: "File appears to be empty or missing headers." });
            return;
          }

          const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const dataRows = rows.slice(1);

          // Required Column Check
          const missingColumns = task.dataFields.filter(f => !headers.includes(f));
          if (missingColumns.length > 0) {
            resolve({ 
              success: false, 
              error: `Missing required columns: ${missingColumns.join(', ')}. Please check the template instructions.` 
            });
            return;
          }

          // Row Count Check (Min 1 row of data)
          if (dataRows.length === 0) {
            resolve({ success: false, error: "Submission must contain at least one row of data." });
            return;
          }

          if (dataRows.length > task.maxRows) {
            resolve({ 
              success: false, 
              error: `This task allows a maximum of ${task.maxRows} rows. Your file has ${dataRows.length} rows.` 
            });
            return;
          }

          const parsedData = dataRows.map(row => {
            const values = row.split(',').map(v => v.trim().replace(/"/g, ''));
            const obj: any = {};
            headers.forEach((h, i) => obj[h] = values[i]);
            return obj;
          });

          // Custom Validation: Warehouse Check
          if (task.validWarehouseNames && task.validWarehouseNames.length > 0) {
            const invalidRows = parsedData.filter(row => !task.validWarehouseNames?.includes(row["Warehouse"]));
            if (invalidRows.length > 0) {
              resolve({ 
                success: false, 
                error: `Invalid Warehouse detected. Allowed: ${task.validWarehouseNames.join(", ")}` 
              });
              return;
            }
          }

          resolve({ success: true, data: parsedData });
        } catch (err) {
          resolve({ success: false, error: "Failed to parse file. Ensure it's a valid CSV format." });
        }
      };
      reader.onerror = () => resolve({ success: false, error: "File reading error." });
      reader.readAsText(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!CONFIG.ALLOWED_EXTENSIONS.includes(ext || "")) {
      toast({ title: "Invalid file type", description: `Allowed types: ${CONFIG.ALLOWED_EXTENSIONS.join(", ").toUpperCase()}`, variant: "destructive" });
      return;
    }

    if (selectedFile.size > CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast({ title: "File too large", description: `Maximum file size is ${CONFIG.MAX_FILE_SIZE_MB}MB.`, variant: "destructive" });
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);

    const validation = await validateAndParseFile(file);
    
    if (!validation.success) {
      toast({ 
        title: "Validation Failed", 
        description: validation.error, 
        variant: "destructive" 
      });
      setIsProcessing(false);
      return;
    }

    submitTask(task.id, file.name, validation.data!);
    toast({ 
      title: "Task Submitted", 
      description: `Successfully uploaded ${file.name} with ${validation.data!.length} rows.` 
    });
    setIsProcessing(false);
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
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-bold text-blue-900">Source Data Available</p>
                      <p className="text-xs text-blue-700">Download the required file to start processing.</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="bg-white border-blue-200 text-blue-600 hover:bg-blue-100">
                    Download Source
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="bg-slate-50 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-slate-700">
                      <ListChecks className="h-4 w-4" /> Task Limits
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Max Rows: <strong>{task.maxRows}</strong></li>
                      <li>• Max Size: <strong>{CONFIG.MAX_FILE_SIZE_MB}MB</strong></li>
                      <li>• Accepted: <strong>{CONFIG.ALLOWED_EXTENSIONS.join(", ").toUpperCase()}</strong></li>
                    </ul>
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
                    <AlertDescription>Your submission is being reviewed. Duplicate uploads are disabled while review is pending.</AlertDescription>
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
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".csv,.xlsx" disabled={!canSubmit || isProcessing} />
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
                <Button className="w-full font-bold shadow-lg shadow-primary/20" disabled={!file || !canSubmit || isProcessing} onClick={handleUpload}>
                  {isProcessing ? "Validating..." : "Submit for Approval"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
