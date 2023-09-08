<script lang="ts">
	import QRCode from 'qrcode';
	import Button from '$components/Button.svelte';
	import { onDestroy, onMount } from 'svelte';
	import Spinner from './Spinner.svelte';

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
				error = err as Error;
			}
		});
		polling = true;
	}

	async function pollForPayment() {
		if (checkAttempts < MAX_CHECK_ATTEMPTS) {
			try {
				const result = await fetch(`/api/status?invoice=${invoice}`);
				if (!result.ok) {
					throw new Error(result.statusText);
				}
				if (result) {
					const { data } = await result.json();
					if (data && data.paid) {
						paid = true;
						polling = false;
						clearTimeout(pollInterval);
						clearTimeout(copyInterval);
					}
				}
				pollInterval = setTimeout(pollForPayment, POLL_INTERVAL);
				checkAttempts++;
			} catch (e) {
				console.error(e);
				error = e as Error;
				polling = false;
			}
		} else if (checkAttempts > MAX_CHECK_ATTEMPTS) {
			checkAttempts = 0;
			error = new Error('Timeout, too many checks');
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
