<script lang="ts">
	import QRCode from 'qrcode';
	import Button from '$components/Button.svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import Spinner from './Spinner.svelte';
	import { PaymentStatus } from '$lib/types';
	import { PUBLIC_API_ENDPOINT } from '$env/static/public';

	interface $$Events {
		paid: CustomEvent;
		error: CustomEvent<Error>;
	}

	const dispatch = createEventDispatcher();

	const MAX_CHECK_ATTEMPTS = 100;
	const POLL_INTERVAL = 3000;

	let checkAttempts = 0;
	let polling = false;
	let copyInterval: NodeJS.Timeout;
	let pollInterval: NodeJS.Timeout;

	export let invoice: string;
	export let paid = false;
	export let error: Error | null;

	function createQRCode() {
		const canvas = document.getElementById('canvas');
		QRCode.toCanvas(canvas, invoice as string, (err: unknown) => {
			if (err) {
				console.error(err);
				dispatch('error', err as Error);
			}
		});
		polling = true;
	}

	async function pollForPayment() {
		if (checkAttempts < MAX_CHECK_ATTEMPTS) {
			try {
				const result = await fetch(`${PUBLIC_API_ENDPOINT}/api/v1/invoice/status/${invoice}`);
				if (!result.ok) {
					throw new Error(result.statusText);
				}
				if (result) {
					const data = await result.json();
					const { Status } = data;
					if (Status === PaymentStatus.SETTLED) {
						paid = true;
						polling = false;
						clearTimeout(pollInterval);
						clearTimeout(copyInterval);
						dispatch('paid');
					}
				}
				pollInterval = setTimeout(pollForPayment, POLL_INTERVAL);
				checkAttempts++;
			} catch (e) {
				console.error(e);
				dispatch('error', e as Error);
				polling = false;
			}
		} else if (checkAttempts > MAX_CHECK_ATTEMPTS) {
			checkAttempts = 0;
			dispatch('error', new Error('Too many attempts. Please try again.'));
			polling = false;
		}
	}

	function copy() {
		navigator.clipboard.writeText(invoice || '');
		copyInterval = setTimeout(() => {}, 4000);
	}

	$: polling && !paid && pollForPayment();
	onMount(createQRCode);
	onDestroy(() => clearTimeout(pollInterval));
</script>

{#if !error}
	<div class="flex flex-col gap-4 items-center">
		<canvas id="canvas" />
		<Spinner />
		<p>Waiting for payment...</p>
		<Button on:click={copy}>Copy Invoice</Button>
	</div>
{/if}
