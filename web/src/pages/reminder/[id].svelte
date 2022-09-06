<script lang="ts">
    import { onMount } from "svelte"
    import Translated from '../../components/Translated.svelte'

    export let id
    let data

    let allReminder

    onMount(async function () {
        const b = await (await fetch(`/api/get_reminder?q=${id}`)).json()
        data = b.result
    })

    async function loadAllReminder() {
        const data = []
        allReminder = (await (await fetch(`/api/all_reminder?q=${id}`)).json()).result
    }
</script>

{#if data}
<h2>Reminder {data.Id}</h2>
<table>
    <tr><th>Id</th><td>{data.Id}</td></tr>
    <tr><th>Speaker</th><td><Translated id={data.SpeakerTextMapHash}/></td></tr>
    <tr><th>Content</th><td><Translated id={data.ContentTextMapHash}/></td></tr>
    <tr><th>ShowTime</th><td>{data.ShowTime}</td></tr>
    {#if data.NextReminderId}
    <tr>
        <th>NextReminder</th>
        <td>
            <a href={`/reminder/${data.NextReminderId}`}>{data.NextReminderId}</a>
        </td>
    </tr>
    {/if}
</table>

<h2>Reminder Group</h2>
<button on:click={loadAllReminder}>Load Group</button>
{#if allReminder}
{#each allReminder as r}
<div class="card">
    <a href={`/reminder/${r.Id}`}>{r.Id}</a>
    <b><Translated id={r.SpeakerTextMapHash}/></b>
    <Translated id={r.ContentTextMapHash} />
</div>
{/each}
{/if}
{:else}
<i>Loading</i>
{/if}

<style>
    th {
        text-align: right;
    }

    .card {
        background-color: #eee;
        margin: 5px;
        padding: 8px 10px;
        border-radius: 5px;
    }
</style>
