
import DashboardLayout from "@/components/layout/DashboardLayout";
import { appointmentService, billingService } from "@/services/api";
import { AppointmentResponse, AppointmentStatus, BillResponse } from "@/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Download, FileText, Search } from "lucide-react";

interface AppointmentWithBill extends AppointmentResponse {
  billId?: number;
}

export default function AdminInvoicesPage() {
  const [completedAppointments, setCompletedAppointments] = useState<AppointmentWithBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithBill | null>(null);
  const [labFee, setLabFee] = useState<number>(0);
  const [medicineFee, setMedicineFee] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getAppointmentsByStatus(AppointmentStatus.COMPLETED);
        const appointments = response.data || [];
        
        // Fetch existing bills for these appointments
        const appointmentsWithBills = await Promise.all(
          appointments.map(async (appointment) => {
            try {
              const billResponse = await billingService.getBillByAppointment(appointment.id);
              if (billResponse.data && billResponse.data.billingId) {
                return {
                  ...appointment,
                  billId: billResponse.data.billingId
                };
              }
            } catch (error) {
              // No bill exists yet, which is fine
              console.log(`No bill found for appointment ${appointment.id}`);
            }
            return appointment;
          })
        );
        
        setCompletedAppointments(appointmentsWithBills);
      } catch (error) {
        console.error('Error fetching completed appointments:', error);
        toast.error('Failed to load completed appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedAppointments();
  }, []);

  const handleGenerateInvoice = async () => {
    if (!selectedAppointment || !selectedAppointment.doctorId || !selectedAppointment.patientId) {
      toast.error('Cannot generate invoice. Missing doctor or patient information.');
      return;
    }

    // If there's already a bill, just show a success message
    // if (selectedAppointment.billId) {
    //   toast.info('Invoice already exists for this appointment');
    //   setLabFee(0);
    //   setMedicineFee(0);
    //   setSelectedAppointment(null);
    //   return;
    // }

    try {
      setGeneratingInvoice(true);
      
      // Add the appointmentId to the generate bill API call
      const response = await billingService.generateBill(
        selectedAppointment.id, // Add appointment ID here 
        selectedAppointment.patientId,
        selectedAppointment.doctorId,
        labFee,
        medicineFee
      );
      
      const billData = response.data;
      
      // Update the appointment in the list with the new bill ID
      setCompletedAppointments(prevAppointments => 
        prevAppointments.map(app => 
          app.id === selectedAppointment.id 
            ? { ...app, billId: billData.billingId } 
            : app
        )
      );
      
      toast.success('Invoice generated successfully');
      
      // Reset form values
      setLabFee(0);
      setMedicineFee(0);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice. Bill may already exist.');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const handleDownloadInvoice = async (appointmentId: number) => {
    const appointment = completedAppointments.find(app => app.id === appointmentId);
    
    if (!appointment || !appointment.billId) {
      toast.error('No invoice exists for this appointment');
      return;
    }
    
    try {
      setDownloadingInvoice(true);
      const response = await billingService.downloadInvoice(appointment.billId);
      
      // Create a blob URL from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${appointment.billId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const filteredAppointments = completedAppointments.filter(
    app => 
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.doctorName && app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Invoices</h1>
          <p className="text-muted-foreground">
            Generate and manage invoices for completed appointments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Appointments eligible for invoicing</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Invoiced</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedAppointments.filter(app => app.billId).length}
              </div>
              <p className="text-xs text-muted-foreground">Appointments with generated invoices</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient or doctor name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <DollarSign className="h-4 w-4 mr-2" />
                Generate New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Invoice</DialogTitle>
                <DialogDescription>
                  Select an appointment and enter additional fees to generate an invoice.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="appointment">Select Appointment</Label>
                  <select
                    id="appointment"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedAppointment?.id || ''}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const appointment = completedAppointments.find(a => a.id === id) || null;
                      setSelectedAppointment(appointment);
                    }}
                  >
                    <option value="">Select an appointment</option>
                    {completedAppointments.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.patientName} - {format(parseISO(app.appointmentDateTime), 'MMM d, yyyy')}
                        {app.billId ? ' (Invoiced)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedAppointment && (
                  <div className="bg-muted p-3 rounded-md">
                    <p><strong>Patient:</strong> {selectedAppointment.patientName}</p>
                    <p><strong>Doctor:</strong> {selectedAppointment.doctorName || 'Unknown'}</p>
                    <p><strong>Date:</strong> {format(parseISO(selectedAppointment.appointmentDateTime), 'PPP')}</p>
                    {selectedAppointment.billId && (
                      <p className="text-green-600 font-medium mt-2">
                        Invoice already generated (ID: {selectedAppointment.billId})
                      </p>
                    )}
                  </div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="labFee">Lab Fee ($)</Label>
                  <Input
                    id="labFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={labFee}
                    onChange={(e) => setLabFee(Number(e.target.value))}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="medicineFee">Medicine Fee ($)</Label>
                  <Input
                    id="medicineFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={medicineFee}
                    onChange={(e) => setMedicineFee(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={handleGenerateInvoice} 
                  disabled={!selectedAppointment || generatingInvoice}
                >
                  {generatingInvoice ? 'Generating...' : selectedAppointment?.billId 
                    ? 'Download Existing Invoice' 
                    : 'Generate Invoice'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Completed Appointments</CardTitle>
            <CardDescription>
              Generate invoices for these completed appointments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-6">Loading appointments...</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No completed appointments found
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-md p-4 flex flex-col md:flex-row justify-between"
                  >
                    <div>
                      <h3 className="font-medium">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-500">
                        Appointment on {format(parseISO(appointment.appointmentDateTime), 'PPP')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Doctor: {appointment.doctorName || 'Not assigned'}
                      </p>
                      {appointment.billId && (
                        <p className="text-sm text-green-600 mt-1">
                          Invoice generated (ID: {appointment.billId})
                        </p>
                      )}
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-2">
                      {appointment.billId ? (
                        <Button 
                          onClick={() => handleDownloadInvoice(appointment.id)} 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          disabled={downloadingInvoice}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
                        </Button>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Generate Invoice
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Generate Invoice for {appointment.patientName}</DialogTitle>
                              <DialogDescription>
                                Enter additional fees to generate an invoice for this appointment.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="grid gap-4 py-4">
                              <div className="bg-muted p-3 rounded-md">
                                <p><strong>Patient:</strong> {appointment.patientName}</p>
                                <p><strong>Doctor:</strong> {appointment.doctorName || 'Unknown'}</p>
                                <p><strong>Date:</strong> {format(parseISO(appointment.appointmentDateTime), 'PPP')}</p>
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor={`labFee-${appointment.id}`}>Lab Fee ($)</Label>
                                <Input
                                  id={`labFee-${appointment.id}`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={labFee}
                                  onChange={(e) => setLabFee(Number(e.target.value))}
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor={`medicineFee-${appointment.id}`}>Medicine Fee ($)</Label>
                                <Input
                                  id={`medicineFee-${appointment.id}`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={medicineFee}
                                  onChange={(e) => setMedicineFee(Number(e.target.value))}
                                />
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button 
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  handleGenerateInvoice();
                                }}
                                disabled={generatingInvoice}
                              >
                                {generatingInvoice ? 'Generating...' : 'Generate Invoice'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
