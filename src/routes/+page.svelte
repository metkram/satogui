<script lang="ts">
	import Icon from '$components/Icon/Icon.svelte';
	import { theme, toggleDarkMode } from '$lib/theme';
	import { onMount } from 'svelte';
	import Accordion, { type AccordionItem } from '../features/Accordion.svelte';
	import { Mood, type SatogramDetailsPayload, type ToWhomResponse } from '$lib/types';
	import Button from '$components/Button.svelte';
	import Invoice from '$components/Invoice.svelte';
	import Alert from '$components/Alert.svelte';
	import type { IconName } from '$components/Icon/icons';
	import JSConfetti from 'js-confetti';
	import { browser } from '$app/environment';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';

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
	let satogramStatus: SatogramDetailsPayload;
	let lookupInvoice: string;
	let invoice: string;

	// Satogram form
	let totalAmount: number;
	let amountPerSatogram: number;
	let maxFees: number;
	let message: string;

	$: icon = $theme === 'dark' ? 'sun' : ('moon' as IconName);
	$: console.log({ $theme });
	$: paid && browser && confetti.addConfetti({ emojis: ['💌'] });

	async function getSatogramStatus(paymentRequest: string) {
		if (!paymentRequest) {
			return;
		}
		try {
			loading = true;
			const result = await fetch(
				`${PUBLIC_API_ENDPOINT}/api/v1/satogram/status/${paymentRequest}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);
			satogramStatus = await result.json();
		} catch (e) {
			console.error(e);
			error = e as Error;
			loading = false;
		} finally {
			loading = false;
		}
	}

	async function fetchToWhom() {
		try {
			loading = true;
			const result = await fetch(`${PUBLIC_API_ENDPOINT}/api/v1/towhom`);
			toWhom = await result.json();
		} catch (e) {
			console.error(e);
			error = e as Error;
			loading = false;
		} finally {
			loading = false;
		}
	}

	async function createSatogram() {
		if (!totalAmount || !message) {
			return;
		}
		try {
			loading = true;
			const result = await fetch(`${PUBLIC_API_ENDPOINT}/api/v1/satogram`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					total_cost: totalAmount,
					amt_per_satogram: amountPerSatogram,
					max_fees: maxFees,
					message
				})
			});
			invoice = (await result.json()).payment_request;
		} catch (e) {
			console.error(e);
			error = e as Error;
			loading = false;
		} finally {
			loading = false;
		}
	}

	function close() {
		error = null;
		loading = false;
		paid = false;
	}

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
		{#if error}
			<Alert mood={Mood.bad} title="Error" closed={!error} {close}>
				{error}
			</Alert>
		{/if}
	</section>
	<section class="flex flex-col gap-4 items-center">
		{#if paid}
			<Alert mood={Mood.good} title="Success" closed={!paid} {close}>
				Your satogram has been sent!
			</Alert>
		{:else if !error && invoice}
			<div>
				<Invoice bind:error on:paid={handlePaid} {invoice} />
				<ul class="break-all text-xl mt-8">
					<li>
						<strong>Message: </strong>
						<span>{message}</span>
					</li>
					<li>
						<strong>Amount Per Satogram: </strong>
						<span>{amountPerSatogram}</span>
					</li>
					<li>
						<strong>Max Fees: </strong>
						<span>{maxFees}</span>
					</li>
					<li>
						<strong>Total Cost: </strong>
						<span>{totalAmount}</span>
					</li>
				</ul>
			</div>
		{:else}
			<form class="flex flex-col w-1/2 justify-center">
				<label for="totalAmount">Total Cost (sats)</label>
				<input
					type="number"
					min="1"
					max="250000"
					placeholder="Total cost (amount you will pay)"
					name="totalAmount"
					required
					bind:value={totalAmount}
				/>
				<label for="amount">Amount Per Satogram</label>
				<input
					type="number"
					min="1"
					max="10000"
					placeholder="Enter amount to send each node"
					name="amountPerSatogram"
					bind:value={amountPerSatogram}
				/>
				<label for="fees">Max Fees</label>
				<input
					type="number"
					min="1"
					max="10000"
					placeholder="Don't pay fees above this amount"
					name="maxFees"
					bind:value={maxFees}
				/>
				<label for="message">Message</label>
				<input
					type="text"
					placeholder="What do you want your satogram to say?"
					name="message"
					maxlength="800"
					required
					bind:value={message}
				/>
				<Button {loading} on:click={createSatogram} type="submit">Create Satogram</Button>
			</form>
			{#if toWhom}
				<div
					class="break-all flex justify-center border border-gray-500 rounded-md bg-gray-200 dark:bg-transparent"
				>
					<pre>{JSON.stringify(toWhom, null, 2)}</pre>
				</div>
			{/if}
			{#if satogramStatus}
				{JSON.stringify(satogramStatus)}
			{/if}
			<strong>OR</strong>
			<p>Create a new satogram</p>
			<section>
				<form class="flex flex-col justify-center">
					<label for="lookup">Enter your previous payment request to lookup the invoice</label>
					<input
						disabled={loading}
						type="text"
						placeholder="lnbc..."
						bind:value={lookupInvoice}
						required
					/>
					<Button {loading} on:click={() => getSatogramStatus(lookupInvoice)} type="submit"
						>Lookup</Button
					>
				</form>
			</section>
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
