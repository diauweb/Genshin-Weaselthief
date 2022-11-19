<script lang="ts">
	import Translated from '$lib/components/Translated.svelte';
	import { lang } from '$lib/client-settings';
    import { toDotVersion } from '$lib/util';
	export let data;

	let showAll = true;
	let filter = '';
</script>

<h1>NPCs</h1>

<label>
	<input type="checkbox" class="uk-checkbox" bind:checked={showAll} />
	Show Test & Unreleased
</label>
<input type="search" class="uk-input uk-margin-top" bind:value={filter} placeholder="Filter"/>

<table class="uk-table uk-table-small uk-table-striped">
	<tbody>
		{#each data.npcs as n}
			{#if showAll || !/(\(test\))|(\$UNRELEASED)|(（test）)/.test(n.NameTextMapHash.cn)}
			{#if filter.trim() === '' || RegExp(filter).test(n.NameTextMapHash[$lang]) }
				<tr>
					<th>{n.Id}</th>
                    <th>{toDotVersion(n._ver)}</th>
					<td><a href={`/npc/${n.Id}`}><Translated id={n.NameTextMapHash} /></a></td>
				</tr>
			{/if}
			{/if}
		{/each}
	</tbody>
</table>
