import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Users, 
  ClipboardList, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Clock, 
  Settings,
  LogOut,
  Shield,
  UserCog,
  ChevronDown,
  Home
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock user data - in real app this would come from auth context
const getCurrentUser = () => ({
  name: "John Smith",
  email: "john.smith@company.com",
  role: "employee", // employee, hr, admin
  avatar: "/api/placeholder/32/32"
});

const getMenuItems = (role: string) => {
  const baseItems = [
    { title: "Dashboard", url: "/", icon: Home }
  ];

  const menuItems = {
    employee: [
      ...baseItems,
      { title: "My Tasks", url: "/tasks", icon: ClipboardList },
      { title: "Leaves", url: "/leaves", icon: Calendar },
      { title: "Tickets", url: "/tickets", icon: MessageSquare },
      { title: "Payslips", url: "/payslips", icon: FileText },
      { title: "Holidays", url: "/holidays", icon: Calendar },
      { title: "Check-in/out", url: "/attendance", icon: Clock },
    ],
    hr: [
      ...baseItems,
      { title: "Employees", url: "/employees", icon: Users },
      { title: "Leave Management", url: "/leave-management", icon: Calendar },
      { title: "Complaint Box", url: "/complaints", icon: MessageSquare },
      { title: "Payslip Upload", url: "/payslip-upload", icon: FileText },
      { title: "Performance", url: "/performance", icon: UserCog },
      { title: "Attendance Overview", url: "/attendance-overview", icon: Clock },
    ],
    admin: [
      ...baseItems,
      { title: "Employee Management", url: "/employee-management", icon: Users },
      { title: "Team Performance", url: "/team-performance", icon: UserCog },
      { title: "Complaint Box", url: "/admin-complaints", icon: MessageSquare },
      { title: "Leave Management", url: "/admin-leaves", icon: Calendar },
      { title: "Attendance Overview", url: "/admin-attendance", icon: Clock },
      { title: "System Settings", url: "/settings", icon: Settings },
    ]
  };

  return menuItems[role as keyof typeof menuItems] || menuItems.employee;
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const currentUser = getCurrentUser();
  const menuItems = getMenuItems(currentUser.role);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive/10 text-destructive';
      case 'hr': return 'bg-warning/10 text-warning';
      default: return 'bg-primary/10 text-primary';
    }
  };

  return (
    <Sidebar className={`transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Logo/Header */}
        <div className="p-4 border-b border-sidebar-border">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">EMS</h2>
                <p className="text-xs text-sidebar-foreground/60">Management System</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-sidebar-border">
          <Collapsible open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-0 h-auto hover:bg-sidebar-accent/50"
              >
                <div className="flex items-center space-x-3 w-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-sidebar-foreground">
                            {currentUser.name}
                          </p>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs mt-1 ${getRoleBadgeColor(currentUser.role)}`}
                          >
                            {currentUser.role.toUpperCase()}
                          </Badge>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-sidebar-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="mt-2">
                <div className="text-xs text-sidebar-foreground/60 px-1">
                  {currentUser.email}
                </div>
              </CollapsibleContent>
            )}
          </Collapsible>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!isCollapsed ? "Navigation" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => {
              // In real app, this would handle sign out
              console.log("Sign out clicked");
            }}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}