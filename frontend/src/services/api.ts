import { 
  ParticipateRequest, 
  SpinRequest, 
  LoginRequest,     
  LoginResponse,    
  WinnersResponse  
} from "../types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3000';


export const api = {
    async participate(data: ParticipateRequest) {
        const response = await fetch(`${BASE_URL}/api/participate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if(!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to participate');
        }

        return response.json(); 
    },

    async spin(data : SpinRequest) {
        const response = await fetch(`${BASE_URL}/api/spin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if(!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to spin the wheel');
        }

        return response.json();
    },

    async getPrizes() {
        const response = await fetch(`${BASE_URL}/prizes/getAvailablePrizes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if(!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Stock is empty');
        }

        return response.json();
    },

    async adminLogin(data: LoginRequest): Promise<LoginResponse> {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if(!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    async getWinners(token: string, page = 1, limit = 2): Promise<WinnersResponse> {
        const response = await fetch(`${BASE_URL}/sessions/winners?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if(response.status === 401) {
            throw new Error("Unauthorized");
        }

        if(!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch winners');
        }

        return response.json();
    }
}