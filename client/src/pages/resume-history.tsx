import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, CheckCircle2, Clock, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResumeHistory() {
  const mockHistory = [
    { id: 'RS-1029', name: 'SDE_Resume_Final.pdf', date: '2026-05-15', score: 85, status: 'Analyzed' },
    { id: 'RS-1028', name: 'Software_Engineer_Resume.pdf', date: '2026-05-10', score: 72, status: 'Analyzed' },
    { id: 'RS-1025', name: 'Draft_Resume_v2.docx', date: '2026-04-28', score: 65, status: 'Analyzed' },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Resume History</h1>
            <p className="text-slate-500 font-medium text-lg">Track your progress and access previous reports.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-500 font-bold px-6 shadow-lg shadow-blue-500/20">
            <UploadCloud className="h-4 w-4 mr-2" /> Upload New Version
          </Button>
        </div>

        <Card className="border-slate-200/60 shadow-sm premium-shadow bg-white rounded-3xl overflow-hidden">
          <CardHeader className="p-10 border-b border-slate-50">
            <CardTitle className="text-2xl font-black text-slate-900">Analysis Ledger</CardTitle>
            <CardDescription className="text-slate-500 font-medium mt-1">Audit log of all uploaded resumes and their ATS scores.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                  <TableHead className="px-10 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400">Document</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Date Uploaded</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">ATS Score</TableHead>
                  <TableHead className="text-right px-10 font-black text-[10px] uppercase tracking-widest text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50 last:border-0">
                    <TableCell className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="font-bold text-slate-900">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> {item.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${item.score >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'} border-none font-bold px-3 py-1`}>
                        {item.score}% Match
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-10">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Eye className="h-4 w-4 mr-2" /> View Report
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-slate-700">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

// Just for the top button icon
import { UploadCloud } from "lucide-react";
