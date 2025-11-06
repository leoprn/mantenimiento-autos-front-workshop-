// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  username: string;
}

export interface RegisterRequest {
  username?: string;
  email: string;
  password: string;
}

// Workshop Types
export interface Workshop {
  id: number;
  userId: number;
  tenantId: string;
  name: string;
  address: string;
  phoneNumber: string;
}

export interface UpdateWorkshopRequest {
  name: string;
  address: string;
  phoneNumber: string;
}

// Error Types
export interface ApiError {
  error?: string;
  message?: string;
  timestamp?: string;
  path?: string;
}

// Onboarding Wizard Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
}

export interface CompleteOnboardingRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  categoryId: number;
  serviceIds: number[];
  logo?: File;
  photos?: File[];
}

export interface OnboardingStatus {
  isComplete: boolean;
  completedSteps: string[];
  missingSteps: string[];
}

// Extended Workshop with onboarding data
export interface WorkshopExtended extends Workshop {
  logoUrl?: string;
  photos?: string[];
  latitude?: number;
  longitude?: number;
  categoryId?: number;
  serviceIds?: number[];
}

