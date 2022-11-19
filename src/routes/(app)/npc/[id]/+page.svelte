<script lang="ts">
	import Translated from "$lib/components/Translated.svelte";
    import Dialogs from '$lib/components/Dialogs.svelte';

    export let data;
</script>

<h1>NPC {data.npc.Id}</h1>
<p>
    <b>Name:</b>
    <Translated id={data.npc.NameTextMapHash}/>
</p>

<p>Showing first 500 items of reminders and dialogs.</p>

{#if data.reminders.length > 0}
<h2>Reminders</h2>
<table class="uk-table uk-table-small uk-table-striped">
    {#each data.reminders as r}
    <tr>
        <th>{r.Id}</th>
        <td><Translated id={r.ContentTextMapHash}/></td>
    </tr>
    {/each}
</table>
{/if}

<h2>Dialogs</h2>
<Dialogs data={data.dialogs}/> 