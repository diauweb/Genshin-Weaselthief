<script lang="ts">
    import { onMount } from "svelte"
    import Translated from '../../components/Translated.svelte'

    export let id
    let data

    onMount(async function () {
        const b = await (await fetch(`/api/get_reminder?q=${id}`)).json()
        data = b.result
    })
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
{:else}
<i>Loading</i>
{/if}

<style>
    th {
        text-align: right;
    }
</style>
