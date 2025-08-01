import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MessageSquare, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'hr' | 'equipment' | 'workplace' | 'other';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-review' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  response?: string;
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Laptop running very slow",
    description: "My work laptop has been extremely slow lately, especially when opening applications. It's affecting my productivity.",
    category: "technical",
    urgency: "medium",
    status: "resolved",
    createdAt: "2024-01-05",
    resolvedAt: "2024-01-08",
    response: "IT team replaced RAM and cleared cache. Issue resolved."
  },
  {
    id: "2", 
    title: "Office air conditioning not working",
    description: "The AC in the office has been broken for two days. The temperature is making it difficult to work.",
    category: "workplace",
    urgency: "high",
    status: "in-review",
    createdAt: "2024-01-12"
  },
  {
    id: "3",
    title: "Questions about health insurance",
    description: "I need clarification on my health insurance coverage and how to add a dependent.",
    category: "hr",
    urgency: "low",
    status: "pending",
    createdAt: "2024-01-15"
  }
];

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'border-destructive/20 bg-destructive/5';
      case 'high': return 'border-warning/20 bg-warning/5';
      case 'medium': return 'border-primary/20 bg-primary/5';
      default: return 'border-muted/20 bg-muted/5';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'status-completed';
      case 'in-review': return 'status-in-progress';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'in-review': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`card-hover transition-all duration-200 ${getUrgencyColor(ticket.urgency)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant="outline" className={`${ticket.urgency === 'critical' ? 'border-destructive text-destructive' : ticket.urgency === 'high' ? 'border-warning text-warning' : ticket.urgency === 'medium' ? 'border-primary text-primary' : ''}`}>
                {ticket.urgency}
              </Badge>
              <Badge variant="outline">
                {ticket.category}
              </Badge>
            </div>
            <CardTitle className="text-lg font-semibold">{ticket.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {getStatusIcon(ticket.status)}
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Created:</span>
            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>
          {ticket.resolvedAt && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Resolved:</span>
              <span>{new Date(ticket.resolvedAt).toLocaleDateString()}</span>
            </div>
          )}
          {ticket.response && (
            <div className="mt-3 p-3 bg-success/5 border border-success/20 rounded-lg">
              <p className="text-sm text-success font-medium">Response:</p>
              <p className="text-sm text-success/80">{ticket.response}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TicketDialog = ({ open, onOpenChange, onSave }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => void;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical' as Ticket['category'],
    urgency: 'medium' as Ticket['urgency']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
    setFormData({
      title: '',
      description: '',
      category: 'technical',
      urgency: 'medium'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="focus-ring"
              placeholder="Brief description of the issue"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="focus-ring"
              rows={4}
              placeholder="Please provide detailed information about the issue..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value as Ticket['category'] })}
              >
                <SelectTrigger className="focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="workplace">Workplace</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select 
                value={formData.urgency} 
                onValueChange={(value) => setFormData({ ...formData, urgency: value as Ticket['urgency'] })}
              >
                <SelectTrigger className="focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient">
              Create Ticket
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setTickets([newTicket, ...tickets]);
    toast({
      title: "Ticket created",
      description: "Your support ticket has been submitted successfully.",
    });
  };

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'pending').length,
    inReview: tickets.filter(t => t.status === 'in-review').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">
            {stats.pending + stats.inReview} active tickets, {stats.resolved} resolved
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <TicketDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSave={handleAddTicket}
          />
        </Dialog>
      </div>

      {/* Ticket Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.inReview}</div>
                <p className="text-sm text-muted-foreground">In Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.resolved}</div>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
            <p className="text-muted-foreground mb-4">Create your first support ticket</p>
            <Button onClick={() => setDialogOpen(true)} className="btn-gradient">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Ticket
            </Button>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        )}
      </div>
    </div>
  );
}