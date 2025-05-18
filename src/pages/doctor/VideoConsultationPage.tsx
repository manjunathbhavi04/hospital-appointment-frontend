
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { videoService } from "@/services/videoService";

export default function VideoConsultationPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!appointmentId) {
        setError("No appointment ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await videoService.getRoomForAppointment(Number(appointmentId));
        if (response && response.url) {
          setRoomUrl(response.url);
        } else {
          // If no room exists, create one
          const newRoom = await videoService.createVideoRoom(Number(appointmentId));
          if (newRoom && newRoom.url) {
            setRoomUrl(newRoom.url);
          } else {
            setError("Failed to create video room");
          }
        }
      } catch (err) {
        console.error("Error fetching video room:", err);
        setError("Failed to set up video consultation");
        toast.error("Failed to set up video consultation");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [appointmentId]);

  const handleBackToAppointments = () => {
    navigate("/doctor/appointments");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Video Consultation</h1>
            <p className="text-muted-foreground">
              Appointment #{appointmentId}
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToAppointments}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Appointments
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center p-10">
              <div className="text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-blue-500 animate-pulse" />
                <p>Setting up video consultation...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="flex items-center justify-center p-10">
              <div className="text-center">
                <VideoOff className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <p className="text-red-500 font-medium">{error}</p>
                <Button className="mt-4" onClick={handleBackToAppointments}>
                  Return to Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : roomUrl ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Join Video Call</CardTitle>
                <CardDescription>
                  Click the button below to join the video consultation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Button
                    className="flex items-center px-6 py-5 text-lg"
                    onClick={() => window.open(roomUrl, "_blank")}
                  >
                    <Video className="h-5 w-5 mr-2" />
                    Join Video Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ensure your camera and microphone are working properly</li>
                  <li>Use a stable internet connection for the best experience</li>
                  <li>The consultation link is valid only for this appointment</li>
                  <li>Close other applications to improve video quality</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center p-10">
              <div className="text-center">
                <VideoOff className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <p>No video room found for this appointment</p>
                <Button className="mt-4" onClick={handleBackToAppointments}>
                  Return to Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
