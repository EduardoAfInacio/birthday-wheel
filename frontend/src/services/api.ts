import { ParticipateRequest, SpinRequest } from "../types/api";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3000/api';
const NEXT_PUBLIC_PRIZES_ENDPOINT = process.env.NEXT_PUBLIC_PRIZES_ENDPOINT || 'http://localhost:3000/prizes';


export const api = {
    async participate(data: ParticipateRequest) {
        const response = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/participate`, {
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
        const response = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/spin`, {
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
        const response = await fetch(`${NEXT_PUBLIC_PRIZES_ENDPOINT}/getAvailablePrizes`, {
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
    }
}