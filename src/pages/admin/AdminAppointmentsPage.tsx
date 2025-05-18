import DashboardLayout from "@/components/layout/DashboardLayout";
import { appointmentService } from "@/services/api";
import { AppointmentMode, AppointmentResponse, AppointmentStatus } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Calendar, CheckCircle, Clock, Hospital, User, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Assuming this endpoint returns all appointments regardless of status
        const response = await appointmentService.getAllAppointments();
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const pendingAppointments = appointments.filter(
    (app) => app.status === AppointmentStatus.PENDING
  );
  const scheduledAppointments = appointments.filter(
    (app) => app.status === AppointmentStatus.SCHEDULED
  );
  const completedAppointments = appointments.filter(
    (app) => app.status === AppointmentStatus.COMPLETED
  );
  const cancelledAppointments = appointments.filter(
    (app) => app.status === AppointmentStatus.CANCELLED
  );

  const renderAppointmentList = (appointmentsList: AppointmentResponse[]) => (
    <div className="space-y-4">
      {appointmentsList.length === 0 ? (
        <div className="text-center py-6 text-gray-500">No appointments found</div>
      ) : (
        appointmentsList.map((appointment) => (
          <div
            key={appointment.id}
            className="border rounded-md p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
              <div>
                <h3 className="font-medium">{appointment.patientName}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{format(parseISO(appointment.appointmentDateTime), "PPP")}</span>
                  <Clock className="h-3.5 w-3.5 ml-2 mr-1" />
                  <span>{format(parseISO(appointment.appointmentDateTime), "h:mm a")}</span>
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                <Badge
                  className={
                    appointment.status === AppointmentStatus.PENDING
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      : appointment.status === AppointmentStatus.SCHEDULED
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      : appointment.status === AppointmentStatus.COMPLETED
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {appointment.status}
                </Badge>
              </div>
            </div>
            <p className="text-sm line-clamp-2 text-gray-600">
              {appointment.problemDescription}
            </p>
            <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
              <div>
                {appointment.doctorId ? (
                  <span className="flex items-center text-gray-600">
                    <Hospital className="h-3.5 w-3.5 mr-1" />
                    Dr. {appointment.doctorName || "Assigned Doctor"}
                  </span>
                ) : (
                  <span className="text-gray-500">No doctor assigned</span>
                )}
              </div>
              <div>
                {appointment.mode == AppointmentMode.ONLINE ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                    <Video className="h-3 w-3 mr-1" /> Online
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
                    <User className="h-3 w-3 mr-1" /> In-person
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Appointments</h1>
          <p className="text-muted-foreground">
            View and manage all appointments in the hospital.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">All</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledAppointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAppointments.length}</div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading appointments...</div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingAppointments.length})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled ({scheduledAppointments.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedAppointments.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({cancelledAppointments.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all">{renderAppointmentList(appointments)}</TabsContent>
            <TabsContent value="pending">{renderAppointmentList(pendingAppointments)}</TabsContent>
            <TabsContent value="scheduled">{renderAppointmentList(scheduledAppointments)}</TabsContent>
            <TabsContent value="completed">{renderAppointmentList(completedAppointments)}</TabsContent>
            <TabsContent value="cancelled">{renderAppointmentList(cancelledAppointments)}</TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}
