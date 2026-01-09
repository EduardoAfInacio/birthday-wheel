export interface Prize {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  color?: string;
  price: string;
}

export interface ParticipateResponseDto {
  id: string; 
  qrTokenCode: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  hasSpun: boolean;
  prize: Prize | null;
}

export interface SpinResponseDto {
  success: boolean;
  prizeIndex: number;
  wonPrize: Prize;
  allPrizes: Prize[];
}

export interface ParticipateRequestDto {
  name: string;
  email: string;
  phone: string;
  store: string;
  qrTokenCode: string;
}

export interface SpinRequestDto {
  userId: string;
  qrTokenCode: string;
}