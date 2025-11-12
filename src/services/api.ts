import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Workshop,
  UpdateWorkshopRequest,
  ApiError,
  Category,
  Service,
  WorkshopOnboardingStatus,
  CompleteOnboardingRequest,
  UserStatusResponse,
  WorkshopOnboardingDraftRequest,
} from '../types';

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
    const response = await this.api.post<LoginResponse>('/api/v1/auth/login/workshop', credentials);
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

  async getCategories(): Promise<Category[]> {
    const response = await this.api.get<Category[]>('/api/v1/services/categories');
    return response.data;
  }

  async getServices(): Promise<Service[]> {
    const response = await this.api.get<Service[]>('/api/v1/services');
    return response.data;
  }

  async getOnboardingStatus(): Promise<WorkshopOnboardingStatus> {
    const response = await this.api.get<WorkshopOnboardingStatus>('/api/v1/workshops/onboarding/status');
    return response.data;
  }

  async saveOnboardingDraft(payload: WorkshopOnboardingDraftRequest): Promise<WorkshopOnboardingStatus> {
    const response = await this.api.put<WorkshopOnboardingStatus>('/api/v1/workshops/onboarding/draft', payload);
    return response.data;
  }

  async completeOnboarding(payload: CompleteOnboardingRequest): Promise<WorkshopOnboardingStatus> {
    const response = await this.api.post<WorkshopOnboardingStatus>('/api/v1/workshops/onboarding/complete', this.withoutFiles(payload));
    return response.data;
  }

  async getUserPermissions(): Promise<UserStatusResponse> {
    const response = await this.api.get<UserStatusResponse>('/api/v1/auth/me/permissions');
    return response.data;
  }

  private withoutFiles(payload: CompleteOnboardingRequest) {
    return {
      name: payload.name,
      address: payload.address,
      latitude: payload.latitude,
      longitude: payload.longitude,
      categoryId: payload.categoryId,
      serviceIds: payload.serviceIds,
      logoUrl: payload.logo ? payload.logo.name : undefined,
      photoUrls: payload.photos ? payload.photos.map((file) => file.name) : [],
    };
  }
}

export const apiService = new ApiService();

