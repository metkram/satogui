import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { toWhom } from '../../../lib/fetch';

export const GET: RequestHandler = async function (): Promise<Response> {
	try {
		const { data } = (await toWhom()) || {};
		return json(data);
	} catch (e) {
		const err = e as Error;
		console.error(err.message);
		throw error(500, err.message);
	}
};
