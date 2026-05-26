import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileText, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
    } else {
      toast({ variant: "destructive", title: "Invalid file", description: "Please upload a PDF file." });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
    } else {
      toast({ variant: "destructive", title: "Invalid file", description: "Please upload a PDF file." });
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      // Step 1: Upload and extract text from PDF
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const uploadResponse = await fetch("/api/resume/upload", {
        method: "POST",
        headers: { "Content-Type": "application/pdf" },
        credentials: "include",
        body: buffer,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload resume");
      }

      const { text } = await uploadResponse.json();

      // Step 2: Analyze the extracted text
      const analyzeResponse = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ resumeText: text }),
      });

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze resume");
      }

      const result = await analyzeResponse.json();

      // Store result in localStorage for ATS analysis page
      localStorage.setItem("atsResult", JSON.stringify(result));

      toast({ title: "Analysis Complete", description: `Your ATS score is ${result.score}%` });
      setLocation("/ats-analysis");

    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to process resume. Try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-heading font-black text-slate-900 mb-1">Upload Resume</h1>
          <p className="text-slate-500">Get instant ATS scoring and identify missing skills for your dream role.</p>
        </div>

        <Card className="border-slate-100 shadow-sm rounded-[1.5rem] bg-white">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg font-bold text-slate-900">Upload your PDF</CardTitle>
            <CardDescription>Only PDF files are supported. Max size 10MB.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors ${
                dragOver ? "border-purple-400 bg-purple-50" : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
              }`}
              onClick={() => document.getElementById("resume-file-input")?.click()}
            >
              <div className={`p-4 rounded-2xl ${dragOver ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-500"}`}>
                <UploadCloud className="h-8 w-8" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-700">Drag & drop your resume here</p>
                <p className="text-sm text-slate-400 mt-1">or click to browse files</p>
              </div>
              <input
                id="resume-file-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Selected File */}
            {file && (
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!file || isProcessing}
              className="w-full h-12 font-bold text-base rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🎯", title: "ATS Score", desc: "Instant compatibility score with top ATS systems" },
            { icon: "🔍", title: "Skill Gap", desc: "See exactly what keywords are missing" },
            { icon: "💡", title: "AI Tips", desc: "Get personalized suggestions to improve your resume" },
          ].map((item) => (
            <Card key={item.title} className="border-slate-100 shadow-sm rounded-2xl bg-white">
              <CardContent className="p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
