<script lang="ts">
	import { Mood } from '$lib/types';
	import Icon from './Icon/Icon.svelte';

	export let mood: Mood = Mood.good;
	export let title: string = 'Hello World';
	export let closed = false;
	export let close = () => {
		closed = true;
	};

	$: console.log({ closed });
</script>

{#if !closed}
	<div class={mood}>
		<section>
			<span>{title}</span>
			<button on:click={close}><Icon name="close" /></button>
		</section>
		<slot />
	</div>
{/if}

<style lang="postcss">
	div {
		@apply p-4 w-full flex flex-col border border-red-500 rounded-lg;
	}
	span {
		@apply font-bold;
	}
	section {
		@apply flex justify-between items-center;
	}
	div.good {
		@apply bg-green-200 text-green-500;
	}
	div.bad {
		@apply bg-red-200 text-red-500;
	}
	div.warn {
		@apply bg-yellow-200 text-yellow-500;
	}
	div.neutral {
		@apply bg-blue-200 text-blue-500;
	}
</style>
