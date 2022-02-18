<script lang="ts">
import { onMount } from 'svelte'
import { url } from '@roxi/routify'

export let id
let text
onMount(async function() {
    let k = await fetch(`/api/get_text?t=${id}`)
    text = (await k.json()).text
})
</script>

<h2>{id} Text:</h2>
<p>{text}</p>
<h2>Reverse Search</h2>
<ul>
    <li><a href="{$url(`/search_dialogs?id=${id}`)}">Search {id} in dialogs</a></li>
    <li>Search {id} in ...</li>
</ul>
