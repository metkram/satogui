import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
export const actions: Actions = {
	getinvoice: async ({ request }) => {
		const data = await request.formData();
		const totalAmount = data.get('totalAmount');
		const amountPerSatogram = data.get('amountPerSatogram');
		const maxFees = data.get('maxFees');
		const message = data.get('message');

		console.log({ totalAmount, amountPerSatogram, maxFees, message });

		try {
			return { settled: true };
		} catch (e) {
			const err = e as Error;
			console.error(err.message);
			throw error(500, err.message);
		}
	}
};
