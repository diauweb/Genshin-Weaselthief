<script>
    import { onMount } from 'svelte'
    import { lang } from '../lang-store.js'
    export let id

    let text = { CHS: id, EN: id, JP: id }
    onMount(async function() {
        const k = await (await fetch(`/api/get_text?t=${id}`)).json()
        text = k.text
    })
</script>

<span title="{id}" class="translated">{text[$lang] ?? id}</span>

<style>
    .translated {
        color: rgb(0, 64, 32)
    }
</style>