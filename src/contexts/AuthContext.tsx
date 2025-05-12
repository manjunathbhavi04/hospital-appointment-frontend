
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '@/services/api';
import { toast } from 'sonner';
import { Role, User } from '@/types';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isStaff: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  isDoctor: false,
  isStaff: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = authService.getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await authService.login({ username, password });
      const { token } = response.data;

      // Store token
      localStorage.setItem('token', token);

      // For demo purposes, we'll mock the user data from the token (normally decoded from JWT)
      // In a real app, you'd have an endpoint to get user details or decode the JWT
      const userData: User = {
        userId: 1, // This would be decoded from JWT
        username,
        email: `${username}@example.com`, // This would be decoded from JWT
        role: username.includes('admin') ? Role.ADMIN 
              : username.includes('doctor') ? Role.DOCTOR 
              : username.includes('staff') ? Role.STAFF 
              : Role.PATIENT, // This would be decoded from JWT
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Redirect based on role
      if (userData.role === Role.ADMIN) {
        navigate('/admin/dashboard');
      } else if (userData.role === Role.DOCTOR) {
        navigate('/doctor/dashboard');
      } else if (userData.role === Role.STAFF) {
        navigate('/staff/dashboard');
      } else {
        navigate('/');
      }

      toast.success('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === Role.ADMIN;
  const isDoctor = user?.role === Role.DOCTOR;
  const isStaff = user?.role === Role.STAFF;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isDoctor,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
