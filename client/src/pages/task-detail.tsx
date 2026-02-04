import { useParams, useLocation } from "wouter";
import { useStore } from "@/lib/mock-data";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";

export default function TaskDetail() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { tasks, submitTask } = useStore();
  const { toast } = useToast();
  
  const task = tasks.find(t => t.id === id);
  
  const { register, handleSubmit } = useForm();

  if (!task) return <Layout><div>Task not found</div></Layout>;

  const onSubmit = (data: any) => {
    submitTask(task.id, data);
    toast({ title: "Task Submitted", description: "Your work has been sent for review." });
    setLocation("/dashboard");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Task Info & Source Material */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-blue-100 shadow-sm">
              <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex justify-between items-start">
                   <div>
                     <CardTitle className="text-xl mb-1">{task.title}</CardTitle>
                     <p className="text-sm text-muted-foreground">{task.description}</p>
                   </div>
                   <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold font-mono">
                     ${task.payAmount.toFixed(2)}
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                 {/* Mock Source Image Area */}
                 <div className="aspect-video bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center mb-4 relative overflow-hidden group">
                   <div className="text-slate-400 text-center">
                     <p className="font-medium">Source Document Preview</p>
                     <p className="text-sm">(Mock Placeholder)</p>
                   </div>
                   {/* Overlay to simulate zoom interaction */}
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors cursor-crosshair"></div>
                 </div>
                 
                 <div className="text-sm text-muted-foreground p-4 bg-yellow-50 rounded-md border border-yellow-100">
                   <strong>Instructions:</strong> Please transcribe the data exactly as it appears in the source document above. Ensure dates are in YYYY-MM-DD format.
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Entry Form */}
          <div className="md:col-span-1">
             <Card className="sticky top-24 border-blue-200 shadow-md">
               <CardHeader className="bg-blue-600 text-white rounded-t-lg pb-4">
                 <CardTitle className="text-lg flex items-center gap-2">
                   <Save className="h-4 w-4" /> Entry Form
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                   {task.dataFields.map((field) => (
                     <div key={field} className="space-y-1.5">
                       <Label htmlFor={field} className="text-xs font-bold uppercase text-muted-foreground">{field}</Label>
                       <Input 
                        id={field} 
                        {...register(field, { required: true })} 
                        placeholder={`Enter ${field}...`}
                        className="bg-slate-50 focus:bg-white transition-colors"
                      />
                     </div>
                   ))}
                   
                   <div className="pt-4">
                     <Button type="submit" className="w-full font-bold shadow-lg shadow-blue-500/20">
                       Submit Work
                     </Button>
                   </div>
                 </form>
               </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
