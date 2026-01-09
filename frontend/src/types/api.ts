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