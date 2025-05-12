
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/types";
import {
  Calendar,
  ClipboardList,
  Home,
  Hospital,
  LogOut,
  Settings,
  User,
  Users,
  FileText,
  DollarSign
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarItems, setSidebarItems] = useState<any[]>([]);

  // Define navigation items based on user role
  useEffect(() => {
    if (!user) return;

    switch (user.role) {
      case Role.ADMIN:
        setSidebarItems([
          {
            title: "Dashboard",
            icon: Home,
            url: "/admin/dashboard",
          },
          {
            title: "Doctors",
            icon: Hospital,
            url: "/admin/doctors",
          },
          {
            title: "Staff",
            icon: Users,
            url: "/admin/staff",
          },
          {
            title: "Appointments",
            icon: Calendar,
            url: "/admin/appointments",
          },
          {
            title: "Invoices",
            icon: DollarSign,
            url: "/admin/invoices",
          },
          {
            title: "Settings",
            icon: Settings,
            url: "/admin/settings",
          },
        ]);
        break;
      case Role.DOCTOR:
        setSidebarItems([
          {
            title: "Dashboard",
            icon: Home,
            url: "/doctor/dashboard",
          },
          {
            title: "My Appointments",
            icon: Calendar,
            url: "/doctor/appointments",
          },
          {
            title: "Patients",
            icon: Users,
            url: "/doctor/patients",
          },
          {
            title: "Profile",
            icon: User,
            url: "/doctor/profile",
          },
        ]);
        break;
      case Role.STAFF:
        setSidebarItems([
          {
            title: "Dashboard",
            icon: Home,
            url: "/staff/dashboard",
          },
          {
            title: "Appointments",
            icon: Calendar,
            url: "/staff/appointments",
          },
          {
            title: "Assign Doctors",
            icon: Hospital,
            url: "/staff/assign",
          },
          {
            title: "Reports",
            icon: FileText,
            url: "/staff/reports",
          },
        ]);
        break;
      default:
        setSidebarItems([]);
    }
  }, [user]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="bg-white border-r">
          <SidebarHeader className="px-4 py-2">
            <Link to="/" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap">
                <span className="text-hospital-600">Health</span>
                <span className="text-hospital-800">Care</span>
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup className="mt-auto mb-4">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => logout()} className="text-red-500">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b p-4 flex items-center">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-xl font-semibold">
                {user.role} Dashboard
              </h1>
              <p className="text-sm text-gray-500">Welcome, {user.username}</p>
            </div>
          </div>
          <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
