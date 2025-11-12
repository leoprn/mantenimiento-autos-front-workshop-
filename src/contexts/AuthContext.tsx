import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import { LoginRequest, LoginResponse, RegisterRequest, TokenPayload } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  user: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);

  const decodeToken = (token: string): TokenPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        return null;
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(
        decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
      );
      return payload;
    } catch (error) {
      console.error('Error al decodificar el token JWT', error);
      return null;
    }
  };

  const hasWorkshopRole = (payload?: TokenPayload | null) => {
    const role = payload?.role;
    if (!role) {
      return false;
    }
    return role === 'WORKSHOP' || role === 'ROLE_WORKSHOP';
  };

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      const payload = decodeToken(token);
      if (!hasWorkshopRole(payload)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoading(false);
        return;
      }
      setIsAuthenticated(true);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const identifier = credentials.username ?? credentials.email ?? '';
    const normalizedCredentials: LoginRequest = identifier.includes('@')
      ? { email: identifier, password: credentials.password }
      : { username: identifier, password: credentials.password };

    const response: LoginResponse = await apiService.login(normalizedCredentials);
    const payload = decodeToken(response.accessToken);

    if (!hasWorkshopRole(payload)) {
      const role = payload?.role || 'desconocido';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(
        role === 'ADMIN' || role === 'ROLE_ADMIN'
          ? 'Tu cuenta es de administrador. Ingresá al panel de administración para continuar.'
          : 'Tu cuenta no pertenece a un comercio. Ingresá con un usuario de tipo WORKSHOP para acceder a este panel.'
      );
    }

    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('user', response.username);
    setIsAuthenticated(true);
    setUser(response.username);
  };

  const register = async (data: RegisterRequest) => {
    await apiService.registerWorkshop(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

