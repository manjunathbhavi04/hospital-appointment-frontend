
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { DoctorResponse, DoctorUpdate, Speciality } from "@/types";
import { doctorService, specialityService } from "@/services/api";
import { toast } from "sonner";
import { Hospital, Mail, Phone, User } from "lucide-react";

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    consultationFee: 0
  });

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const doctors = await doctorService.getAllDoctors();
        const currentDoctor = doctors.data.find(
          (doctor) => doctor.email === user.email
        );
        
        if (currentDoctor) {
          setDoctor(currentDoctor);
          setFormData({
            fullName: currentDoctor.fullName,
            email: currentDoctor.email,
            phoneNumber: currentDoctor.phoneNumber,
            specialization: currentDoctor.specialization,
            consultationFee: currentDoctor.consultationFee || 0
          });
        }
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        toast.error('Failed to load profile information');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'consultationFee' ? Number(value) : value
    });
  };

  const handleSaveProfile = async () => {
    if (!doctor || !doctor.doctorId) {
      toast.error("Doctor information is missing. Cannot update profile.");
      return;
    }

    try {
      setSaving(true);

      const speciality = await specialityService.getSpecialityByName(formData.specialization)

      const specialityResponse = speciality.data;
      
      const updateData: DoctorUpdate = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        specialization: specialityResponse,
        consultationFee: Number(formData.consultationFee)
      };
      
      const response = await doctorService.updateDoctor(doctor.doctorId, updateData);
      
      // Update local state with the response
      setDoctor({
        ...doctor,
        ...response.data
      });
      
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">Loading profile...</div>
      </DashboardLayout>
    );
  }

  if (!doctor) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <User className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Profile not found</h3>
          <p className="mt-2 text-muted-foreground">
            We couldn't find your doctor profile. Please contact an administrator.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your personal and professional information
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle>{doctor.fullName}</CardTitle>
              <CardDescription>{doctor.specialization}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{doctor.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{doctor.phoneNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <Hospital className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{doctor.specialization}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    Update your personal and professional information
                  </CardDescription>
                </div>
                {editing ? (
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!editing || saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true} // Email cannot be edited
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      disabled={!editing || saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      disabled={!editing || saving}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                  <Input
                    id="consultationFee"
                    name="consultationFee"
                    type="number"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    disabled={!editing || saving}
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Password changes are handled by your administrator
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        disabled={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
