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

