import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createSatogram } from '../lib/fetch';
import { SatogramPayload } from '../lib/types';

export const actions: Actions = {
	createSatogram: async ({ request }) => {
		const data = await request.formData();
		const totalAmount = data.get('totalAmount');
		const amountPerSatogram = data.get('amountPerSatogram');
		const maxFees = data.get('maxFees');
		const message = data.get('message');

		const payload: SatogramPayload = {
			total_cost: Number(totalAmount),
			amt_per_satogram: Number(amountPerSatogram),
			max_fees: Number(maxFees),
			message
		};

		try {
			const { data } = (await createSatogram(payload)) || {};
			return data;
		} catch (e) {
			const err = e as Error;
			console.error(err.message);
			throw error(500, err.message);
		}
	}
};
