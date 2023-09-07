<script lang="ts">
</script>

<div class="flex flex-col gap-8">
	<section class="flex gap-4 items-center mt-8">
		<img src="/satogram_logo_only.jpg" alt="Satogram Envelope" class="w-48" />
		<h1 class="text-8xl">Satogram</h1>
	</section>
	<section>
		<h2 class="text-4xl">Send messages to the whole lightning network!</h2>
	</section>
	<section class="flex flex-col gap-4">
		<form class="flex flex-col w-96 justify-center">
			<label for="budget">Total Cost (sats)</label>
			<input
				type="number"
				min="1"
				max="250000"
				placeholder="Total cost (amount you will pay)"
				name="budget"
				required
			/>
			<label for="amount">Amount Per Satogram</label>
			<input
				type="number"
				min="1"
				max="10000"
				placeholder="Enter amount to send each node"
				name="amount"
			/>
			<label for="fees">Max Fees</label>
			<input
				type="number"
				min="1"
				max="10000"
				placeholder="Don't pay fees above this amount"
				name="fees"
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
				type="submit">Create Satogram</button
			>
		</form>
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
