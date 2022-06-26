<script lang="ts">
    import Dialog from '../../components/Dialog.svelte'

    import { onMount } from "svelte"
    import { goto } from '@roxi/routify'

    export let id
    let dialogs = []

    async function fetchDialog (id) {
        const e = await (await fetch(`/api/get_dialog?t=${id}`)).json()
        return e.dialog
    }

    onMount(async function () {
        dialogs = [...dialogs, await fetchDialog(id)]
    })

    async function gotoTalk () {
        const e = await (await fetch(`/api/search_talk?q=${id}`)).json()
        if (!e.result) {
            alert('no parent talk found')
        } else {
            $goto(`/talk/${e.result.Id}`)
        }
    }
</script>

<button on:click="{() => gotoTalk()}">Go to Talk</button>
{#each dialogs as e (e.Id)}
<Dialog data="{e}" />
{/each}
