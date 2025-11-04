import axios, { AxiosInstance, AxiosError } from 'axios';
import { LoginRequest, LoginResponse, RegisterRequest, Workshop, UpdateWorkshopRequest, ApiError } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar el token a las peticiones
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Token inválido o expirado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/api/v1/auth/login', credentials);
    return response.data;
  }

  async registerWorkshop(data: RegisterRequest): Promise<void> {
    await this.api.post('/api/v1/auth/register/workshop', data);
  }

  // Workshop endpoints
  async getWorkshop(): Promise<Workshop> {
    const response = await this.api.get<Workshop>('/api/v1/workshops');
    return response.data;
  }

  async getWorkshopById(id: number): Promise<Workshop> {
    const response = await this.api.get<Workshop>(`/api/v1/workshops/${id}`);
    return response.data;
  }

  async updateWorkshop(id: number, data: UpdateWorkshopRequest): Promise<Workshop> {
    const response = await this.api.put<Workshop>(`/api/v1/workshops/${id}`, data);
    return response.data;
  }
}

export const apiService = new ApiService();

