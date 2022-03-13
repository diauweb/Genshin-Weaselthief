<script>
    import { onMount } from 'svelte'
    import { lang } from '../lang-store.js'
    export let id

    let text = { CHS: id, EN: id, JP: id }
    let click = 0
    onMount(async function() {
        const k = await (await fetch(`/api/get_text?t=${id}`)).json()
        text = k.text
    })

    function clicked () {
        if (new Date() - click < 400) {
            window.open(`/text/${id}`, '_blank')
        }
        click = new Date()
    }
</script>

<span title="{id}" class="translated" on:click={clicked}>{text[$lang] ?? id}</span>

<style>
    .translated {
        color: rgb(0, 64, 32)
    }
</style>