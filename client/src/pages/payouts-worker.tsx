import { Layout } from "@/components/layout";
import { useStore, Payout } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function PayoutsPage() {
  const { currentUser, payouts } = useStore();
  
  if (!currentUser) return <Layout><div>Please log in</div></Layout>;

  const workerPayouts = payouts.filter(p => p.workerId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const totalEarned = workerPayouts.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = workerPayouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = workerPayouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900">Earnings & Payouts</h1>
          <p className="text-muted-foreground">Track your income and payment history.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Lifetime Earnings</p>
                  <h3 className="text-2xl font-bold">${totalEarned.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending Payouts</p>
                  <h3 className="text-2xl font-bold">${pendingAmount.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Successfully Paid</p>
                  <h3 className="text-2xl font-bold">${paidAmount.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Payment History</CardTitle>
            <CardDescription>All your approved task earnings and their current payout status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Paid Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workerPayouts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs text-slate-500 uppercase">{p.id}</TableCell>
                    <TableCell className="font-bold text-slate-900">${p.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-slate-600">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'paid' ? "secondary" : "outline"} className={p.status === 'paid' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-orange-50 text-orange-700 border-orange-100"}>
                        {p.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                ))}
                {workerPayouts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic">No payment history available yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
