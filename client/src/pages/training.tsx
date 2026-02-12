import { Layout } from "@/components/layout";
import { useStore, TRAINING_MODULES, TrainingModule } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  GraduationCap,
  Trophy,
  AlertCircle,
  XCircle,
  HelpCircle,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function TrainingPage() {
  const { currentUser, completeModule, registerAttempt } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<{ score: number; passed: boolean } | null>(null);

  if (!currentUser || currentUser.role !== "worker") {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold">Access Restricted</h1>
          <p className="text-slate-500">Only workers can access the training portal.</p>
        </div>
      </Layout>
    );
  }

  const completedCount = currentUser.completedModules.length;
  const progressPercent = (completedCount / TRAINING_MODULES.length) * 100;
  const isFullyTrained = completedCount === TRAINING_MODULES.length;

  const handleStartModule = (module: TrainingModule) => {
    setActiveModule(module);
    setShowQuiz(false);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizResults(null);
  };

  const handleQuizSubmit = () => {
    if (!activeModule) return;
    
    let correctCount = 0;
    activeModule.quiz.forEach((q, idx) => {
      if (parseInt(userAnswers[idx]) === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = correctCount / activeModule.quiz.length;
    const passed = score >= activeModule.passingScore;

    registerAttempt(activeModule.id);
    setQuizResults({ score, passed });

    if (passed) {
      completeModule(activeModule.id);
      toast({
        title: "Module Passed!",
        description: `Score: ${Math.round(score * 100)}%. Module completed.`,
        className: "bg-emerald-600 text-white border-emerald-700"
      });
    } else {
      toast({
        title: "Module Failed",
        description: `Score: ${Math.round(score * 100)}%. Required: ${Math.round(activeModule.passingScore * 100)}%.`,
        variant: "destructive"
      });
    }
  };

  const currentAttempts = currentUser.moduleAttempts[activeModule?.id || ""] || 0;
  const isOutOfAttempts = activeModule && currentAttempts >= activeModule.maxAttempts && !currentUser.completedModules.includes(activeModule.id);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary" />
              Advanced Academy
            </h1>
            <p className="text-slate-500">Master data auditing and ethical handling to unlock work.</p>
          </div>
          <Card className="bg-slate-50 border-slate-200 w-full md:w-64 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                <span>Certification Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {isFullyTrained && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 animate-in zoom-in-95">
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
              <Trophy className="h-10 w-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-emerald-900">Certified Auditor!</h3>
              <p className="text-emerald-700">You've completed the advanced curriculum. Your high accuracy score is now recognized.</p>
            </div>
            <Button onClick={() => setLocation("/dashboard")} className="bg-emerald-600 hover:bg-emerald-500 font-bold px-8 h-12 shadow-lg shadow-emerald-200">
              Unlock Tasks
            </Button>
          </div>
        )}

        {activeModule ? (
          <div className="grid md:grid-cols-3 gap-8 items-start animate-in slide-in-from-bottom-4">
            <Card className="md:col-span-2 border-primary/20 shadow-xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="text-primary border-primary/20">Module {TRAINING_MODULES.indexOf(activeModule) + 1}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setActiveModule(null)}>Exit Module</Button>
                </div>
                <CardTitle className="text-2xl font-heading">{activeModule.title}</CardTitle>
                <div className="flex gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> Passing Score: {Math.round(activeModule.passingScore * 100)}%</span>
                  <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Attempts Used: {currentAttempts}/{activeModule.maxAttempts}</span>
                </div>
              </CardHeader>
              
              {!showQuiz ? (
                <>
                  <CardContent className="py-8 prose prose-slate max-w-none">
                    <div className="text-lg leading-relaxed text-slate-700 space-y-4">
                      {activeModule.content.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 border-t p-6 flex justify-end">
                    {isOutOfAttempts ? (
                      <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 p-4 rounded-lg w-full">
                        <XCircle className="h-5 w-5" /> Maximum attempts reached. Contact support to reset.
                      </div>
                    ) : (
                      <Button onClick={() => setShowQuiz(true)} className="gap-2 h-12 px-8 font-bold shadow-lg shadow-primary/20">
                        Start Practical Quiz <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </>
              ) : quizResults ? (
                <CardContent className="py-12 text-center space-y-6">
                  <div className={`mx-auto p-6 rounded-full w-24 h-24 flex items-center justify-center ${quizResults.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {quizResults.passed ? <CheckCircle2 className="h-12 w-12" /> : <XCircle className="h-12 w-12" />}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold">{quizResults.passed ? "Success!" : "Not Quite..."}</h2>
                    <p className="text-slate-500 text-lg">Your score: {Math.round(quizResults.score * 100)}%</p>
                  </div>
                  
                  <div className="max-w-md mx-auto space-y-4 text-left border rounded-xl p-4 bg-slate-50">
                    <h4 className="font-bold text-sm uppercase text-slate-400">Review Feedback</h4>
                    {activeModule.quiz.map((q, i) => (
                      <div key={i} className="text-sm border-b pb-2 last:border-0">
                        <p className="font-medium flex items-center gap-2">
                          {parseInt(userAnswers[i]) === q.correctAnswer ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
                          {q.question}
                        </p>
                        <p className="text-slate-500 mt-1 italic">{q.explanation}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => handleStartModule(activeModule)}>
                      {quizResults.passed ? "Review Lesson" : "Retry Lesson"}
                    </Button>
                    {quizResults.passed && (
                      <Button onClick={() => setActiveModule(null)}>Back to Modules</Button>
                    )}
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardContent className="py-8 space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>Question {currentQuestionIndex + 1} of {activeModule.quiz.length}</span>
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">{activeModule.quiz[currentQuestionIndex].question}</h4>
                      <RadioGroup 
                        onValueChange={(val) => setUserAnswers({...userAnswers, [currentQuestionIndex]: val})} 
                        value={userAnswers[currentQuestionIndex] || ""}
                        className="space-y-3"
                      >
                        {activeModule.quiz[currentQuestionIndex].options.map((option, i) => (
                          <div key={i} className={`flex items-center space-x-3 p-4 border rounded-xl hover:bg-slate-50 transition-all ${userAnswers[currentQuestionIndex] === i.toString() ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-white'}`}>
                            <RadioGroupItem value={i.toString()} id={`opt-${i}`} />
                            <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer font-medium text-lg">{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 border-t p-6 flex justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)} 
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </Button>
                    {currentQuestionIndex < activeModule.quiz.length - 1 ? (
                      <Button 
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        disabled={!userAnswers[currentQuestionIndex]}
                      >
                        Next Question
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleQuizSubmit} 
                        className="bg-primary hover:bg-primary/90 font-bold px-8 h-12"
                        disabled={Object.keys(userAnswers).length < activeModule.quiz.length}
                      >
                        Finish & Submit
                      </Button>
                    )}
                  </CardFooter>
                </>
              )}
            </Card>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 px-1 uppercase text-xs tracking-widest">Curriculum Details</h3>
              {TRAINING_MODULES.map((m, idx) => (
                <Card key={m.id} className={`p-4 ${m.id === activeModule.id ? 'border-primary ring-1 ring-primary' : 'opacity-60 grayscale bg-slate-50'}`}>
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {currentUser.completedModules.includes(m.id) ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold">{m.title}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRAINING_MODULES.map((module, index) => {
              const isCompleted = currentUser.completedModules.includes(module.id);
              const isLocked = index > 0 && !currentUser.completedModules.includes(TRAINING_MODULES[index - 1].id);
              const attempts = currentUser.moduleAttempts[module.id] || 0;
              
              return (
                <Card 
                  key={module.id} 
                  className={`flex flex-col h-full transition-all duration-300 border-slate-200 bg-white ${isLocked ? 'opacity-70 bg-slate-50 shadow-none' : 'hover:shadow-xl hover:border-primary/20'}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2.5 rounded-xl ${isCompleted ? 'bg-emerald-50 text-emerald-600' : isLocked ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                        {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : isLocked ? <Lock className="h-6 w-6" /> : <GraduationCap className="h-6 w-6" />}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {isCompleted && <Badge className="bg-emerald-500 text-white border-0">Passed</Badge>}
                        {!isCompleted && !isLocked && attempts > 0 && <Badge variant="outline" className="text-[10px]">{attempts}/{module.maxAttempts} Tries</Badge>}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-heading">{module.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {isLocked ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                        <Lock className="h-3 w-3" /> Finish previous module
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 font-medium">
                        {module.quiz.length} Practical Questions • {Math.round(module.passingScore * 100)}% to pass
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    {isCompleted ? (
                      <Button variant="outline" className="w-full h-11 border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold" onClick={() => handleStartModule(module)}>
                        Review Content
                      </Button>
                    ) : isLocked ? (
                      <Button disabled className="w-full h-11 bg-slate-100 text-slate-400 border-0">
                        Locked
                      </Button>
                    ) : (
                      <Button className="w-full h-11 bg-primary hover:bg-primary/90 font-bold shadow-md" onClick={() => handleStartModule(module)}>
                        {attempts > 0 ? "Retry Certification" : "Begin Certification"}
                      </Button>
                    )}
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
