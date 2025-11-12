// Auth Types
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  username: string;
}

export interface TokenPayload {
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
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
  latitude?: number;
  longitude?: number;
  categoryId?: string;
  serviceIds?: string[];
  logoUrl?: string;
  photos?: string[];
  onboardingCompleted?: boolean;
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
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  icon?: string;
}

export interface CompleteOnboardingRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  categoryId: string;
  serviceIds: string[];
  logo?: File;
  photos?: File[];
}

export interface OnboardingStatus {
  isComplete: boolean;
  completedSteps: string[];
  missingSteps: string[];
}

export interface WorkshopOnboardingStatus {
  onboardingCompleted: boolean;
  categoryId?: string;
  serviceIds: string[];
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  photoUrls: string[];
  missingSteps: string[];
}

export interface UserStatusResponse {
  username: string;
  email: string;
  role?: string;
  isAdmin: boolean;
  hasAdminPrivileges: boolean;
  status?: string;
}

export interface WorkshopOnboardingDraftRequest {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  categoryId?: string;
  serviceIds?: string[];
  logoUrl?: string;
  photoUrls?: string[];
}

// Extended Workshop with onboarding data
export interface WorkshopExtended extends Workshop {
  logoUrl?: string;
  photos?: string[];
  latitude?: number;
  longitude?: number;
  categoryId?: string;
  serviceIds?: string[];
}

