<script>
    import { goto, params, url } from '@roxi/routify'
    import { lang } from '../lang-store.js'
    import { onDestroy } from 'svelte'

    let data = new Promise((resolve) => resolve({ json: () => [] }))
    let input = {}
    function update () {
        if ($params.keyword) {
            data = fetch(`/api/search_text?q=${encodeURIComponent($params.keyword)}&lang=${$lang}`)
        }
    }

    function search () {
        $goto('/search_text', { keyword: input.value })
        update()
    }
    
    const unsub = lang.subscribe(() => update())

    onDestroy(unsub)
</script>

<div class="search">
    <fluent-text-field type="search" bind:this={input} value={$params.keyword}></fluent-text-field>
    <fluent-button on:click={search}>Search</fluent-button>
</div>

<p>Show up to 100 items in registry</p>

{#await data}
    <p>loading data...</p> 
{:then v}
    <ul>
        {#await v.json() then o}
            {#each o.result as e }
                <li>
                    <b>
                        <a href="{$url(`/text/${e.id}`)}">
                            {e.id}
                        </a>
                    </b> 
                    {e.value}
                </li>
            {:else}
                No matched data
            {/each}
            {#if o.more}
                <li>more...</li>
            {/if}
        {/await}
        
    </ul>
{:catch}
    <p>failed loading data</p>
{/await}


<style>
    .search {
        display: flex;
        align-items: center;
    }
</style>