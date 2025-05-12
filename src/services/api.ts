
import axios from 'axios';
import { 
  AppointmentRequest, 
  AssignDoctorRequest, 
  DoctorRequest, 
  LoginRequest, 
  StaffRequest,
  AppointmentStatus
} from '@/types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // Adjust this to your actual API base URL if needed
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication
export const authService = {
  login: (credentials: LoginRequest) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
};

// Patient services
export const patientService = {
  addPatient: (patient: any) => api.post('/patient/add', patient)
};

// Appointment services
export const appointmentService = {
  bookAppointment: (appointment: AppointmentRequest) => api.post('/appointments/book', appointment),
  getPendingAppointments: () => api.get('/appointments/pending'),
  getAppointmentsByStatus: (status: AppointmentStatus) => api.get(`/appointments/status?status=${status}`)
};

// Doctor services
export const doctorService = {
  getAllDoctors: () => api.get('/api/doctor'),
  getMyAppointments: () => api.get('/api/doctor/appointments'),
  completeAppointment: (appointmentId: number) => api.put(`/api/doctor/appointments/${appointmentId}/complete`),
  getScheduledAppointments: () => api.get('/api/doctor/appointments/scheduled'),
  registerDoctor: (doctor: DoctorRequest) => api.post('/api/register/doctor', doctor)
};

// Staff services
export const staffService = {
  getAllStaff: () => api.get('/api/staff'),
  assignDoctor: (assignDoctorRequest: AssignDoctorRequest) => 
    api.post('/api/staff/assign/doctor', assignDoctorRequest),
  assignDoctorToAppointment: (appointmentId: number, doctorId: number) => 
    api.post(`/api/staff/assign/doctor/${appointmentId}?doctorId=${doctorId}`),
  updateAppointmentStatus: (appointmentId: number, status: AppointmentStatus) => 
    api.put(`/api/staff/appointments/${appointmentId}/status?status=${status}`),
  getPendingAppointments: () => api.get('/api/staff/appointments/pending'),
  registerStaff: (staff: StaffRequest) => api.post('/api/register/staff', staff)
};

// Speciality services
export const specialityService = {
  getAllSpeciality: () => api.get('/speciality'),
  getSpeciality: (id: number) => api.get(`/speciality/${id}`),
  updateSpeciality: (name: string, id: number) => api.put(`/speciality/${id}/update?name=${name}`),
  addSpeciality: (name: string) => api.post(`/speciality/add/${name}`)
};

// Billing services
export const billingService = {
  generateBill: (patientId: number, doctorId: number, labFee: number, medicineFee: number) => 
    api.post(`/billing/generate?patientId=${patientId}&doctorId=${doctorId}&labFee=${labFee}&medicineFee=${medicineFee}`),
  markAsPaid: (billingId: number) => api.put(`/billing/${billingId}/pay`),
  downloadInvoice: (billingId: number) => api.get(`/billing/${billingId}/download-invoice`, { responseType: 'blob' })
};

export default api;
