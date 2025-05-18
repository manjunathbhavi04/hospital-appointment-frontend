
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [hospitalName, setHospitalName] = useState("HealthCare Medical Center");
  const [hospitalEmail, setHospitalEmail] = useState("contact@healthcare.com");
  const [hospitalPhone, setHospitalPhone] = useState("123-456-7890");
  const [hospitalAddress, setHospitalAddress] = useState("123 Medical Lane, Health City, HC 12345");

  const handleSaveGeneralSettings = () => {
    toast.success("General settings saved successfully");
  };

  const handleSaveNotificationSettings = () => {
    toast.success("Notification settings saved successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your hospital system settings and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Information</CardTitle>
                <CardDescription>
                  Update your hospital's basic information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input 
                    id="hospitalName" 
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="hospitalEmail">Contact Email</Label>
                  <Input 
                    id="hospitalEmail" 
                    type="email"
                    value={hospitalEmail}
                    onChange={(e) => setHospitalEmail(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="hospitalPhone">Contact Phone</Label>
                  <Input 
                    id="hospitalPhone" 
                    value={hospitalPhone}
                    onChange={(e) => setHospitalPhone(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="hospitalAddress">Address</Label>
                  <Input 
                    id="hospitalAddress" 
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleSaveGeneralSettings} className="mt-6">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how notifications are sent to staff and patients.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send appointment reminders and updates via email.
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications" className="text-base">
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send appointment reminders and updates via SMS.
                    </p>
                  </div>
                  <Switch 
                    id="smsNotifications" 
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                
                <Button onClick={handleSaveNotificationSettings} className="mt-6">
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and maintenance options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Database Backup</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a backup of your hospital data. Backups will be stored securely.
                    </p>
                    <Button variant="outline">Create Backup</Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">System Maintenance</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Run maintenance tasks to optimize system performance.
                    </p>
                    <Button variant="outline">Run Maintenance</Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Clear Cache</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Clear system cache to free up resources.
                    </p>
                    <Button variant="outline">Clear Cache</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
