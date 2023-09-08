<script lang="ts">
	import Icon from '$components/Icon/Icon.svelte';
	import { theme, toggleDarkMode } from '$lib/theme';
	import { onMount } from 'svelte';
	import Accordion, { type AccordionItem } from '../features/Accordion.svelte';
	import { Mood, type ToWhomResponse } from '$lib/types';
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

	$: icon = $theme === 'dark' ? 'sun' : ('moon' as IconName);
	$: paid && browser && confetti.addConfetti({ emojis: ['⚡️'] });

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
	<section class="flex gap-24 justify-between">
		{#if paid}
			<Alert mood={Mood.good} title="Success" closed={!paid} {close}>
				Your satogram has been sent!
			</Alert>
		{:else if !error && form?.payment_request}
			<Invoice bind:error on:paid={handlePaid} invoice={form.payment_request} />
		{:else}
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
					required
				/>
				<Button {loading} type="submit">Create Satogram</Button>
			</form>
		{/if}
		<div class="w-1/2">
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
</style>
