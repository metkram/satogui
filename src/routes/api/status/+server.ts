import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async function ({ url }): Promise<Response> {
	try {
		const invoice = url.searchParams.get('invoice');
		// const res = (await getStatus(invoice)) || {};
		// return json(res);
		return json({ data: { paid: true } });
	} catch (e) {
		const err = e as Error;
		console.error(err.message);
		throw error(500, err.message);
	}
};
