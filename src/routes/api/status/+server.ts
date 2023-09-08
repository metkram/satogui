import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStatus } from '../../../lib/fetch';

export const GET: RequestHandler = async function ({ url }): Promise<Response> {
	try {
		const invoice = url.searchParams.get('invoice');
		const res = (await getStatus(invoice)) || {};
		return json(res);
	} catch (e) {
		const err = e as Error;
		console.error(err.message);
		throw error(500, err.message);
	}
};
