
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentResponse, AppointmentStatus } from "@/types";
import { appointmentService, staffService } from "@/services/api";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function StaffAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        setLoading(true);
        // Get all appointments from all statuses
        const [pendingRes, scheduledRes, completedRes] = await Promise.all([
          appointmentService.getAppointmentsByStatus(AppointmentStatus.PENDING),
          appointmentService.getAppointmentsByStatus(AppointmentStatus.SCHEDULED),
          appointmentService.getAppointmentsByStatus(AppointmentStatus.COMPLETED),
        ]);
        
        // Combine appointments from different statuses
        const allAppointments = [
          ...(pendingRes.data || []),
          ...(scheduledRes.data || []),
          ...(completedRes.data || []),
        ];
        
        setAppointments(allAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointment data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId: number, status: AppointmentStatus) => {
    try {
      await staffService.updateAppointmentStatus(appointmentId, status);
      
      // Update local state
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status } 
            : appointment
        )
      );
      
      toast.success(`Appointment marked as ${status.toLowerCase()}`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Staff cannot update the Appointement Status');
    }
  };

  // Filter appointments by status
  const pendingAppointments = appointments.filter(
    (app) => app.status === AppointmentStatus.PENDING
  );
  
  const scheduledAppointments = appointments.filter(
    (app) => app.status === AppointmentStatus.SCHEDULED
  );
  
  const completedAppointments = appointments.filter(
    (app) => app.status === AppointmentStatus.COMPLETED
  );

  // Filter appointments by search term
  const filterAppointments = (apps: AppointmentResponse[]) => {
    return apps.filter(
      app => 
        app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.doctorName && app.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        app.problemDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredPending = filterAppointments(pendingAppointments);
  const filteredScheduled = filterAppointments(scheduledAppointments);
  const filteredCompleted = filterAppointments(completedAppointments);

  const renderAppointmentList = (appointmentsList: AppointmentResponse[], showActions: boolean = true) => (
    <div className="space-y-4">
      {appointmentsList.length === 0 ? (
        <div className="text-center py-6 text-gray-500">No appointments found</div>
      ) : (
        appointmentsList.map((appointment) => (
          <div
            key={appointment.id}
            className="border rounded-md p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">{appointment.patientName}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{format(parseISO(appointment.appointmentDateTime), "PPP")}</span>
                  <Clock className="h-3.5 w-3.5 ml-2 mr-1" />
                  <span>{format(parseISO(appointment.appointmentDateTime), "h:mm a")}</span>
                </div>
                <p className="text-sm mt-1 line-clamp-2">{appointment.problemDescription}</p>
              </div>
              <div className="mt-3 md:mt-0">
                <Badge
                  className={
                    appointment.status === AppointmentStatus.PENDING
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      : appointment.status === AppointmentStatus.SCHEDULED
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      : "bg-green-100 text-green-800 hover:bg-green-100"
                  }
                >
                  {appointment.status}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t pt-3">
              <div className="mb-3 md:mb-0">
                {appointment.doctorId ? (
                  <span className="text-sm">
                    <span className="text-gray-500">Doctor:</span> {appointment.doctorName}
                  </span>
                ) : (
                  <span className="text-sm text-yellow-600">No doctor assigned</span>
                )}
              </div>
              {showActions && (
                <div className="flex flex-wrap gap-2">
                  {appointment.status === AppointmentStatus.PENDING && (
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateStatus(appointment.id, AppointmentStatus.SCHEDULED)}
                    >
                      Mark as Scheduled
                    </Button>
                  )}
                  {appointment.status === AppointmentStatus.SCHEDULED && (
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateStatus(appointment.id, AppointmentStatus.COMPLETED)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateStatus(appointment.id, AppointmentStatus.CANCELLED)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
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
          <h1 className="text-2xl font-bold mb-2">All Appointments</h1>
          <p className="text-muted-foreground">
            View and manage all hospital appointments
          </p>
        </div>

        <div className="relative w-full">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient, doctor or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduledAppointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAppointments.length}</div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading appointments...</div>
        ) : (
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="pending">Pending ({pendingAppointments.length})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled ({scheduledAppointments.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Appointments</CardTitle>
                  <CardDescription>Appointments that need doctor assignment</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderAppointmentList(filteredPending)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Appointments</CardTitle>
                  <CardDescription>Appointments with assigned doctors</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderAppointmentList(filteredScheduled)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Appointments</CardTitle>
                  <CardDescription>Appointments that have been completed</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderAppointmentList(filteredCompleted, false)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}
