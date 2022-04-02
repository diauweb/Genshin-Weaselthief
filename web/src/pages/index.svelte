<script lang="ts">
    import { onMount } from 'svelte'
    import { goto } from '@roxi/routify'

    let status

    onMount(async function() {
        const k = await fetch('/api/status')
        status = await k.json()
    })

    let searchText
    function search () {
        $goto('/search_text', { keyword: searchText })
    }

</script>

<p><strong>Proof-Of-Concept project, alpha quality.</strong></p>
<p style="color: grey; text-size: small;">
    This project is made for educational and research purpose.<br>
    This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with miHoYo, or any of its subsidiaries or its affiliates. <br>
    Genshin Impact as well as related names, marks, emblems and images are registered trademarks of their respective owners.
</p>

<div>
    <input type="search" placeholder="Search in mapped texts" bind:value={searchText}>
    <button on:click="{search}">Search</button>
    <p>
        <strong>Search Grammars:</strong>
    </p>
    <ul>
        <li>By default the text will be matched in whole word.</li>
        <li>Place <code>?</code> at front to enable script search mode.</li>
        <li>In script mode, <code>$</code> is the test string</li>
        <li>Helper function: <code>has(...)</code> is an alias of <code>$.includes(...)</code></li>
        <li>The entry is selected if the given expression evaluates to true</li>
        <li>If expression returns a RegExp, the entry will be tested against it.</li>
    </ul>
</div>

<style>
	input {
		width: 50%;
	}
</style>