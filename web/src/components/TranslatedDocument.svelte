<script>
    import { onMount } from 'svelte'
    import { lang } from '../lang-store.js'
    export let id

    let text = { CHS: id, EN: id, JP: id }

    onMount(async function() {
        const k = await (await fetch(`/api/get_document?q=${encodeURIComponent(id)}`)).json()
        text = k.text
    })

</script>

<pre title="{id}" class="translated">{text[$lang] ?? id}</pre>

<style>
    .translated {
        color: rgb(0, 64, 32);
        overflow-x: auto;
        white-space: pre-wrap;
    }
</style>
