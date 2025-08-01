import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ClipboardList, 
  Calendar, 
  MessageSquare, 
  Clock, 
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";

// Mock data - would come from API in real app
const getCurrentUser = () => ({
  name: "John Smith",
  role: "employee" // employee, hr, admin
});

const mockData = {
  employee: {
    tasks: { total: 12, completed: 8, pending: 4 },
    leaves: { available: 15, used: 5, pending: 1 },
    tickets: { total: 3, resolved: 2, pending: 1 },
    attendance: { checkedIn: true, hours: "7h 30m", target: "8h" }
  },
  hr: {
    employees: { total: 45, active: 42, onLeave: 3 },
    leaves: { pending: 8, approved: 12, rejected: 2 },
    tickets: { pending: 15, inReview: 5, resolved: 28 },
    performance: { avgScore: 4.2, topPerformers: 8 }
  },
  admin: {
    employees: { total: 150, active: 145, newHires: 5 },
    departments: { total: 8, performance: 85 },
    tickets: { critical: 3, pending: 22, resolved: 156 },
    revenue: { current: 2.5, target: 3.0, growth: 15 }
  }
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, className = "" }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: number;
  className?: string;
}) => (
  <Card className={`card-hover ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && (
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      )}
      {trend && (
        <div className="flex items-center mt-2">
          <TrendingUp className="h-3 w-3 text-success mr-1" />
          <span className="text-xs text-success">+{trend}% from last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const EmployeeDashboard = () => {
  const data = mockData.employee;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, John!</h1>
          <p className="text-muted-foreground">Here's what's happening with your work today.</p>
        </div>
        <Button className="btn-gradient">
          <Clock className="mr-2 h-4 w-4" />
          Check Out
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tasks Progress"
          value={`${data.tasks.completed}/${data.tasks.total}`}
          subtitle={`${data.tasks.pending} pending`}
          icon={ClipboardList}
          trend={12}
        />
        <StatCard
          title="Leave Balance"
          value={`${data.leaves.available - data.leaves.used}`}
          subtitle={`${data.leaves.used} days used`}
          icon={Calendar}
        />
        <StatCard
          title="Open Tickets"
          value={data.tickets.pending}
          subtitle={`${data.tickets.resolved} resolved`}
          icon={MessageSquare}
        />
        <StatCard
          title="Today's Hours"
          value={data.attendance.hours}
          subtitle={`Target: ${data.attendance.target}`}
          icon={Clock}
        />
      </div>

      {/* Recent Activities */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "Complete quarterly report", status: "in-progress", due: "Today" },
              { title: "Review team presentations", status: "pending", due: "Tomorrow" },
              { title: "Update project documentation", status: "completed", due: "Yesterday" }
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">Due: {task.due}</p>
                </div>
                <Badge className={`status-${task.status}`}>
                  {task.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Holidays
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Christmas Day", date: "Dec 25, 2024" },
              { name: "New Year's Day", date: "Jan 1, 2025" },
              { name: "Martin Luther King Jr. Day", date: "Jan 20, 2025" }
            ].map((holiday, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-accent-light/50 rounded-lg">
                <div>
                  <p className="font-medium">{holiday.name}</p>
                  <p className="text-sm text-muted-foreground">{holiday.date}</p>
                </div>
                <Calendar className="h-4 w-4 text-accent" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const HRDashboard = () => {
  const data = mockData.hr;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <p className="text-muted-foreground">Manage your team and organizational tasks.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={data.employees.total}
          subtitle={`${data.employees.onLeave} on leave`}
          icon={Users}
          trend={8}
        />
        <StatCard
          title="Pending Leaves"
          value={data.leaves.pending}
          subtitle={`${data.leaves.approved} approved this month`}
          icon={Calendar}
        />
        <StatCard
          title="Open Tickets"
          value={data.tickets.pending}
          subtitle={`${data.tickets.inReview} in review`}
          icon={MessageSquare}
        />
        <StatCard
          title="Avg Performance"
          value={`${data.performance.avgScore}/5`}
          subtitle={`${data.performance.topPerformers} top performers`}
          icon={TrendingUp}
        />
      </div>

      {/* HR Specific Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Sarah Johnson", type: "Sick Leave", days: "2 days", status: "pending" },
              { name: "Mike Chen", type: "Vacation", days: "5 days", status: "approved" },
              { name: "Lisa Wong", type: "Personal", days: "1 day", status: "pending" }
            ].map((leave, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{leave.name}</p>
                  <p className="text-sm text-muted-foreground">{leave.type} - {leave.days}</p>
                </div>
                <Badge className={`status-${leave.status}`}>
                  {leave.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { team: "Engineering", score: 92, members: 15 },
              { team: "Marketing", score: 88, members: 8 },
              { team: "Sales", score: 85, members: 12 }
            ].map((team, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{team.team}</span>
                  <span className="text-sm text-muted-foreground">{team.score}%</span>
                </div>
                <Progress value={team.score} className="h-2" />
                <p className="text-xs text-muted-foreground">{team.members} members</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const data = mockData.admin;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Oversee organizational performance and growth.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={data.employees.total}
          subtitle={`${data.employees.newHires} new hires this month`}
          icon={Users}
          trend={5}
        />
        <StatCard
          title="Departments"
          value={data.departments.total}
          subtitle={`${data.departments.performance}% avg performance`}
          icon={TrendingUp}
        />
        <StatCard
          title="Critical Issues"
          value={data.tickets.critical}
          subtitle={`${data.tickets.pending} total pending`}
          icon={AlertCircle}
          className="border-destructive/20"
        />
        <StatCard
          title="Revenue (M)"
          value={`$${data.revenue.current}M`}
          subtitle={`Target: $${data.revenue.target}M`}
          icon={TrendingUp}
          trend={data.revenue.growth}
        />
      </div>

      {/* Admin Specific Content */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
              Critical Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { issue: "Server downtime affecting productivity", priority: "high" },
              { issue: "Security breach in payment system", priority: "critical" },
              { issue: "Multiple employee complaints", priority: "medium" }
            ].map((item, i) => (
              <div key={i} className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                <p className="font-medium text-sm">{item.issue}</p>
                <Badge className={`mt-2 ${item.priority === 'critical' ? 'bg-destructive' : item.priority === 'high' ? 'bg-warning' : 'bg-muted'}`}>
                  {item.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-hover col-span-2">
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { dept: "Engineering", employees: 45, performance: 92, budget: 85 },
              { dept: "Sales", employees: 32, performance: 88, budget: 92 },
              { dept: "Marketing", employees: 18, performance: 85, budget: 78 },
              { dept: "HR", employees: 12, performance: 90, budget: 95 }
            ].map((dept, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{dept.dept}</p>
                  <p className="text-sm text-muted-foreground">{dept.employees} employees</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Performance</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={dept.performance} className="h-2 flex-1" />
                    <span className="text-sm">{dept.performance}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget Usage</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={dept.budget} className="h-2 flex-1" />
                    <span className="text-sm">{dept.budget}%</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const currentUser = getCurrentUser();
  
  switch (currentUser.role) {
    case 'hr':
      return <HRDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <EmployeeDashboard />;
  }
}