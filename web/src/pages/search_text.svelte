<script>
    import { params, url } from '@roxi/routify'
    import { lang } from '../lang-store.js'
    import { onDestroy } from 'svelte'

    let data = new Promise((resolve) => resolve({ json: () => [] }))
    function update () {
        if ($params.keyword) {
            data = fetch(`/api/search_text?q=${encodeURIComponent($params.keyword)}&lang=${$lang}`)
        }
    }
    
    const unsub = lang.subscribe(() => update())

    onDestroy(unsub)
</script>

<input type="search" value="{$params.keyword}" disabled>
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
    input {
        width: 500px
    }
</style>