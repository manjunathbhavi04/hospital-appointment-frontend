
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { appointmentService } from "@/services/api";
import { AppointmentResponse, AppointmentStatus } from "@/types";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO, subDays, startOfWeek, startOfMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, CartesianGrid, Legend, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FileText } from "lucide-react";

export default function StaffReportsPage() {
  const [allAppointments, setAllAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week"); // "week", "month", "year"

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        setLoading(true);
        // Get all appointments from all statuses
        const [pendingRes, scheduledRes, completedRes, cancelledRes] = await Promise.all([
          appointmentService.getAppointmentsByStatus(AppointmentStatus.PENDING),
          appointmentService.getAppointmentsByStatus(AppointmentStatus.SCHEDULED),
          appointmentService.getAppointmentsByStatus(AppointmentStatus.COMPLETED),
          appointmentService.getAppointmentsByStatus(AppointmentStatus.CANCELLED),
        ]);
        
        // Combine appointments from different statuses
        const allAppointments = [
          ...(pendingRes.data || []),
          ...(scheduledRes.data || []),
          ...(completedRes.data || []),
          ...(cancelledRes.data || []),
        ];
        
        setAllAppointments(allAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointment data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllAppointments();
  }, []);

  // Filter appointments based on timeRange
  const filteredAppointments = () => {
    const today = new Date();
    
    let cutoffDate;
    if (timeRange === "week") {
      cutoffDate = subDays(today, 7);
    } else if (timeRange === "month") {
      cutoffDate = subDays(today, 30);
    } else {
      cutoffDate = subDays(today, 365);
    }
    
    return allAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDateTime);
      return appointmentDate >= cutoffDate;
    });
  };

  // Stats calculations
  const appointments = filteredAppointments();
  const pendingCount = appointments.filter(app => app.status === AppointmentStatus.PENDING).length;
  const scheduledCount = appointments.filter(app => app.status === AppointmentStatus.SCHEDULED).length;
  const completedCount = appointments.filter(app => app.status === AppointmentStatus.COMPLETED).length;
  const cancelledCount = appointments.filter(app => app.status === AppointmentStatus.CANCELLED).length;
  const totalAppointments = appointments.length;
  
  // Calculate completion rate
  const completionRate = totalAppointments > 0 
    ? Math.round((completedCount / totalAppointments) * 100) 
    : 0;

  // Format data for charts
  const getStatusChartData = () => [
    { name: "Pending", value: pendingCount },
    { name: "Scheduled", value: scheduledCount },
    { name: "Completed", value: completedCount },
    { name: "Cancelled", value: cancelledCount },
  ];

  // Helper function to group appointments by day or month
  const getTimeChartData = () => {
    const data: { [key: string]: { date: string, count: number } } = {};
    
    appointments.forEach(appointment => {
      const date = parseISO(appointment.appointmentDateTime);
      
      // Format key based on time range
      let key;
      if (timeRange === "week" || timeRange === "month") {
        key = format(date, "MM/dd");
      } else {
        key = format(date, "MMM yyyy");
      }
      
      if (!data[key]) {
        data[key] = { date: key, count: 0 };
      }
      
      data[key].count += 1;
    });
    
    // Convert to array and sort by date
    return Object.values(data).sort((a, b) => {
      const dateA = a.date.split('/').reverse().join('-');
      const dateB = b.date.split('/').reverse().join('-');
      return dateA.localeCompare(dateB);
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Appointment Reports</h1>
            <p className="text-muted-foreground">
              Review appointment metrics and statistics
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading report data...</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAppointments}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completionRate}%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cancelledCount}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Appointments by Status</CardTitle>
                  <CardDescription>
                    Distribution of appointments by their current status
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getStatusChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Appointments" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Appointment Trend</CardTitle>
                  <CardDescription>
                    {timeRange === "week" 
                      ? "Daily appointments over the last 7 days" 
                      : timeRange === "month" 
                        ? "Daily appointments over the last 30 days"
                        : "Monthly appointments over the last year"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getTimeChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="Appointments" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end">
              <Button className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
