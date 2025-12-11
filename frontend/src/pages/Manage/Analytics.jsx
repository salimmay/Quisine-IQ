import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from "recharts";
import { 
  TrendingUp, TrendingDown, Wallet, ShoppingBag, Plus 
} from "lucide-react"; // Replaced DollarSign with Wallet for generic money icon

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import QuisineLoader from "@/components/ui/QuisineLoader";

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#eab308", "#ec4899", "#64748b"];

export default function Analytics() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  
  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    title: "", amount: "", category: "Supplies", date: new Date().toISOString().split('T')[0]
  });

  const { data, isLoading } = useQuery({
    queryKey: ['stats', user?.userId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/stats/${user.userId}`);
      return data;
    },
    enabled: !!user?.userId
  });

  const { data: expenses } = useQuery({
    queryKey: ['expenses-list', user?.userId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/expenses/${user.userId}`);
      return data;
    },
    enabled: !!user?.userId
  });

  const addExpense = useMutation({
    mutationFn: async () => {
      return await api.post("/admin/expense", { ...expenseForm, userId: user.userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['stats']);
      queryClient.invalidateQueries(['expenses-list']);
      toast.success("Expense added");
      setIsExpenseOpen(false);
      setExpenseForm({ title: "", amount: "", category: "Supplies", date: new Date().toISOString().split('T')[0] });
    }
  });

        if (isLoading) return <QuisineLoader text="Crunching numbers..." />;
  const { summary = {}, chartData = [], expensesPie = [], topItems = [] } = data || {};

  // --- UPDATED CURRENCY FORMATTER FOR TUNISIA ---
  const formatTND = (val) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3 // Tunisian Dinar has 3 decimals (Millimes)
    }).format(val || 0);
  };

  return (
    <div className="space-y-8 pb-24">
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics</h1>
           <p className="text-slate-500">Track your restaurant's financial health.</p>
        </div>
        <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
            <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Expense
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Record an Expense</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Input placeholder="e.g. 5kg Tomatoes" value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Amount (TND)</Label>
                            <Input type="number" step="0.100" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={expenseForm.category} onValueChange={val => setExpenseForm({...expenseForm, category: val})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {["Supplies", "Rent", "Utilities", "Salaries", "Maintenance", "Other"].map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => addExpense.mutate()} disabled={addExpense.isPending}>
                        {addExpense.isPending ? "Saving..." : "Save Expense"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      {/* --- 1. Summary Cards (Using TND) --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Total Revenue" 
            value={formatTND(summary.revenue)} 
            icon={Wallet} 
            trend="up" 
        />
        <StatCard 
            title="Total Expenses" 
            value={formatTND(summary.expenses)} 
            icon={TrendingDown} 
            trend="down" 
            color="text-red-600" 
        />
        <StatCard 
            title="Net Profit" 
            value={formatTND(summary.profit)} 
            icon={TrendingUp} 
            trend={summary.profit >= 0 ? "up" : "down"} 
            color={summary.profit >= 0 ? "text-green-600" : "text-red-600"} 
        />
        <StatCard 
            title="Total Orders" 
            value={summary.orders || 0} 
            icon={ShoppingBag} 
        />
      </div>

      {/* --- 2. Charts Row --- */}
      <div className="grid gap-4 md:grid-cols-7">
        
        {/* Revenue Trend */}
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Daily Revenue (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[300px] w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="_id" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
                                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value} DT`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px", border: "none" }}
                                    itemStyle={{ color: "#fb923c" }}
                                    formatter={(value) => [formatTND(value), "Revenue"]}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                            No revenue data for this week
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        {/* Expenses Pie */}
        <Card className="col-span-3">
            <CardHeader><CardTitle>Expenses Breakdown</CardTitle></CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {expensesPie.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expensesPie}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value" nameKey="_id"
                                >
                                    {expensesPie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatTND(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                            No expenses recorded
                        </div>
                    )}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {expensesPie.map((entry, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs text-slate-500">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {entry._id}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>

      {/* --- 3. Lists Row --- */}
      <div className="grid gap-4 md:grid-cols-2">
          
          {/* Top Items */}
          <Card>
              <CardHeader><CardTitle>Top Selling Items</CardTitle></CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {topItems.length > 0 ? topItems.map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                                      {i + 1}
                                  </div>
                                  <div>
                                      <p className="font-medium text-slate-900">{item._id}</p>
                                      <p className="text-xs text-slate-500">{item.count} orders</p>
                                  </div>
                              </div>
                              <span className="font-bold text-slate-900">{formatTND(item.sales)}</span>
                          </div>
                      )) : (
                          <p className="text-sm text-slate-400">No sales yet.</p>
                      )}
                  </div>
              </CardContent>
          </Card>

          {/* Recent Expenses List */}
          <Card>
              <CardHeader><CardTitle>Recent Expenses</CardTitle></CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {expenses?.map((exp, i) => (
                          <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
                              <div>
                                  <p className="font-medium text-slate-900">{exp.title}</p>
                                  <p className="text-xs text-slate-500">{new Date(exp.date).toLocaleDateString()} • {exp.category}</p>
                              </div>
                              <span className="font-bold text-red-600">-{formatTND(exp.amount)}</span>
                          </div>
                      ))}
                      {(!expenses || expenses.length === 0) && <p className="text-sm text-slate-400">No expenses recorded.</p>}
                  </div>
              </CardContent>
          </Card>
      </div>

    </div>
  );
}

function StatCard({ title, value, icon: Icon, color = "text-slate-900" }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 text-slate-500`} />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
            </CardContent>
        </Card>
    )
}