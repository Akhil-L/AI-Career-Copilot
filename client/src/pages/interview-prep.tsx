import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  GraduationCap,
  HelpCircle,
  ShieldCheck,
  Bot
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock Interview Modules
const MODULES = [
  {
    id: "m1",
    title: "React & JS Fundamentals",
    description: "Core concepts frequently asked by TCS and Infosys for frontend roles.",
    questions: [
      {
        q: "What is the primary difference between let and var in JavaScript?",
        options: ["let is block-scoped, var is function-scoped", "let can be redeclared", "var cannot be updated", "There is no difference"],
        answer: 0,
        explanation: "let variables are scoped to the immediate enclosing block, while var variables are scoped to the immediate function body."
      },
      {
        q: "Why do we need the key prop in React lists?",
        options: ["To style elements", "To help React identify which items have changed", "To pass data to children", "To handle click events"],
        answer: 1,
        explanation: "Keys help React identify which items have changed, are added, or are removed, optimizing rendering performance."
      }
    ]
  },
  {
    id: "m2",
    title: "System Design Basics",
    description: "Introductory scalable architecture concepts for SDE-1.",
    questions: [
      {
        q: "What is the main purpose of a Load Balancer?",
        options: ["To store data securely", "To distribute network traffic across multiple servers", "To write frontend code", "To compile CSS"],
        answer: 1,
        explanation: "Load balancers distribute incoming network traffic across a group of backend servers, increasing capacity and reliability."
      }
    ]
  }
];

export default function InterviewPrep() {
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState<any>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  const handleStart = (module: any) => {
    setActiveModule(module);
    setCurrentQ(0);
    setAnswers({});
    setShowResults(false);
  };

  const submitQuiz = () => {
    setShowResults(true);
    setCompleted([...completed, activeModule.id]);
    toast({ title: "Module Completed", description: "Great job! Check your feedback." });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-3">
            <Badge className="bg-purple-600 text-white font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1 mb-2">AI Copilot Coach</Badge>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-4">
              <Bot className="h-10 w-10 text-purple-600" />
              Mock Interviews
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl">Practice with AI-generated questions tailored to your target companies and skill gaps.</p>
          </div>
        </div>

        {activeModule ? (
          <Card className="border-slate-200/60 premium-shadow rounded-[2.5rem] overflow-hidden bg-white min-h-[500px] flex flex-col">
            <CardHeader className="p-10 border-b border-slate-50">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">{activeModule.title}</Badge>
                <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900" onClick={() => setActiveModule(null)}>Exit Session</Button>
              </div>
            </CardHeader>
            
            {!showResults ? (
              <>
                <CardContent className="p-10 flex-1 space-y-8">
                  <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                    <h4 className="text-xl font-black text-slate-900">Question {currentQ + 1} of {activeModule.questions.length}</h4>
                  </div>
                  
                  <div className="space-y-8">
                    <p className="text-2xl font-bold text-slate-800">{activeModule.questions[currentQ].q}</p>
                    <RadioGroup 
                      onValueChange={(val) => setAnswers({...answers, [currentQ]: val})} 
                      value={answers[currentQ] || ""}
                      className="grid gap-4"
                    >
                      {activeModule.questions[currentQ].options.map((opt: string, i: number) => (
                        <div key={i} className={`flex items-center space-x-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${answers[currentQ] === i.toString() ? 'border-purple-600 bg-purple-50/30' : 'border-slate-100 hover:border-purple-200'}`} onClick={() => setAnswers({...answers, [currentQ]: i.toString()})}>
                          <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="text-purple-600" />
                          <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer font-bold text-slate-900">{opt}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter className="p-10 border-t border-slate-50 flex justify-between bg-slate-50/50">
                  <Button variant="ghost" disabled={currentQ === 0} onClick={() => setCurrentQ(prev => prev - 1)}>Previous</Button>
                  {currentQ < activeModule.questions.length - 1 ? (
                    <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-8" disabled={!answers[currentQ]} onClick={() => setCurrentQ(prev => prev + 1)}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-8" disabled={Object.keys(answers).length < activeModule.questions.length} onClick={submitQuiz}>
                      Submit Interview
                    </Button>
                  )}
                </CardFooter>
              </>
            ) : (
              <CardContent className="p-10 space-y-8">
                <div className="text-center py-8">
                  <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-600 mb-4">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">Session Complete</h2>
                  <p className="text-slate-500 mt-2">Here is the AI feedback on your responses.</p>
                </div>
                
                <div className="space-y-6">
                  {activeModule.questions.map((q: any, i: number) => {
                    const isCorrect = parseInt(answers[i]) === q.answer;
                    return (
                      <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50">
                        <div className="flex gap-3 mb-2">
                          {isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Lock className="h-5 w-5 text-red-500" />}
                          <p className="font-bold text-slate-900">{q.q}</p>
                        </div>
                        <p className="text-sm text-slate-600 ml-8 mb-3">Your answer: <span className="font-semibold">{q.options[parseInt(answers[i])]}</span></p>
                        <div className="ml-8 p-4 bg-white rounded-xl text-sm border border-slate-100">
                          <span className="font-bold text-purple-600 uppercase tracking-widest text-[10px]">AI Explanation: </span>
                          <span className="text-slate-700">{q.explanation}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button className="w-full h-12 bg-slate-900 rounded-xl" onClick={() => setActiveModule(null)}>Return to Modules</Button>
              </CardContent>
            )}
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {MODULES.map((mod) => {
              const isDone = completed.includes(mod.id);
              return (
                <Card key={mod.id} className="hover:shadow-xl transition-all border-slate-200/60 rounded-[2rem]">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-4 rounded-2xl ${isDone ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                        {isDone ? <ShieldCheck className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                      </div>
                      {isDone && <Badge className="bg-emerald-100 text-emerald-700 border-none">Completed</Badge>}
                    </div>
                    <CardTitle className="text-xl font-black text-slate-900">{mod.title}</CardTitle>
                    <CardDescription className="font-medium text-slate-500 mt-2">{mod.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      className={`w-full h-12 rounded-xl font-bold ${isDone ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20'}`} 
                      onClick={() => handleStart(mod)}
                    >
                      {isDone ? "Review Again" : "Start Mock Interview"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
