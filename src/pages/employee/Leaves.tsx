import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, Edit, Trash2, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Leave {
  id: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency';
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  rejectionReason?: string;
  days: number;
}

const mockLeaves: Leave[] = [
  {
    id: "1",
    type: "vacation",
    fromDate: "2024-02-15",
    toDate: "2024-02-20",
    reason: "Family vacation to Europe",
    status: "approved",
    appliedDate: "2024-01-10",
    approvedBy: "Sarah Johnson (HR)",
    days: 5
  },
  {
    id: "2",
    type: "sick",
    fromDate: "2024-01-08",
    toDate: "2024-01-09",
    reason: "Flu symptoms and recovery",
    status: "approved", 
    appliedDate: "2024-01-07",
    approvedBy: "Sarah Johnson (HR)",
    days: 2
  },
  {
    id: "3",
    type: "personal",
    fromDate: "2024-02-28",
    toDate: "2024-02-28",
    reason: "Personal appointment",
    status: "pending",
    appliedDate: "2024-01-15",
    days: 1
  }
];

const LeaveCard = ({ leave, onEdit, onDelete }: {
  leave: Leave;
  onEdit: (leave: Leave) => void;
  onDelete: (id: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sick': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'vacation': return 'bg-primary/10 text-primary border-primary/20';
      case 'emergency': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Badge className={getTypeColor(leave.type)}>
                {leave.type.replace('-', ' ')}
              </Badge>
              <Badge className={getStatusColor(leave.status)}>
                {leave.status}
              </Badge>
            </div>
            <CardTitle className="text-lg">{leave.reason}</CardTitle>
          </div>
          {leave.status === 'pending' && (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(leave)}
                className="h-8 w-8 interactive"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(leave.id)}
                className="h-8 w-8 interactive text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span>{new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Days:</span>
            <span className="font-medium">{leave.days} day{leave.days > 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Applied:</span>
            <span>{new Date(leave.appliedDate).toLocaleDateString()}</span>
          </div>
          {leave.approvedBy && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Approved by:</span>
              <span>{leave.approvedBy}</span>
            </div>
          )}
          {leave.rejectionReason && (
            <div className="mt-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">Rejection Reason:</p>
              <p className="text-sm text-destructive/80">{leave.rejectionReason}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const LeaveDialog = ({ leave, open, onOpenChange, onSave }: {
  leave?: Leave;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (leave: Omit<Leave, 'id' | 'appliedDate' | 'status' | 'days'>) => void;
}) => {
  const [formData, setFormData] = useState({
    type: leave?.type || 'vacation' as Leave['type'],
    fromDate: leave?.fromDate || '',
    toDate: leave?.toDate || '',
    reason: leave?.reason || ''
  });

  const calculateDays = (from: string, to: string) => {
    if (!from || !to) return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const days = calculateDays(formData.fromDate, formData.toDate);
    onSave({ ...formData, days } as any);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{leave ? 'Edit Leave Request' : 'Apply for Leave'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Leave Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value as Leave['type'] })}
            >
              <SelectTrigger className="focus-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="maternity">Maternity/Paternity</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={formData.fromDate}
                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                className="focus-ring"
                required
              />
            </div>
            <div>
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={formData.toDate}
                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                className="focus-ring"
                required
                min={formData.fromDate}
              />
            </div>
          </div>
          {formData.fromDate && formData.toDate && (
            <div className="text-sm text-muted-foreground">
              Duration: {calculateDays(formData.fromDate, formData.toDate)} day(s)
            </div>
          )}
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="focus-ring"
              rows={3}
              placeholder="Please provide a reason for your leave request..."
              required
            />
          </div>
          <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Upload supporting documents (optional)</p>
            <Button type="button" variant="outline" size="sm" className="mt-2">
              Choose Files
            </Button>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient">
              {leave ? 'Update' : 'Submit'} Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function Leaves() {
  const [leaves, setLeaves] = useState<Leave[]>(mockLeaves);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | undefined>();
  const { toast } = useToast();

  const handleAddLeave = (leaveData: Omit<Leave, 'id' | 'appliedDate' | 'status'>) => {
    const newLeave: Leave = {
      ...leaveData,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString(),
      status: 'pending'
    };
    setLeaves([newLeave, ...leaves]);
    toast({
      title: "Leave application submitted",
      description: "Your leave request has been submitted for approval.",
    });
  };

  const handleEditLeave = (leaveData: Omit<Leave, 'id' | 'appliedDate' | 'status'>) => {
    if (!editingLeave) return;
    setLeaves(leaves.map(leave => 
      leave.id === editingLeave.id 
        ? { ...leave, ...leaveData }
        : leave
    ));
    setEditingLeave(undefined);
    toast({
      title: "Leave request updated",
      description: "Your leave request has been updated successfully.",
    });
  };

  const handleDeleteLeave = (id: string) => {
    setLeaves(leaves.filter(leave => leave.id !== id));
    toast({
      title: "Leave request cancelled",
      description: "Your leave request has been cancelled.",
    });
  };

  const openEditDialog = (leave: Leave) => {
    setEditingLeave(leave);
    setDialogOpen(true);
  };

  const leaveBalance = {
    total: 20,
    used: leaves.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.days, 0),
    pending: leaves.filter(l => l.status === 'pending').reduce((sum, l) => sum + l.days, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">
            {leaveBalance.total - leaveBalance.used} days remaining out of {leaveBalance.total}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingLeave(undefined);
        }}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="mr-2 h-4 w-4" />
              Apply Leave
            </Button>
          </DialogTrigger>
          <LeaveDialog
            leave={editingLeave}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSave={editingLeave ? handleEditLeave : handleAddLeave}
          />
        </Dialog>
      </div>

      {/* Leave Balance Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{leaveBalance.total - leaveBalance.used}</div>
              <p className="text-sm text-muted-foreground">Days Available</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{leaveBalance.used}</div>
              <p className="text-sm text-muted-foreground">Days Used</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{leaveBalance.pending}</div>
              <p className="text-sm text-muted-foreground">Days Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave History */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Leave History</h2>
        {leaves.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No leave requests yet</h3>
            <p className="text-muted-foreground mb-4">Apply for your first leave request</p>
            <Button onClick={() => setDialogOpen(true)} className="btn-gradient">
              <Plus className="mr-2 h-4 w-4" />
              Apply for Leave
            </Button>
          </Card>
        ) : (
          leaves.map((leave) => (
            <LeaveCard
              key={leave.id}
              leave={leave}
              onEdit={openEditDialog}
              onDelete={handleDeleteLeave}
            />
          ))
        )}
      </div>
    </div>
  );
}