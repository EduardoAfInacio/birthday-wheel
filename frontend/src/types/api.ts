export interface Prize {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  color?: string; 
  price: string;
}

export interface ParticipateRequest {
  name: string;
  email: string;
  phone: string;
  store: string;
  qrTokenCode: string; 
}

export interface ParticipateResponse {
  id: string; 
  qrTokenCode: string;
  userId: string;
  userName: string;
  hasSpun: boolean;
  prize: Prize | null;
}

export interface SpinRequest {
  userId: string;
  qrTokenCode: string;
}

export interface SpinResponse {
  success: boolean;
  prizeIndex: number;
  wonPrize: Prize;
  allPrizes: Prize[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    email: string;
  };
}

export interface User {
    name: string;
    email: string;
    phone: string;
    storeName: string;
}

export interface WinnerSession {
  id: string;
  spunAt: string; 
  user: User;
  prize: Prize; 
}

export interface WinnersResponse {
  data: WinnerSession[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}