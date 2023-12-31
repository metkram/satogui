<script lang="ts">
	import Icon from '$components/Icon/Icon.svelte';
	import { theme, themeIcon, toggleDarkMode } from '$lib/theme';
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
	import Spinner from '$components/Spinner.svelte';
	import { AddMeResponse } from '../lib/types';

	let accordionItems: AccordionItem[] = [
		{
			title: 'What are Satograms?',
			content:
				'Satograms are lightning keysend payments that include a custom message. Think of it like spam email, but you get paid for it. When you receive a Satogram you have been paid by the sender! Reach out to thousands of people with your own custom message of up to ~1000 characters in only a few minutes.'
		},
		{
			title: 'How much does it cost',
			content:
				`At 1 sat/Satogram, about 65k sats. Each satogram costs the amount you set per satogram plus any lightning network fees. Additionally our serivce takes 10% of the invoiced amount. Exmple: Invoiced 65,000 sats, our fee is 6,500 sats, leaving 58,500 sats for sending satograms.`
		},
		{
			title: 'Who Can I send this to?',
			content:
				'You can send Satograms to any node who have keysends enabled or to a lightning address that supports comments. Reach out to ~11 thousand people with your own custom message of up to 1000 characters in only a few minutes.'
		},
		{
			title: 'Why would I do this?',
			content:
				'Whether you are a brand who wants to advertise your product, or a pleb who wants to wish the network a good morning, Satograms allow you to put your messaging directly in front of users. Folks are a lot more receptive to "spam" messaging if they are getting paid for it.'
		},
			{
			title: 'Distribution between lightning addresses and nodes',
			content:
				`Currently the site does not allow for customizing the breakdown of Satograms between these two. Budget will be used to pay all lightning addresses before sending to nodes. In other words, in order to send a Satogram to the first node, all lightning addresses need to be sent Satograms first. Thus the Total Cost field should be set accordingly. Customization of this breakdown is a feature coming soon.`
		},
		{
			title: 'Network Fee Limit',
			content:
				`The Network Fee Limit field is used to set the max fees paid for a lightning transaction. Example: With the field set to 5, a payment that costs 6 or more sats in routing fees will not succeed. If the fee limit set exceeds the actual routing fees, then the fees spent will equal the routing fees. Example: With the field set to 10, a payment that costs 6 sats to route will pay 6 sats in routing fees. The higher the fee limit set, the more possible routes that can be taken to settle the payment, increasing payment success likelihood.`
		},
		{
			title: 'Refunds',
			content:
				`The Total Cost field currently comes with a best guess estimate for what it will cost to Satogram all lightning addresses and node pubkeys. However network fees are not known until the payment is sent, making a perfect estimate impossible. In the case of over payment a refund can be issues for the over payment amount by contacting us (see contact info below). Example: Total Cost set to 100k sats. Actual costs to send all Satograms: 85k sats. A refund can be requested for the 15k difference. In the future this process will be automated.	`
		},
		{
			title: 'How much does this cost? How many people will receive my Satograms?',
			content:
				'We charge a 10% fee for our service. For example, if you pay our invoice for 10,000 sats, we will send out 9,000 sats worth of Satograms. Note that ligthning network fees are not entirely known up front, and this makes calculating with certainty how many Satograms will be sent using this 9,000 sat budget.'
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
	let totalAmount: number | null;
	let amountPerSatogram: number | null;
	let maxFees: number | null;
	let message: string | null;
	let senderAddress: string | null;
	let addMeAddress: string | null;

	let addMeResponse: AddMeResponse;

	$: console.log({ $theme });
	$: paid && browser && confetti.addConfetti({ emojis: ['📨'] });

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
					message,
					sender_address: senderAddress
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

	async function addMe() {
		if (!addMeAddress) {
			return;
		}
		try {
			loading = true;
			const result = await fetch(`${PUBLIC_API_ENDPOINT}/api/v1/addme`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					add_me_address: addMeAddress
				})
			});
			addMeResponse = await result.json();
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
		totalAmount = null;
		amountPerSatogram = null;
		maxFees = null;
		message = null;
		senderAddress = null;
	}

	function handlePaid() {
		paid = true;
	}

	onMount(() => {
		fetchToWhom();
		confetti = new JSConfetti();
	});
</script>

