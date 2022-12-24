<script lang="ts">
	import Translated from '$lib/components/Translated.svelte';
	import { lang } from '$lib/client-settings';
	export let data;
	let showAll = true;
	let filter = '';
</script>

<h1>Documents</h1>
<input type="search" class="uk-input uk-margin-top" bind:value={filter} placeholder="Filter"/>

<table class="uk-table uk-table-small uk-table-striped">
	<tbody>
		{#each data.documents as n}
			{#if filter.trim() === '' || RegExp(filter).test(n.TitleTextMapHash[$lang]) }
				<tr>
					<th>{n.Id}</th>
					<td><a href={`/document/${n.Id}`}><Translated id={n.TitleTextMapHash} /></a></td>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>
