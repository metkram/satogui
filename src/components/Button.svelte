<script lang="ts">
	import Spinner from './Spinner.svelte';

	export let type: 'button' | 'submit' = 'button';
	export let loading = false;
</script>

<button {type} on:click>
	{#if loading}
		<Spinner />
	{:else}
		<slot />
	{/if}
</button>

<style lang="postcss">
	button {
		@apply p-4 mt-4 bg-[#ee3124] text-white rounded hover:bg-red-700 transition-all;
	}
</style>
