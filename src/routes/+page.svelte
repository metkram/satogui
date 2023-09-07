<h1>Satogram</h1>

<img src="/satogram.jpg" alt="Satogram Envelope" />

<form class="flex flex-col">
	<label for="budget">Total Budget</label>
	<input type="text" placeholder="" name="budget" />
	<label for="amount">Amount Per Satogram</label>
	<input type="text" placeholder="" name="amount" />
	<label for="fees">Max Fees</label>
	<input type="text" placeholder="" name="fees" />
	<label for="message">Message</label>
	<input type="text" placeholder="" name="message" />
</form>

<style lang="postcss">
	/* Translate the above input css to tailwind */
	input {
		@apply border border-gray-300 rounded py-2 px-4;
		@apply text-gray-700 leading-tight focus:outline-none;
		@apply focus:bg-white focus:border-gray-500;
	}
</style>
