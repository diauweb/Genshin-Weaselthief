<script lang="ts">
    import Dialog from '../../components/Dialog.svelte'

    import { onMount } from "svelte";

    export let id
    let dialogs = []

    async function fetchDialog (id) {
        const e = await (await fetch(`/api/get_dialog?t=${id}`)).json()
        return e.dialog
    }

    onMount(async function () {
        dialogs = [...dialogs, await fetchDialog(id)]
    })

    async function allDialogs () {
        const d = await (await fetch(`/api/dialog_set?t=${id}`)).json()
        dialogs = [...d.dialogs]
    }

</script>

<button on:click="{allDialogs}">Load all relevant dialogs</button>
{#each dialogs as e (e.Id)}
<Dialog data="{e}" />
{/each}
