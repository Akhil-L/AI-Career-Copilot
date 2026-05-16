import { Layout } from "@/components/layout";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  ShieldCheck, 
  Target, 
  CheckCircle2, 
  Briefcase,
  Mail,
  Calendar,
  Code
} from "lucide-react";

export default function Profile() {
  const { currentUser } = useStore();

  if (!currentUser) {
    return <Layout><div className="py-20 text-center">Please login</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="relative">
          <div className="h-48 w-full bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2.5rem] shadow-2xl shadow-blue-500/20"></div>
          <div className="px-10 -mt-16 flex flex-col md:flex-row items-end gap-8 relative z-10">
            <div className="h-32 w-32 rounded-3xl bg-white p-2 shadow-xl">
              <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-4xl font-black text-slate-400 uppercase">
                {currentUser.name[0]}
              </div>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{currentUser.name}</h1>
                <Badge className="bg-blue-100 text-blue-700 border-none font-bold">Pro Plan</Badge>
              </div>
              <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-600" /> Software Engineer</span>
                <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" /> {currentUser.email}</span>
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-600" /> Joined May 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="rounded-[2rem] premium-shadow border-slate-200/60 bg-white md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-black text-slate-900">Career Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Strength</p>
                  <p className="text-2xl font-black text-slate-900">85%</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interviews Prepped</p>
                  <p className="text-2xl font-black text-slate-900">12</p>
                </div>
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] premium-shadow border-slate-200/60 bg-white md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-black text-slate-900">Verified Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {['React.js', 'TypeScript', 'Node.js', 'System Design', 'Docker'].map((skill) => (
                  <div key={skill} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                    <Code className="h-4 w-4 text-blue-500" />
                    <span className="font-bold text-slate-700 text-sm">{skill}</span>
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 ml-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
