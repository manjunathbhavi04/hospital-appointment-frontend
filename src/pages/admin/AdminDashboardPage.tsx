
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appointmentService, doctorService, staffService } from "@/services/api";
import { AppointmentResponse, DoctorResponse, StaffResponse } from "@/types";
import { Calendar, DollarSign, Hospital, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: JSX.Element;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {

const [staff, setStaff] = useState<StaffResponse[]>([]);
const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const appointmentsResponse = await appointmentService.getAllAppointments();
        const doctorsResponse = await doctorService.getAllDoctors();
        const StaffResponse = await staffService.getAllStaff();
        
        setAppointments(appointmentsResponse.data);
        setDoctors(doctorsResponse.data);
        setStaff(StaffResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [stats, setStats] = useState({
    totalDoctors: '0',
    totalStaff: '0',
    totalAppointments: '0',
    revenue: '$0'
  });

  // Simulating data fetching
  useEffect(() => {
    // In a real application, you would fetch this data from your API
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalDoctors: '24',
        totalStaff: '38',
        totalAppointments: '145',
        revenue: '$12,450'
      });
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the admin dashboard. Here's an overview of the hospital's performance.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Doctors"
            value={doctors.length}
            description="+2 since last month"
            icon={<Hospital className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Total Staff"
            value={staff.length}
            description="+4 since last month"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Appointments"
            value={appointments.length}
            description="+18% from last month"
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Monthly Revenue"
            value={200}
            description="+15% from last month"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>
                List of most recent appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-500">General Checkup</p>
                  </div>
                  <div className="text-sm text-right">
                    <p>Today, 10:30 AM</p>
                    <p className="text-green-500">Completed</p>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-gray-500">Cardiology</p>
                  </div>
                  <div className="text-sm text-right">
                    <p>Today, 1:15 PM</p>
                    <p className="text-blue-500">Scheduled</p>
                  </div>
                </div>
                <div className="flex justify-between py-2">
                  <div>
                    <p className="font-medium">Mike Johnson</p>
                    <p className="text-sm text-gray-500">Orthopedics</p>
                  </div>
                  <div className="text-sm text-right">
                    <p>Tomorrow, 9:00 AM</p>
                    <p className="text-blue-500">Scheduled</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Latest activities across the hospital
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm">Dr. Sarah Johnson added to Cardiology</p>
                    <p className="text-xs text-gray-500">Today, 09:12 AM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm">15 appointments completed today</p>
                    <p className="text-xs text-gray-500">Today, 05:20 PM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm">New billing system update installed</p>
                    <p className="text-xs text-gray-500">Yesterday, 06:15 PM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm">Staff training scheduled for next week</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
