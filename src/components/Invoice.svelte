<script lang="ts">
	import QRCode from 'qrcode';
	import Button from '$components/Button.svelte';
	import { onDestroy, onMount } from 'svelte';
	import Spinner from './Spinner.svelte';

	const MAX_CHECK_ATTEMPTS = 100;
	const POLL_INTERVAL = 3000;

	let checkAttempts = 0;
	let error = '';
	let polling = false;
	let copyInterval: NodeJS.Timeout;
	let pollInterval: NodeJS.Timeout;

	export let invoice: string;
	export let paid = false;

	function createQRCode() {
		const canvas = document.getElementById('canvas');
		QRCode.toCanvas(canvas, invoice as string, (err: unknown) => {
			if (err) {
				console.error(err);
				error = err as string;
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
					const r = await result.json();
				}
				pollInterval = setTimeout(pollForPayment, POLL_INTERVAL);
				checkAttempts++;
			} catch (e) {
				console.error(e);
				alert(e);
				polling = false;
			}
		} else if (checkAttempts > MAX_CHECK_ATTEMPTS) {
			checkAttempts = 0;
			error = 'Timeout, too many checks';
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

<div class="flex flex-col gap-4 items-center">
	<canvas id="canvas" />
	{#if error}
		<p>{error}</p>
	{/if}
	<Spinner />
	<p>Waiting for payment...</p>
	<Button on:click={copy}>Copy Invoice</Button>
</div>
