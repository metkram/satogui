import axios from 'axios';
import { PUBLIC_API_ENDPOINT } from '$env/static/public';
// import { SatogramPayload } from './types';

const satogram = axios.create({
	baseURL: PUBLIC_API_ENDPOINT

	// TODO: headers?
	// headers: { 'X-Custom-Header': 'foobar' }
});

export async function fetch(url: string, body?: Record<string, unknown>) {
	try {
		console.log({ satogram });
		console.log({ url });
		const res = body ? satogram.post(url, body) : satogram.get(url);
		return res;
	} catch (e) {
		const error = e as Error;
		console.error(error.message);
	}
}

export async function toWhom() {
	return fetch('/api/v1/towhom');
}

export async function createSatogram(payload: any) {
	// returns Promise with payment_request
	return fetch('/api/v1/satogram', payload);
}

export async function satogramDetails(paymentRequest: string) {
	return fetch(`/api/v1/satogram/status/${paymentRequest}`);
}

export async function getStatus(paymentRequest: string) {
	return fetch(`/api/v1/invoice/status/${paymentRequest}`);
}
