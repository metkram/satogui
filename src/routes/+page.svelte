<script>
	import Button from '$components/Button.svelte';
</script>

<section class="flex flex-col items-center my-12">
	<h1>Satogram</h1>
	<img src="/satogram_logo_only.jpg" alt="Satogram Envelope" class="w-48" />
</section>
<section class="flex flex-col items-center gap-4">
	<form class="flex flex-col w-96 justify-center">
		<label for="budget">Total Budget</label>
		<input type="number" min="1" max="250000" placeholder="" name="budget" required />
		<label for="amount">Amount Per Satogram</label>
		<input type="text" placeholder="" name="amount" />
		<label for="fees">Max Fees</label>
		<input type="text" placeholder="" name="fees" />
		<label for="message">Message</label>
		<input type="text" placeholder="" name="message" />
	</form>
	<button type="submit">Create Satogram</button>
</section>

<style lang="postcss">
	/* Translate the above input css to tailwind */
	input {
		@apply border border-gray-300 rounded py-2 px-4;
		@apply text-gray-700 leading-tight focus:outline-none;
		@apply focus:bg-white focus:border-gray-500;
	}
</style>
