<script>
    import { onMount } from 'svelte'
    export let id

    let text
    onMount(async function() {
        const k = await (await fetch(`/api/get_text?t=${id}`)).json()
        text = k.text
    })
</script>

<span title="{id}" class="translated">{text ?? id}</span>

<style>
    .translated {
        color: rgb(0, 64, 32)
    }
</style>