import axios from 'axios';
import {
  AppointmentRequest,
  AssignDoctorRequest,
  DoctorRequest,
  LoginRequest,
  StaffRequest,
  AppointmentStatus,
  BillResponse,
  Doctor,
  DoctorResponse,
  DoctorUpdate
} from '@/types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080', // Adjust this to your actual API base URL if needed
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
  login: (credentials: LoginRequest) => api.post('/api/auth/login', credentials),
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
  getAllAppointments: () => api.get('/api/appointments'),
  bookAppointment: (appointment: AppointmentRequest) => api.post('/api/appointments/book', appointment),
  getPendingAppointments: () => api.get('/appointments/pending'),
  getAppointmentsByStatus: (status: AppointmentStatus) => api.get(`/api/appointments/${status}`)
};

// Doctor services
export const doctorService = {
  getAllDoctors: () => api.get('/api/doctor'),
  getMyAppointments: () => api.get('/api/doctor/appointments'),
  completeAppointment: (appointmentId: number) => api.put(`/api/doctor/appointments/${appointmentId}/complete`),
  getScheduledAppointments: () => api.get('/api/doctor/appointments/scheduled'),
  registerDoctor: (doctor: DoctorRequest) => api.post('/api/register/doctor', doctor),
  updateDoctor: (doctorId: number, doctorData: DoctorUpdate) =>
    api.put(`/api/doctor/update/${doctorId}`, doctorData),
  joinVideoConsultation: (appointmentId: number) => api.get(`/api/video/join/${appointmentId}`)

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
  getAllSpeciality: () => api.get('/api/speciality'),
  getSpeciality: (id: number) => api.get(`/api/speciality/${id}`),
  updateSpeciality: (name: string, id: number) => api.put(`/api/speciality/${id}/update?name=${name}`),
  addSpeciality: (name: string) => api.post(`/api/speciality/add/${name}`),
  getSpecialityByName: (name: string) => api.get(`/api/speciality/name/${name}`)
};

// Billing services
export const billingService = {
  generateBill: (appointmentId: number, patientId: number, doctorId: number, labFee: number, medicineFee: number) =>
    api.post(`/billing/generate?appointmentId=${appointmentId}&patientId=${patientId}&doctorId=${doctorId}&labFee=${labFee}&medicineFee=${medicineFee}`),
  markAsPaid: (billingId: number) => api.put(`/billing/${billingId}/pay`),
  downloadInvoice: (billingId: number) => api.get(`/billing/${billingId}/download-invoice`, { responseType: 'blob' }),
  getBillByAppointment: (appointmentId: number) => api.get(`/billing/${appointmentId}`)
};

// User services - properly exported
export const userService = {
  getByUsername: (username: string) => api.get(`/api/user/${username}`),
};

export default api;

