import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, CheckCircle2, Bot, ArrowRight, Sparkles } from "lucide-react";
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
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Analysis Complete", description: "Your resume has been scored." });
      setLocation("/ats-analysis");
    }, 2500);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center space-y-3 mb-8">
          <Badge />
          <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight text-slate-900">Score Your Resume</h1>
          <p className="text-slate-500 font-medium text-lg">
            Find out exactly what's holding you back from interviews.
          </p>
        </div>

        <Card className="border-slate-100 shadow-md rounded-[2rem] bg-white overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div 
              className={`border-2 border-dashed rounded-[1.5rem] p-12 text-center transition-all duration-300 cursor-pointer ${file ? 'border-purple-500 bg-purple-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
              onClick={() => !isProcessing && fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.docx" disabled={isProcessing} />
              
              {file ? (
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-purple-100 text-purple-600">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{file.name}</p>
                    <p className="text-sm font-medium text-purple-600">Ready for analysis</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-slate-100 text-slate-400">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Click or drag file here</p>
                    <p className="text-sm text-slate-500">PDF or DOCX (max 5MB)</p>
                  </div>
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-2">
                <Alert className="bg-purple-50 border-purple-100 rounded-xl">
                  <Bot className="h-5 w-5 text-purple-600 animate-pulse" />
                  <div className="ml-2">
                    <AlertTitle className="font-bold text-sm text-purple-900">AI is reviewing your resume...</AlertTitle>
                    <AlertDescription className="text-purple-700 text-xs mt-1">Checking keywords, formatting, and impact metrics.</AlertDescription>
                  </div>
                </Alert>
              </div>
            )}

            <Button 
              className="w-full mt-8 h-14 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white text-base shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50" 
              disabled={!file || isProcessing} 
              onClick={handleUpload}
            >
              {isProcessing ? "Processing..." : "Generate Free Report"}
              {!isProcessing && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function Badge() {
  return (
    <div className="inline-flex items-center justify-center p-2 bg-purple-50 text-purple-600 rounded-full mb-4">
       <Sparkles className="h-5 w-5" />
    </div>
  )
}
