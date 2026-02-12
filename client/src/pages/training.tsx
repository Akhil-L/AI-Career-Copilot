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
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function TrainingPage() {
  const { currentUser, completeModule } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

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
    setQuizAnswer(null);
  };

  const handleFinishReading = () => {
    setShowQuiz(true);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null || !activeModule) return;
    
    const answerIndex = parseInt(quizAnswer);
    if (answerIndex === activeModule.quiz.correctAnswer) {
      completeModule(activeModule.id);
      toast({
        title: "Module Completed!",
        description: "You've passed the quiz. Keep going!",
        className: "bg-emerald-600 text-white border-emerald-700"
      });
      setActiveModule(null);
      setShowQuiz(false);
    } else {
      toast({
        title: "Incorrect Answer",
        description: "Review the lesson content and try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              Worker Training Academy
            </h1>
            <p className="text-slate-500">Complete all modules to unlock task assignments and start earning.</p>
          </div>
          <Card className="bg-slate-50 border-slate-200 w-full md:w-64">
            <CardContent className="p-4">
              <div className="flex justify-between text-xs font-bold uppercase text-slate-500 mb-2">
                <span>Your Progress</span>
                <span>{completedCount}/{TRAINING_MODULES.length} Modules</span>
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
              <h3 className="text-xl font-bold text-emerald-900">Training Fully Completed!</h3>
              <p className="text-emerald-700">You are now a certified DataEntry Pro worker. Go to your dashboard to browse available tasks.</p>
            </div>
            <Button onClick={() => setLocation("/dashboard")} className="bg-emerald-600 hover:bg-emerald-500 font-bold px-8 h-12">
              Start Working Now
            </Button>
          </div>
        )}

        {activeModule ? (
          <div className="grid md:grid-cols-3 gap-8 items-start animate-in slide-in-from-bottom-4">
            <Card className="md:col-span-2 border-primary/20 shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="text-primary border-primary/20">Active Lesson</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setActiveModule(null)}>Cancel Lesson</Button>
                </div>
                <CardTitle className="text-2xl font-heading">{activeModule.title}</CardTitle>
              </CardHeader>
              <CardContent className="py-8 prose prose-slate max-w-none">
                <div className="text-lg leading-relaxed text-slate-700 space-y-4">
                  {activeModule.content.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t p-6 flex justify-end">
                {!showQuiz ? (
                  <Button onClick={handleFinishReading} className="gap-2 h-12 px-8 font-bold">
                    I've Read the Lesson <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="w-full space-y-6">
                    <div className="p-6 bg-white border-2 border-primary/10 rounded-xl space-y-6">
                      <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Final Quiz: Check Your Understanding
                      </h4>
                      <div className="space-y-4">
                        <p className="font-semibold text-slate-700">{activeModule.quiz.question}</p>
                        <RadioGroup onValueChange={setQuizAnswer} value={quizAnswer || ""}>
                          {activeModule.quiz.options.map((option, i) => (
                            <div key={i} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                              <RadioGroupItem value={i.toString()} id={`opt-${i}`} />
                              <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer font-medium">{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowQuiz(false)}>Go Back to Lesson</Button>
                      <Button onClick={handleQuizSubmit} className="h-12 px-12 font-bold bg-primary hover:bg-primary/90" disabled={quizAnswer === null}>
                        Submit Answer
                      </Button>
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 px-1 uppercase text-xs tracking-widest">Academy Curriculum</h3>
              {TRAINING_MODULES.map((m) => (
                <Card key={m.id} className={`p-4 ${m.id === activeModule.id ? 'border-primary ring-1 ring-primary' : 'opacity-60 grayscale'}`}>
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <CheckCircle2 className={`h-4 w-4 ${m.id === activeModule.id ? 'text-primary' : 'text-slate-300'}`} />
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
              
              return (
                <Card 
                  key={module.id} 
                  className={`flex flex-col h-full transition-all duration-300 ${isLocked ? 'opacity-70 bg-slate-50' : 'hover:shadow-lg hover:-translate-y-1'}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-100 text-emerald-600' : isLocked ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : isLocked ? <Lock className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                      </div>
                      {isCompleted && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Completed</Badge>}
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {isLocked && (
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mt-2">
                        <Lock className="h-3 w-3" /> Complete "{TRAINING_MODULES[index-1].title}" to unlock
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    {isCompleted ? (
                      <Button variant="outline" className="w-full h-11 border-emerald-200 text-emerald-600 hover:bg-emerald-50" onClick={() => handleStartModule(module)}>
                        Review Lesson
                      </Button>
                    ) : isLocked ? (
                      <Button disabled className="w-full h-11 bg-slate-200 text-slate-500">
                        Locked
                      </Button>
                    ) : (
                      <Button className="w-full h-11 shadow-md" onClick={() => handleStartModule(module)}>
                        Start Lesson
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
