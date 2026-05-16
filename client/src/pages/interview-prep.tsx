import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PlayCircle, CheckCircle2, ChevronRight, Bot } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MODULES = [
  {
    id: "m1",
    title: "React Fundamentals",
    description: "Core concepts frequently asked for frontend roles.",
    questions: [
      { q: "What is the primary difference between let and var?", options: ["let is block-scoped, var is function-scoped", "let can be redeclared", "var cannot be updated", "No difference"], answer: 0, explanation: "let variables are scoped to the immediate enclosing block." }
    ]
  }
];

export default function InterviewPrep() {
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState<any>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const start = (m: any) => { setActiveModule(m); setCurrentQ(0); setAnswers({}); setShowResults(false); };
  
  const submit = () => {
    setShowResults(true);
    toast({ title: "Session Complete", description: "Review your feedback." });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-heading font-black text-slate-900">Mock Interviews</h1>
          <p className="text-slate-500 mt-1">Practice with AI-generated technical questions.</p>
        </div>

        {activeModule ? (
          <Card className="border-slate-100 shadow-sm rounded-[1.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="bg-white font-bold">{activeModule.title}</Badge>
                <Button variant="ghost" size="sm" onClick={() => setActiveModule(null)}>Exit</Button>
              </div>
            </CardHeader>
            
            {!showResults ? (
              <div className="p-8">
                <h4 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">Question {currentQ + 1}</h4>
                <p className="text-xl font-bold text-slate-900 mb-8">{activeModule.questions[currentQ].q}</p>
                <RadioGroup onValueChange={(v) => setAnswers({...answers, [currentQ]: v})} value={answers[currentQ] || ""} className="gap-3">
                  {activeModule.questions[currentQ].options.map((opt: string, i: number) => (
                    <div key={i} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${answers[currentQ] === i.toString() ? 'border-purple-500 bg-purple-50/50' : 'border-slate-200 hover:border-purple-200'}`} onClick={() => setAnswers({...answers, [currentQ]: i.toString()})}>
                      <RadioGroupItem value={i.toString()} id={`o-${i}`} className="text-purple-600" />
                      <Label htmlFor={`o-${i}`} className="ml-3 font-medium cursor-pointer w-full">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="flex justify-end mt-8">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl" disabled={!answers[currentQ]} onClick={submit}>
                    Submit Answer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 space-y-6">
                <div className="text-center py-6">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-black">Feedback Ready</h2>
                </div>
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-bold text-sm text-purple-600 uppercase tracking-widest mb-2"><Bot className="h-4 w-4 inline mr-1" /> AI Explanation</p>
                  <p className="text-slate-700">{activeModule.questions[0].explanation}</p>
                </div>
                <Button className="w-full bg-slate-900 rounded-xl" onClick={() => setActiveModule(null)}>Back to Modules</Button>
              </div>
            )}
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {MODULES.map(m => (
              <Card key={m.id} className="border-slate-100 shadow-sm rounded-xl hover:border-purple-200 transition-colors">
                <CardHeader className="p-5">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-3"><PlayCircle className="h-5 w-5" /></div>
                  <CardTitle className="text-lg font-bold">{m.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-1">{m.description}</CardDescription>
                </CardHeader>
                <CardFooter className="p-5 pt-0">
                  <Button variant="outline" className="w-full font-bold rounded-lg border-slate-200" onClick={() => start(m)}>Start Practice</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
