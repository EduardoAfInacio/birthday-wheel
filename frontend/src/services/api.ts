import { ParticipateRequest, SpinRequest } from "../types/api";

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

export const api = {
    async participate(data: ParticipateRequest) {
        const response = await fetch(`${API_URL}/participate`, {
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
        const response = await fetch(`${API_URL}/spin`, {
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
}