
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentMode, AppointmentResponse, AppointmentStatus } from "@/types";
import { Calendar, CheckCircle, Clock, Search, User, Video } from "lucide-react";
import { doctorService } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await doctorService.getMyAppointments();
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch appointments",
          variant: "destructive"
        });
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
      toast({
        title: "Success",
        description: "Appointment marked as complete",
      });
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive"
      });
    }
  };

  // Filter appointments by status
  const scheduledAppointments = appointments.filter(
    (app) => app.status === AppointmentStatus.SCHEDULED
  );

  const completedAppointments = appointments.filter(
    (app) => app.status === AppointmentStatus.COMPLETED
  );

  // Filter appointments by search term
  const filteredScheduledAppointments = scheduledAppointments.filter(
    app => app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.problemDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompletedAppointments = completedAppointments.filter(
    app => app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.problemDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Appointments</h1>
          <p className="text-muted-foreground">
            View and manage all your scheduled and past appointments
          </p>
        </div>

        <div className="relative w-full">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments by patient name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="scheduled" className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="scheduled">
              Scheduled ({scheduledAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Appointments</CardTitle>
                <CardDescription>
                  Appointments that need your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-6">Loading appointments...</div>
                ) : filteredScheduledAppointments.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No scheduled appointments found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredScheduledAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border rounded-lg shadow-sm p-4"
                      >
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-blue-600" />
                              <h3 className="font-medium">{appointment.patientName}</h3>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{format(parseISO(appointment.appointmentDateTime), 'PPP')}</span>
                              <Clock className="h-3.5 w-3.5 ml-2 mr-1" />
                              <span>{format(parseISO(appointment.appointmentDateTime), 'h:mm a')}</span>
                            </div>
                            <div>
                              <Badge variant="outline" className="mb-2">
                                {appointment.mode === AppointmentMode.ONLINE ? "Online" : "In-person"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">
                              {appointment.problemDescription}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            {appointment.mode === AppointmentMode.ONLINE && (
                              <Button
                                variant="outline"
                                className="flex items-center justify-center"
                                asChild
                              >
                                <Link to={`/doctor/video-consultation/${appointment.id}`}>
                                  <Video className="h-4 w-4 mr-2" /> Join Video
                                </Link>
                              </Button>
                            )}
                            <Button
                              onClick={() => handleCompleteAppointment(appointment.id)}
                              className="flex items-center justify-center"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" /> Mark Complete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Appointments</CardTitle>
                <CardDescription>
                  Past appointments you've completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-6">Loading appointments...</div>
                ) : filteredCompletedAppointments.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No completed appointments found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCompletedAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-green-600" />
                              <h3 className="font-medium">{appointment.patientName}</h3>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{format(parseISO(appointment.appointmentDateTime), 'PPP')}</span>
                              <Clock className="h-3.5 w-3.5 ml-2 mr-1" />
                              <span>{format(parseISO(appointment.appointmentDateTime), 'h:mm a')}</span>
                            </div>
                            <div>
                              <Badge variant="outline" className="bg-green-50">
                                Completed
                              </Badge>
                              <Badge variant="outline" className="ml-2">
                                {appointment.mode === AppointmentMode.ONLINE ? "Online" : "In-person"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">
                              {appointment.problemDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
