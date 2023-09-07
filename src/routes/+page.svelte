<script lang="ts">
	import Accordion, { type AccordionItem } from '../features/Accordion.svelte';

	let accordionItems: AccordionItem[] = [
		{
			title: 'faq1',
			content: 'faq1 content'
		},
		{
			title: 'Who can I and can I not send this to?',
			content:
				"Wallet of Satoshi, Blue Wallet, Breez, Phoenix, Zap, Muun, and more!\n\nBut you can't send this to Strike, Cashapp"
		},
		{
			title: 'faq1',
			content: 'faq1 content'
		},
		{
			title: 'faq1',
			content: 'faq1 content'
		}
	];
</script>

<div class="flex flex-col gap-8">
	<section class="flex gap-4 items-center mt-8">
		<img src="/satogram_logo_only.jpg" alt="Satogram Envelope" class="w-48" />
		<h1 class="text-8xl">Satogram</h1>
	</section>
	<section>
		<h2 class="text-4xl">Send messages to the whole lightning network!</h2>
	</section>
	<section class="flex gap-24 justify-between">
		<form class="flex flex-col w-96 justify-center" method="post" action="?/getinvoice">
			<label for="budget">Total Cost (sats)</label>
			<input
				type="number"
				min="1"
				max="250000"
				placeholder="Total cost (amount you will pay)"
				name="totalAmount"
				required
			/>
			<label for="amount">Amount Per Satogram</label>
			<input
				type="number"
				min="1"
				max="10000"
				placeholder="Enter amount to send each node"
				name="amountPerSatogram"
			/>
			<label for="fees">Max Fees</label>
			<input
				type="number"
				min="1"
				max="10000"
				placeholder="Don't pay fees above this amount"
				name="maxFees"
			/>
			<label for="message">Message</label>
			<input
				type="text"
				placeholder="What do you want your satogram to say?"
				name="message"
				required
			/>
			<button
				class="p-4 mt-4 bg-[#e71921] text-white rounded hover:bg-red-700 transition-all"
				type="submit"
			>
				Create Satogram
			</button>
		</form>
		<Accordion items={accordionItems} />
	</section>
</div>

<style lang="postcss">
	/* Translate the above input css to tailwind */
	input {
		@apply border border-gray-300 rounded py-2 px-4;
		@apply text-gray-700 leading-tight focus:outline-none;
		@apply focus:bg-white focus:border-gray-500;
	}
</style>
