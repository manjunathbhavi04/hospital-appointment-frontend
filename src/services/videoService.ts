
import api from './api';

interface CreateRoomResponse {
  url: string;
  name: string;
  privacy: string;
  apiCreated: boolean;
  config?: Record<string, any>;
  createdAt: string;
  expiresAt?: string;
}

export const videoService = {
  // Create a Daily video room
  createVideoRoom: async (appointmentId: number): Promise<CreateRoomResponse> => {
    const response = await api.post('/api/video/create-room', { appointmentId });
    return response.data;
  },
  
  // Get room information for an appointment
  getRoomForAppointment: async (appointmentId: number) => {
    const response = await api.get(`/api/video/room/${appointmentId}`); 
    return response.data;
  },
};
