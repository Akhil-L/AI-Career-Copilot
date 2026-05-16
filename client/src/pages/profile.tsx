import { Layout } from "@/components/layout";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Link as LinkIcon, Github, Linkedin, ShieldCheck } from "lucide-react";
import { getStudentRank } from "./dashboard";

export default function Profile() {
  const { currentUser } = useStore();
  if (!currentUser) return <div>Please log in</div>;

  const dynamicUser = { ...currentUser, accuracyScore: currentUser.accuracyScore || 72 };
  const rank = getStudentRank(dynamicUser);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-heading font-black text-slate-900">Profile Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account and connected profiles.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 bg-white border-slate-100 rounded-[1.5rem] shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="h-24 w-24 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <span className="text-3xl font-black">{currentUser.name[0]}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900">{currentUser.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{currentUser.email}</p>
              <Badge className={`font-bold px-3 py-1 shadow-sm w-full justify-center ${rank.color}`}>
                <ShieldCheck className="h-4 w-4 mr-1.5" /> {rank.label}
              </Badge>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-white border-slate-100 rounded-[1.5rem] shadow-sm">
            <CardHeader className="border-b border-slate-50 p-6 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input defaultValue={currentUser.name} className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-purple-500 font-medium" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input defaultValue={currentUser.email} disabled className="pl-10 h-11 rounded-xl bg-slate-50/50 border-slate-200 text-slate-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-widest">Connected Links</h4>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Linkedin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input placeholder="LinkedIn URL" className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-purple-500" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Github className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input placeholder="GitHub URL" className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-purple-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-8 h-11">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
