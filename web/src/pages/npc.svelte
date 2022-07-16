<script lang="ts">
import { onMount } from "svelte";
import { params } from "@roxi/routify";
import Translated from "../components/Translated.svelte";
import Dialog from "../components/Dialog.svelte";

    let data
    onMount(async () => {
        data = await (await fetch(`/api/npc_details?q=${$params.id}`)).json()
    })
</script>

{#if data}
<h1>NPC {data.npc.Id}</h1>
<p><b>Name:</b> <Translated id={data.npc.NameTextMapHash}/></p>
<p style="color: gray">Showing first 500 items of reminders and dialogs.</p>
<h2>Reminders</h2>
<ul>
    {#each data.reminders as r}
    <li>
        <a target="_blank" href={`/reminder/${r.Id}`}>{r.Id}</a> <Translated id={r.ContentTextMapHash}/>
    </li>
    {/each}
</ul>

<h2>Dialogs</h2>
{#each data.dialogs as d}
<Dialog data={d} />
{/each}

{:else}
Loading
{/if}