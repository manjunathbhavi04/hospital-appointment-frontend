
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Role } from "@/types";

// Public Pages
import HomePage from "@/pages/HomePage";
import ContactPage from "@/pages/ContactPage";
import AppointmentBookingPage from "@/pages/AppointmentBookingPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminDoctorsPage from "@/pages/admin/AdminDoctorsPage";
import AdminStaffPage from "@/pages/admin/AdminStaffPage";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage";
// import AdminInvoicesPage from "@/pages/admin/AdminInvoicesPage";
import AdminInvoicesPage from "./pages/admin/AdminInvoicesPage";
// import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

// Doctor Pages
import DoctorDashboardPage from "@/pages/doctor/DoctorDashboardPage";
// import DoctorAppointmentsPage from "@/pages/doctor/DoctorAppointmentsPage";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointmentsPage";
// import DoctorPatientsPage from "@/pages/doctor/DoctorPatientsPage";
import DoctorPatientsPage from "./pages/doctor/DoctorPatientsPage";
// import DoctorProfilePage from "@/pages/doctor/DoctorProfilePage";
import DoctorProfilePage from "./pages/doctor/DoctorProfilePage";

// Staff Pages
import StaffDashboardPage from "@/pages/staff/StaffDashboardPage";
// import StaffAppointmentsPage from "@/pages/staff/StaffAppointmentsPage";
import StaffAppointmentsPage from "./pages/staff/StaffAppointmentsPage";
// import StaffAssignPage from "@/pages/staff/StaffAssignPage";
import StaffAssignPage from "./pages/staff/StaffAssignPage";
// import StaffReportsPage from "@/pages/staff/StaffReportsPage";
import StaffReportsPage from "./pages/staff/StaffReportsPage";
import VideoConsultationPage from "./pages/doctor/VideoConsultationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/appointments" element={<AppointmentBookingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <AdminDoctorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <AdminStaffPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <AdminAppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/invoices"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <AdminInvoicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <AdminSettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
                  <DoctorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/doctor/video-consultation/:appointmentId" element={<VideoConsultationPage />} />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
                  <DoctorAppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patients"
              element={
                <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
                  <DoctorPatientsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/profile"
              element={
                <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
                  <DoctorProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Staff Routes */}
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute allowedRoles={[Role.STAFF]}>
                  <StaffDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/appointments"
              element={
                <ProtectedRoute allowedRoles={[Role.STAFF]}>
                  <StaffAppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/assign"
              element={
                <ProtectedRoute allowedRoles={[Role.STAFF]}>
                  <StaffAssignPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/reports"
              element={
                <ProtectedRoute allowedRoles={[Role.STAFF]}>
                  <StaffReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route - 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
