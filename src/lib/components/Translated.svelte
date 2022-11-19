<script>
	import { onMount } from 'svelte';
	import { lang } from '../client-settings';
	import TextRenderer from './TextRenderer.svelte';

	export let id;

	let text = { cn: id, en: id, jp: id };

	onMount(async function () {
		if (id === null) return;
		if (typeof id === 'object') {
			text = id;
			id = text.hash;
		} else {
			let w = {};
			if (id !== undefined) {
				w = await (await fetch(`/api/text?id=${id}`)).json();
			}
			text = w ?? { cn: '', en: '', jp: '' };
		}
	});

	function clicked() {
		window.open(`/text/${id}`, '_blank');
	}
</script>

<span title={id} class="translated" on:dblclick={clicked}>
	<TextRenderer text={text[$lang] ?? id} />
</span>

<style>
	.translated {
		color: rgb(0, 64, 32);
	}
</style>
