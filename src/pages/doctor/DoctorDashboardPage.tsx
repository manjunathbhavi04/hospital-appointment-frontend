
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentResponse, AppointmentStatus } from "@/types";
import { Calendar, CheckCircle, Clock, User, Video } from "lucide-react";
import { appointmentService, doctorService } from "@/services/api";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await doctorService.getMyAppointments();
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCompleteAppointment = async (appointmentId: number) => {
    try {
      await doctorService.completeAppointment(appointmentId);
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: AppointmentStatus.COMPLETED } 
            : appointment
        )
      );
      toast.success('Appointment marked as complete');
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast.error('Failed to update appointment status');
    }
  };

  // Count appointments by status
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (app) => app.status === AppointmentStatus.COMPLETED
  ).length;
  const pendingAppointments = appointments.filter(
    (app) => app.status === AppointmentStatus.SCHEDULED
  ).length;

  // Filter today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysAppointments = appointments.filter((app) => {
    const appointmentDate = new Date(app.appointmentDateTime);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === today.getTime() && app.status === AppointmentStatus.SCHEDULED;
  });

  // Filter upcoming appointments (future dates, not today)
  const upcomingAppointments = appointments.filter((app) => {
    const appointmentDate = new Date(app.appointmentDateTime);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() > today.getTime() && app.status === AppointmentStatus.SCHEDULED;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Doctor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your dashboard. Here's an overview of your appointments and schedule.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppointments}</div>
              <p className="text-xs text-muted-foreground">All time appointments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAppointments}</div>
              <p className="text-xs text-muted-foreground">Appointments completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">Scheduled appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>
              Appointments scheduled for today that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : todaysAppointments.length > 0 ? (
              <div className="space-y-4">
                {todaysAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(appointment.appointmentDateTime), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {appointment.reason?.includes("ONLINE") && (
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-1" /> Join Video
                        </Button>
                      )}
                      <Button
                        onClick={() => handleCompleteAppointment(appointment.id)}
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No appointments scheduled for today
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your schedule for the coming days</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="divide-y">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="py-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">
                          {format(parseISO(appointment.appointmentDateTime), 'MMM d, yyyy')}
                        </span>
                        <Clock className="h-3.5 w-3.5 text-gray-500 ml-2 mr-1" />
                        <span className="text-sm text-gray-500">
                          {format(parseISO(appointment.appointmentDateTime), 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {appointment.problemDescription}
                      </p>
                    </div>
                    <div className="text-sm">
                      {appointment.reason?.includes("ONLINE") ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          <Video className="h-3 w-3 mr-1" /> Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          <User className="h-3 w-3 mr-1" /> In-person
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No upcoming appointments scheduled
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