<div class="flex flex-col gap-4">
	<section class="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
		<div class="gap-8 md:gap-4 md:items-baseline justify-center flex-col flex md:flex-row">
			<img src="/satogram_logo_only.jpg" alt="Satogram Envelope" class="w-48 mx-auto" />
			<h1 class="md:text-8xl text-6xl">Satogram</h1>
		</div>
		<div>
			<button on:click={toggleDarkMode}><Icon name={$themeIcon} /></button>
		</div>
	</section>
	<section>
		<h2 class="text-4xl text-center md:text-left">Send your message to (most of) the lightning network!</h2>
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
				Payment received, your Satograms will be sent! Use the "Check Satogram Status" tool on the homepage to check on the status.
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
						<strong>Network Fee Limit: </strong>
						<span>{maxFees}</span>
					</li>
					<li>
						<strong>Total Cost: </strong>
						<span>{totalAmount}</span>
					</li>
					<li>
						<strong>Your node pubkey or lightning address: </strong>
						<span>{senderAddress}</span>
					</li>
				</ul>
			</div>
		{:else}
			{#if toWhom}
				<div class="flex flex-col md:flex-row justify-between md:justify-around w-full">
					<div class="flex justify-between md:block">
						<strong> Total Nodes and Addresses: </strong>
						<span>{toWhom.total_count}</span>
					</div>
					<div class="flex justify-between md:block">
						<strong> Total Nodes: </strong>
						<span>{toWhom.total_count_pubkeys}</span>
					</div>
					<div class="flex justify-between md:block">
						<strong> Total Lightning Addresses: </strong>
						<span>{toWhom.total_count_wos_addresses}</span>
					</div>
					<div class="flex justify-between md:block">
						<strong> Total Satograms sent: </strong>
						<span>{toWhom.total_satograms_sent}</span>
					</div>
					
				</div>
			{:else if loading}
				<Spinner />
			{/if}
			<form class="flex flex-col w-1/4 justify-center">
				<label for="addMeAddress" style="text-align: center;"
							>Want Satograms? Share your node pubkey or lightning address</label
						>
						<input
							type="text"
							placeholder="030f...cdb7 or blahblah@getalby.com"
							name="addMeAddress"
							maxlength="66"
							required
							bind:value={addMeAddress}
						/>
						<Button {loading} on:click={addMe} type="submit">Add me to the Satogram send list!</Button>

			</form>
			{#if addMeResponse}
				<div
					class="w-full border border-gray-500 bg-gray-200 p-2 rounded-lg dark:bg-gray-500 dark:border-white"
				>
					<pre class="break-all overflow-auto">{JSON.stringify(addMeResponse, null, 2)}</pre>
				</div>
			{/if}
			<p><b>Create a Satogram</b></p>
					<form class="flex flex-col w-1/2 justify-center">
						<label for="totalAmount"
							><b>Total Cost</b> (sats) recommendation to reach all: ~65,000 sats (at 1 sat/Satogram) </label
						>
						<input
							type="number"
							style="margin-bottom: 15px;"
							min="500"
							max="250000"
							placeholder="Amount sats you will be invoiced"
							name="totalAmount"
							required
							bind:value={totalAmount}
						/>
						<label for="amount"><b>Amount Per Satogram</b> (sats)</label>
						<input
							type="number"
							style="margin-bottom: 15px;"
							min="1"
							max="10000"
							placeholder="Amount to send to each node/address"
							name="amountPerSatogram"
							bind:value={amountPerSatogram}
						/>
						<label for="maxFees"><b>Network Fee Limit</b> (sats) recommendation: 20 (optional)</label>
						<input
							type="number"
							style="margin-bottom: 15px;"
							min="1"
							max="10000"
							placeholder="Max network fee per Satogram"
							name="maxFees"
							bind:value={maxFees}
						/>
						<label for="message"><b>Satogram Message</b></label>
						<input
							type="text"
							style="margin-bottom: 15px; height: 150px"
							placeholder="What do you want your Satogram to say?"
							name="message"
							maxlength="800"
							required
							bind:value={message}
						/>
						<label for="senderAddress"><b>Your node pubkey or lightning address</b> (optional)</label>
						<input
							type="text"
							placeholder="0309bf5f....cd8db7 or blah-blah-blah@vlt.ge"
							name="senderAddress"
							maxlength="66"
							bind:value={senderAddress}
						/>
						<Button {loading} on:click={createSatogram} type="submit">Create Satogram</Button>
					</form>
			<strong>OR</strong>
			<h3 class="text-xl font-bold">Check Satogram Status</h3>
			<form class="flex flex-col justify-center w-full md:w-1/2">
				<label for="lookup">Enter your previous payment request to lookup the Satogram status</label>
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
			{#if satogramStatus}
				<div
					class="w-full border border-gray-500 bg-gray-200 p-2 rounded-lg dark:bg-gray-500 dark:border-white"
				>
					<pre class="break-all overflow-auto">{JSON.stringify(satogramStatus, null, 2)}</pre>
				</div>
			{/if}
		{/if}
		<div class="w-full">
			<Accordion items={accordionItems} />
		</div>
	</section>
	<section class="flex flex-col gap-4">
		<p>Problems? Rug pulled? Comments? Refund?</p>

		<p>
			Contact "customer support" by reaching out to 
			<strong><a
				href="https://twitter.com/BitcoinCoderBob">@BitcoinCoderBob
				</a>
			</strong> or 
			<strong><a
				href="https://twitter.com/Satograms">@Satograms
				</a>
			</strong> on X, Nostr, or Telegram.
		</p>

		<p>Is it really spam if I'm paying you?</p>

		<p>
			This frontend is open source at <a
				class="underline"
				href="https://github.com/Satograms">Github</a
			>
			and the backend code to integrate Satograms into your platform coming soonTM
		</p>
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
