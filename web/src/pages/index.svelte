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

<div>
    <input type="search" placeholder="Search in mapped texts" bind:value={searchText}>
    <button on:click="{search}">Search</button>
</div>

<style>
	input {
		width: 50%;
	}
</style>