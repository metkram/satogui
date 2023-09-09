<script lang="ts">
	import Icon from '$components/Icon/Icon.svelte';
	import { theme, toggleDarkMode } from '$lib/theme';
	import { onMount } from 'svelte';
	import Accordion, { type AccordionItem } from '../features/Accordion.svelte';
	import { Mood, type SatogramDetailsPayload, type ToWhomResponse } from '$lib/types';
	import type { ActionData, PageData } from './$types.js';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Button from '$components/Button.svelte';
	import Invoice from '$components/Invoice.svelte';
	import Alert from '$components/Alert.svelte';
	import type { IconName } from '$components/Icon/icons';
	import JSConfetti from 'js-confetti';
	import { browser } from '$app/environment';

	export let form: ActionData;

	let accordionItems: AccordionItem[] = [
		{
			title: 'What is this?',
			content: 'lorem ipsum dolor sit amet. lorem ipsum dolor sit amet. lorem ipsum dolor sit amet.'
		},
		{
			title: 'Who can I send this to?',
			content:
				"Any node who has keysend enabled. Wallet of Satoshi, Blue Wallet, Breez, Phoenix, Zap, Muun, and more!\n\nBut you can't send this to Strike, Cashapp"
		},
		{
			title: 'Why would I do this?',
			content: 'faq1 content'
		},
		{
			title: 'What else you wanna know?',
			content: 'faq1 content'
		}
	];

	let error: Error | null;
	let toWhom: ToWhomResponse;
	let loading = false;
	let paid = false;
	let confetti: JSConfetti;
	let satogramDetails: SatogramDetailsPayload;
	let lookupInvoice: string;

	$: icon = $theme === 'dark' ? 'sun' : ('moon' as IconName);
	$: paid && browser && confetti.addConfetti({ emojis: ['💌'] });
	$: invoice = form?.payment_request;
	$: invoice && getSatogramStatus(invoice);

	async function getSatogramStatus(paymentRequest: string) {
		try {
			const result = await fetch(`/api/satogram_status?invoice=${paymentRequest}`);
			satogramDetails = await result.json();
		} catch (e) {
			console.error(e);
			error = e as Error;
			loading = false;
		}
	}

	async function fetchToWhom() {
		try {
			const result = await fetch('/api/towhom');
			toWhom = await result.json();
		} catch (e) {
			console.error(e);
			error = e as Error;
			loading = false;
		}
	}

	function close() {
		error = null;
		form = null;
		loading = false;
		paid = false;
	}

	const onSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			await setTimeout(async () => {
				await update({ reset: false });
				loading = false;
			}, 1000);
		};
	};

	function handlePaid() {
		paid = true;
	}

	onMount(() => {
		fetchToWhom();
		confetti = new JSConfetti();
	});
</script>

<div class="flex flex-col gap-8">
	<section class="flex items-center justify-between mt-8">
		<div class="flex gap-4 items-baseline">
			<img src="/satogram_logo_only.jpg" alt="Satogram Envelope" class="w-48" />
			<h1 class="text-8xl">Satogram</h1>
		</div>
		<div>
			<button on:click={toggleDarkMode}><Icon name={icon} /></button>
		</div>
	</section>
	<section>
		<h2 class="text-4xl">Send messages to the whole lightning network!</h2>
	</section>
	<section>
		{#if form?.error || error}
			<Alert mood={Mood.bad} title="Error" closed={!error} {close}>
				{form?.error || error}
			</Alert>
		{/if}
	</section>
	<section class="flex flex-col justify-center">
		<label for="lookup">Enter your previous payment request to lookup the invoice</label>
		<input type="text" placeholder="lnbc..." bind:value={lookupInvoice} />
	</section>
	<section class="flex flex-col gap-4 items-center">
		{#if paid}
			<Alert mood={Mood.good} title="Success" closed={!paid} {close}>
				Your satogram has been sent!
			</Alert>
		{:else if !error && invoice}
			<div>
				<Invoice bind:error on:paid={handlePaid} {invoice} />
				{#if satogramDetails}
					{@const { satogram_payload } = satogramDetails}
					{@const { total_cost, amt_per_satogram, max_fees, message } = satogram_payload}
					<ul class="break-all text-xl mt-8">
						<li>
							<strong>Message: </strong>
							<span>{message}</span>
						</li>
						<li>
							<strong>Amount Per Satogram: </strong>
							<span>{amt_per_satogram}</span>
						</li>
						<li>
							<strong>Max Fees: </strong>
							<span>{max_fees}</span>
						</li>
						<li>
							<strong>Total Cost: </strong>
							<span>{total_cost}</span>
						</li>

						<!-- <p></p>
						<p><strong>Amount Per Satogram: </strong><span>{amt_per_satogram}</span></p>
						<p><strong>Max Fees: </strong><span>{max_fees}</span></p>
						<p><strong>Total Cost: </strong><span>{total_cost}</span></p> -->
					</ul>
				{/if}
			</div>
		{:else}
			<strong>OR</strong>
			<p>create a new satogram</p>
			<form
				class="flex flex-col w-1/2 justify-center"
				method="post"
				action="?/createSatogram"
				use:enhance={onSubmit}
			>
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
					maxlength="800"
					required
				/>
				<Button {loading} type="submit">Create Satogram</Button>
			</form>
		{/if}
		<div>
			<Accordion items={accordionItems} />
		</div>
	</section>
</div>

<style lang="postcss">
	/* Translate the above input css to tailwind */
	input {
		@apply border border-gray-300 rounded py-2 px-4;
		@apply dark:text-gray-300 leading-tight focus:outline-none;
		@apply focus:border-gray-500 dark:bg-blue-950;
	}
	ul {
		@apply flex flex-col gap-4;
	}
	ul > li {
		@apply flex justify-between;
	}
	ul strong {
		@apply min-w-fit mr-4;
	}
</style>
