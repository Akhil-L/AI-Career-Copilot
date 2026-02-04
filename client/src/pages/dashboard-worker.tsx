import { Layout } from "@/components/layout";
import { useStore, Task } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { DollarSign, Clock, CheckCircle2, TrendingUp, ArrowRight, FileText } from "lucide-react";

export default function WorkerDashboard() {
  const { currentUser, tasks, assignTask } = useStore();
  
  if (!currentUser) return <div className="p-8 text-center">Please log in</div>;

  const myTasks = tasks.filter(t => t.assignedTo === currentUser.id && t.status !== "approved" && t.status !== "rejected");
  const availableTasks = tasks.filter(t => t.status === "open");
  const completedTasks = tasks.filter(t => t.assignedTo === currentUser.id && t.status === "approved");

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Welcome & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {currentUser.name}. Here's your activity overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current Balance:</span>
            <div className="text-2xl font-bold font-mono text-primary">${currentUser.balance.toFixed(2)}</div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                <h3 className="text-2xl font-bold text-slate-900">${currentUser.balance.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                <h3 className="text-2xl font-bold text-slate-900">{completedTasks.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accuracy Score</p>
                <h3 className="text-2xl font-bold text-slate-900">98%</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Tabs */}
        <Tabs defaultValue="available" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="available">Available Jobs ({availableTasks.length})</TabsTrigger>
              <TabsTrigger value="my-tasks">My Tasks ({myTasks.length})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="available" className="space-y-4">
            {availableTasks.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-xl">
                <p className="text-muted-foreground">No available tasks at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    actionLabel="Accept Task"
                    onAction={() => assignTask(task.id, currentUser.id)}
                    variant="default"
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-tasks" className="space-y-4">
            {myTasks.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-xl">
                <p className="text-muted-foreground">You don't have any active tasks. Go pick some up!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    actionLabel={task.status === "submitted" ? "Under Review" : "Continue Work"}
                    linkTo={`/task/${task.id}`}
                    variant="outline"
                    disabled={task.status === "submitted"}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function TaskCard({ task, actionLabel, onAction, linkTo, variant, disabled }: { task: Task, actionLabel: string, onAction?: () => void, linkTo?: string, variant?: "default" | "outline", disabled?: boolean }) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <Card className="hover:shadow-md transition-shadow flex flex-col h-full border-slate-200">
      {children}
    </Card>
  );

  return (
    <CardWrapper>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 mb-2">
            Data Entry
          </Badge>
          <span className="font-mono font-bold text-green-600 bg-green-50 px-2 py-1 rounded text-sm">
            ${task.payAmount.toFixed(2)}
          </span>
        </div>
        <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {task.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>10 min est.</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>{task.dataFields.length} fields</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {linkTo && !disabled ? (
          <Link href={linkTo} className="w-full">
            <Button className="w-full" variant={variant || "default"}>
              {actionLabel} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button 
            className="w-full" 
            variant={variant || "default"} 
            onClick={onAction}
            disabled={disabled}
          >
            {actionLabel}
          </Button>
        )}
      </CardFooter>
    </CardWrapper>
  );
}
