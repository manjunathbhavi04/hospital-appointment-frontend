
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AppointmentResponse, 
  AppointmentStatus, 
  DoctorResponse
} from "@/types";
import { Calendar, CheckCircle, Clock, User } from "lucide-react";
import { appointmentService, doctorService, staffService } from "@/services/api";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StaffDashboardPage() {
  const [pendingAppointments, setPendingAppointments] = useState<AppointmentResponse[]>([]);
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctors, setSelectedDoctors] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const appointmentsResponse = await staffService.getPendingAppointments();
        const doctorsResponse = await doctorService.getAllDoctors();
        
        setPendingAppointments(appointmentsResponse.data);
        setDoctors(doctorsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDoctorSelect = (appointmentId: number, doctorId: string) => {
    setSelectedDoctors({
      ...selectedDoctors,
      [appointmentId]: parseInt(doctorId)
    });
  };

  const handleAssignDoctor = async (appointmentId: number) => {
    const doctorId = selectedDoctors[appointmentId];
    if (!doctorId) {
      toast.error('Please select a doctor first');
      return;
    }

    try {
      await staffService.assignDoctor({
        appointmentId,
        doctorId
      });
      
      // Update local state
      setPendingAppointments(prev => 
        prev.filter(appointment => appointment.id !== appointmentId)
      );
      
      toast.success('Doctor assigned successfully');
    } catch (error) {
      console.error('Error assigning doctor:', error);
      toast.error('Failed to assign doctor');
    }
  };

  const handleUpdateStatus = async (appointmentId: number, status: AppointmentStatus) => {
    try {
      await staffService.updateAppointmentStatus(appointmentId, status);
      
      // Update local state
      setPendingAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status } 
            : appointment
        )
      );
      
      toast.success(`Appointment marked as ${status.toLowerCase()}`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the staff dashboard. Manage appointments and assign doctors.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Needs doctor assignment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Doctors</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctors.length}</div>
              <p className="text-xs text-muted-foreground">Ready to be assigned</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingAppointments.filter(app => {
                  const today = new Date();
                  const appDate = new Date(app.appointmentDateTime);
                  return appDate.toDateString() === today.toDateString();
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">Appointments for today</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Appointments</CardTitle>
            <CardDescription>
              New appointments that need doctor assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : pendingAppointments.length > 0 ? (
              <div className="space-y-4">
                {pendingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-md p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{appointment.patientName}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {format(parseISO(appointment.appointmentDateTime), 'PPP')}
                          </span>
                          <Clock className="h-3.5 w-3.5 ml-2 mr-1" />
                          <span>
                            {format(parseISO(appointment.appointmentDateTime), 'h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm mt-1 line-clamp-2">{appointment.problemDescription}</p>
                      </div>
                      <div className="mt-3 md:mt-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === AppointmentStatus.PENDING 
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                      <Select onValueChange={(value) => handleDoctorSelect(appointment.id, value)}>
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue placeholder="Select Doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.doctorId} value={doctor.doctorId.toString()}>
                              Dr. {doctor.fullName} ({doctor.specialization})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        onClick={() => handleAssignDoctor(appointment.id)}
                        disabled={!selectedDoctors[appointment.id]}
                        className="w-full md:w-auto"
                      >
                        Assign Doctor
                      </Button>

                      <Button 
                        variant="outline" 
                        onClick={() => handleUpdateStatus(appointment.id, AppointmentStatus.SCHEDULED)}
                        className="w-full md:w-auto"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Scheduled
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No pending appointments at the moment
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
