<script lang="ts" context="module">
	export type AccordionItem = {
		title: string;
		content: string;
	};
</script>

<script lang="ts">
	import { slide } from 'svelte/transition';

	export let items: AccordionItem[];
	export let title: string = 'FAQ';

	let openIndex: number = 0;

	function open(index: number) {
		if (openIndex === index) {
			openIndex = -1;
			return;
		}
		openIndex = index;
	}
</script>

<div class="border-2 border-[#333366] rounded-lg flex flex-col justify-between p-4 w-full">
	<span class="pb-2 text-xl border-b-2 border-b-[#e71921]">{title}</span>
	{#each items as { title, content }, i}
		<div class="">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<button class="font-extrabold" on:click={() => open(i)}>{title}</button>
			{#if openIndex === i}
				<div class="my-4" in:slide|local out:slide|local>{content}</div>
			{/if}
		</div>
	{/each}
</div>
