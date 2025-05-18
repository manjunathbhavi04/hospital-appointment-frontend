
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, userService } from '@/services/api';
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
    console.log("was here");
    try {
      setLoading(true);
      console.log("was here 1");
      const response = await authService.login({ username, password });
      console.log("was here 2");
      const { token } = response.data;

      // Store token
      localStorage.setItem('token', token);

      // For demo purposes, we'll mock the user data from the token (normally decoded from JWT)
      // In a real app, you'd have an endpoint to get user details or decode the JWT
      console.log("was here");
      const userResponse = await userService.getByUsername(username);
      const userData: User = userResponse.data;

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
