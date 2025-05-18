
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentResponse, AppointmentStatus } from "@/types";
import { doctorService } from "@/services/api";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PatientWithAppointments {
  patientId: number;
  patientName: string;
  appointments: AppointmentResponse[];
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<PatientWithAppointments[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        // Get all appointments for this doctor
        const response = await doctorService.getMyAppointments();
        const appointments = response.data;

        // Group appointments by patient
        const patientMap = new Map<number, PatientWithAppointments>();
        
        appointments.forEach(appointment => {
          if (!patientMap.has(appointment.patientId)) {
            patientMap.set(appointment.patientId, {
              patientId: appointment.patientId,
              patientName: appointment.patientName,
              appointments: []
            });
          }
          patientMap.get(appointment.patientId)?.appointments.push(appointment);
        });
        
        // Convert map to array
        setPatients(Array.from(patientMap.values()));
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients by search term
  const filteredPatients = patients.filter(
    patient => patient.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Patients</h1>
          <p className="text-muted-foreground">
            View all patients assigned to you and their appointment history
          </p>
        </div>

        <div className="relative w-full">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="text-center py-10">Loading patients...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-10">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No patients found</h3>
            <p className="mt-2 text-muted-foreground">
              {searchTerm ? 
                "No patients match your search. Try a different search term." : 
                "You don't have any patients assigned to you yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.patientId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{patient.patientName}</CardTitle>
                      <CardDescription>
                        Patient ID: {patient.patientId}
                      </CardDescription>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="font-medium">Appointment History</h3>
                    <div className="divide-y">
                      {patient.appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="py-3"
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{format(parseISO(appointment.appointmentDateTime), 'PPP')}</p>
                              <p className="text-sm text-gray-500">{format(parseISO(appointment.appointmentDateTime), 'h:mm a')}</p>
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                appointment.status === AppointmentStatus.PENDING 
                                  ? "bg-yellow-100 text-yellow-800"
                                  : appointment.status === AppointmentStatus.SCHEDULED 
                                  ? "bg-blue-100 text-blue-800"
                                  : appointment.status === AppointmentStatus.COMPLETED 
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm mt-1">{appointment.problemDescription}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
