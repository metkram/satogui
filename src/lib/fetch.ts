import axios from 'axios';
import https from 'https';
import { API_ENDPOINT } from '$env/static/private';

const satogram = axios.create({
	baseURL: API_ENDPOINT,
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
	// TODO: headers?
	// headers: { 'Grpc-Metadata-Macaroon': MACAROON }
});

export async function fetch(url: string, body?: Record<string, unknown>) {
	console.log({ API_ENDPOINT });
	try {
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
