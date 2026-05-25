import { Buffer } from "buffer";

const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      // Step 1: Upload and extract text from PDF
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
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