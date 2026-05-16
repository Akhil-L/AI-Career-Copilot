import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle2, Bot, ArrowRight, Zap, Target } from "lucide-react";
import { useState, useRef } from "react";
import { useLocation } from "wouter";

export default function ResumeUpload() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext || "")) {
      toast({ title: "Invalid format", description: "Please upload a PDF or DOCX file.", variant: "destructive" });
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Analysis Complete", description: "Your resume has been scored." });
      setLocation("/ats-analysis");
    }, 2500);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-50 text-blue-600 mb-2">
            <Upload className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Upload Your Resume</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Our AI will parse your resume, score it against industry standards, and identify missing keywords for top Indian tech companies.
          </p>
        </div>

        <Card className="premium-shadow border-slate-200/60 bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="p-10 pb-6 border-b border-slate-50 text-center">
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
              Select Document
            </CardTitle>
          </CardHeader>
          <CardContent className="px-10 py-12">
            <div 
              className={`border-4 border-dashed rounded-[2rem] p-16 text-center transition-all duration-300 cursor-pointer ${file ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/20'}`}
              onClick={() => !isProcessing && fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.doc" disabled={isProcessing} />
              
              {file ? (
                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="h-24 w-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-500/20">
                    <FileText className="h-12 w-12" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black text-slate-900 truncate px-4">{file.name}</p>
                    <p className="text-sm font-black text-blue-600 uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB • Ready for Analysis</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 opacity-80">
                  <div className="h-24 w-24 bg-slate-200 rounded-3xl flex items-center justify-center text-slate-500 mx-auto">
                    <FileText className="h-12 w-12" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-black text-slate-900 uppercase tracking-widest">Drop your PDF or DOCX</p>
                    <p className="text-sm font-medium text-slate-500">or click to browse from your computer</p>
                  </div>
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="mt-8 space-y-4">
                <Alert className="bg-blue-50 border-blue-100 rounded-2xl p-6 text-blue-800">
                  <Bot className="h-5 w-5 text-blue-600 animate-pulse" />
                  <div className="ml-4">
                    <AlertTitle className="font-black text-sm uppercase tracking-widest mb-1">AI Copilot Processing</AlertTitle>
                    <AlertDescription className="font-medium text-sm">Extracting text, analyzing semantics, and matching against industry datasets...</AlertDescription>
                  </div>
                </Alert>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="px-10 pb-10 pt-0">
            <Button 
              className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95" 
              disabled={!file || isProcessing} 
              onClick={handleUpload}
            >
              {isProcessing ? "Analyzing Resume..." : "Generate ATS Report"}
              {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Instant Feedback</h4>
            <p className="text-sm text-slate-500">Get an ATS score in seconds, not days.</p>
          </div>
          <div className="p-6">
            <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Role Targeting</h4>
            <p className="text-sm text-slate-500">Compare against specific job descriptions.</p>
          </div>
          <div className="p-6">
            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Actionable Fixes</h4>
            <p className="text-sm text-slate-500">Line-by-line recommendations for improvement.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
