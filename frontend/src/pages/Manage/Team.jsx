import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { toast } from "sonner";
import { Users, UserPlus, Shield, Trash2, KeyRound } from "lucide-react";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import QuisineLoader from "@/components/ui/QuisineLoader";

export default function Team() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", pin: "", role: "Waiter" });

  // 1. Fetch Staff
  const { data: staffList = [], isLoading } = useQuery({
    // Default to []
    queryKey: ["staff", user?.userId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/staff/${user.userId}`);
      // Safety check: ensure we actually return an array
      return Array.isArray(data) ? data : [];
    },
  });

  // 2. Add Staff Mutation
  const addStaff = useMutation({
    mutationFn: async () => {
      if (form.pin.length !== 4) throw new Error("PIN must be 4 digits");
      return await api.post("/admin/staff", { ...form, userId: user.userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      toast.success("Staff member added");
      setIsAddOpen(false);
      setForm({ name: "", pin: "", role: "Waiter" });
    },
    onError: (err) => toast.error(err.response?.data?.msg || err.message),
  });

  // 3. Delete Staff Mutation
  const deleteStaff = useMutation({
    mutationFn: async (staffId) => {
      return await api.delete(`/admin/staff/${user.userId}/${staffId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      toast.success("Staff member removed");
    },
  });

  if (isLoading) return <QuisineLoader text="Loading Team..." />;

  const getRoleBadge = (role) => {
    switch (role) {
      case "Manager":
        return <Badge className="bg-purple-600">Manager</Badge>;
      case "Kitchen":
        return <Badge className="bg-orange-600">Kitchen</Badge>;
      default:
        return <Badge variant="outline">Waiter</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Team Management
          </h1>
          <p className="text-slate-500">
            Create login pins for your staff members.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-800">
              <UserPlus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(val) => setForm({ ...form, role: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Waiter">Waiter (Orders Only)</SelectItem>
                    <SelectItem value="Kitchen">
                      Kitchen (Display Only)
                    </SelectItem>
                    <SelectItem value="Manager">
                      Manager (Full Access)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Login PIN (4 Digits)</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    maxLength={4}
                    className="pl-9 font-mono tracking-widest"
                    placeholder="0000"
                    value={form.pin}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pin: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => addStaff.mutate()}
                disabled={addStaff.isPending}
              >
                {addStaff.isPending ? "Adding..." : "Create Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Active Staff ({staffList?.length || 0}
            )
          </CardTitle>
          <CardDescription>
            Staff members can log in using their Name and PIN on the login page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>PIN</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(staffList) &&
                staffList.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{getRoleBadge(member.role)}</TableCell>
                    <TableCell className="font-mono text-slate-500">
                      ••••
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteStaff.mutate(member._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              {staffList?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-slate-500"
                  >
                    No staff members yet. You are the only admin.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
