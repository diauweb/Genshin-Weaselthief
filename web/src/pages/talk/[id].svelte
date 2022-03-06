<script lang="ts">
    import { onMount } from "svelte"
    import Dialog from '../../components/Dialog.svelte'

    export let id

    let talk
    let dialogs = []
    
    async function fetchTalk (id) {
        const e = await (await fetch(`/api/get_talk?q=${id}`)).json()
        return e.result
    }

    onMount(async function () {
        talk = await fetchTalk(id)
    })

    async function allDialogs () {
        const d = await (await fetch(`/api/dialog_set?t=${talk.InitDialog}`)).json()
        dialogs = [...d.dialogs]
    }
</script>

<h2>Talk Group {id}</h2>
{#if talk}
<h3>Info</h3>


<p><b>Id:</b>{talk.Id}</p>
<p><b>BeginWay: </b>{talk.BeginWay}</p>
<p><b>ActiveMode: </b>{talk.ActiveMode}</p>
<p><b>InitDialog: </b>{talk.InitDialog}</p>
<p><b>PerformCfg: </b>{talk.PerformCfg}</p>
<p><b>QuestId: </b><a href="/quest/{talk.QuestId}">{talk.QuestId}</a></p>

<h3>Dialogs</h3>
<button on:click="{allDialogs}">Load all dialogs</button>
<details open>
    <summary>Dialogs</summary>
    {#each dialogs as e (e.Id)}
        <Dialog data="{e}" />
    {/each}
</details>
{:else}
Loading
{/if}