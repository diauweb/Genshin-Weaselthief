<script>
    import { onMount } from 'svelte'
    import { lang } from '../lang-store.js'
    import TextRenderer from './TextRenderer.svelte'

    export let id

    let text = { CHS: id, EN: id, JP: id }
    let click = 0
    onMount(async function() {
        const w = await (await fetch(`/api/get_text?t=${id}`)).json()
        text = w.text
    })

    function clicked () {
        if (new Date() - click < 400) { 
            window.open(`/text/${id}`, '_blank')
        }
        click = new Date()
    }
</script>

<span title="{id}" class="translated" on:click={clicked}>
    <TextRenderer text={text[$lang] ?? id}/>
</span>

<style>
    .translated {
        color: rgb(0, 64, 32)
    }
</style>