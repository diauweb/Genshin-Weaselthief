<script lang="ts">
	import TextRenderer from "$lib/components/TextRenderer.svelte";
	import { toDotVersion } from '$lib/util';
    import Dialogs from "$lib/components/Dialogs.svelte";
	import Translated from "$lib/components/Translated.svelte";
    
    export let data;
</script>

<h2>Text {data.id}:</h2>
<p><TextRenderer text={data.text.cn} /></p>
<p><TextRenderer text={data.text.en}/></p>
<p><TextRenderer text={data.text.jp}/></p>

<h2>Reference</h2>
{#if data.dialog}
<h4>Dialog</h4>
<Dialogs data={data.dialog} />
{/if}
{#if data.reminder}
<h4>Reminder</h4>
<a href={`/reminder/${data.reminder.result}`}>{data.reminder.result}</a>
{/if}

{#if data.talk}
<h4>Talk</h4>
<table class="uk-table">
    <tr>
        <th>Talk</th>
        <td><a href={`/talk/${data.talk.Id}`}>{data.talk.Id}</a></td>
    </tr>
    {#if data.talk.QuestId}
    <tr>
        <th>Quest</th>
        <td><a href={`/quest/${data.talk.QuestId}`}>{data.talk.QuestId}</a></td>
    </tr>   
    {/if}
    {#if data.talk.NpcId}
    <tr>
        <th>Relevant Npcs</th>
        <td>
            {#each data.npcs as n}
                <Translated id={n.NameTextMapHash} />&nbsp;
            {/each}
        </td>
    </tr>
    {/if}
</table>
{/if}
<h2>History</h2>
<div>
    <ul class="strip" data-uk-accordion="multiple: true">
        {#each data.history as h}
        <li>
            <a class="uk-accordion-title" class:history-delete={h.delete} href={"#"}>{toDotVersion(h._ver)}</a>
            {#if h.delete} [delete]{/if}
            <div class="uk-accordion-content">
                <p><TextRenderer text={h.cn} /></p>
                <p><TextRenderer text={h.en}/></p>
                <p><TextRenderer text={h.jp}/></p>
            </div>
        </li>
        {/each}
    </ul>
</div>

<style>
    .history-delete {
        background-color: #FFF0F0;
    }

    .strip li {
        background-color: #F8F8F8;
        padding: 0.7em;
        border-radius: 8px;
    }
</style>
