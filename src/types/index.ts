
export enum AppointmentMode {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE"
}

export enum AppointmentStatus {
  PENDING = "PENDING",
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED"
}

export enum Role {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  STAFF = "STAFF",
  ADMIN = "ADMIN"
}

export interface User {
  userId: number;
  username: string;
  email: string;
  role: Role;
}

export interface Patient {
  patientId: number;
  name: string;
  email: string;
  phone: string;
}

export interface Doctor {
  doctorId: number;
  fullName: string;
  specialization: string;
  phoneNumber: string;
  consultationFee: number;
  user?: User;
}

export interface Staff {
  staffId: number;
  fullName: string;
  department: string;
  phoneNumber: string;
  user?: User;
}

export interface Appointment {
  id: number;
  scheduledTime: string;
  mode: AppointmentMode;
  problemDescription: string;
  status: AppointmentStatus;
  patient: Patient;
  doctor?: Doctor;
}

export interface AppointmentResponse {
  id: number;
  doctorId?: number;
  doctorName?: string;
  patientId: number;
  patientName: string;
  appointmentDateTime: string;
  status: AppointmentStatus;
  reason?: string;
  problemDescription: string;
}

export interface AppointmentRequest {
  patientName: string;
  patientEmail: string;
  patientNumber: string;
  mode: AppointmentMode;
  problemDescription: string;
  appointmentDateTime: string;
}

export interface Billing {
  billingId: number;
  patient: Patient;
  doctor: Doctor;
  billingDate: string;
  consultationFee: number;
  labFee: number;
  medicineFee: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
}

export interface Speciality {
  id: number;
  keyword?: string;
  name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
}

export interface AssignDoctorRequest {
  appointmentId: number;
  doctorId: number;
}

export interface DoctorRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  specialization: string;
  phone: string;
  consultationFee: number;
}

export interface StaffRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  department: string;
  phone: string;
}

export interface DoctorResponse {
  doctorId: number;
  fullName: string;
  specialization: string;
  phoneNumber: string;
  email: string;
}

export interface StaffResponse {
  id: number;
  fullName: string;
  department: string;
  phoneNumber: string;
  email: string;
}

export interface SpecialityResponse {
  id: number;
  name: string;
}
