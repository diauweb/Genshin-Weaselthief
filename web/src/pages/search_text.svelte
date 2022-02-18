<script>
    import { params } from '@roxi/routify'
    
    let data = new Promise((resolve) => resolve({ json: () => [] }))
    if ($params.keyword) {
        data = fetch(`/api/search?q=${encodeURIComponent($params.keyword)}`)
    }
</script>

<input type="search" value="{$params.keyword}" disabled>
<p>Show up to 50 items in registry</p>

{#await data}
    <p>loading data...</p> 
{:then v}
    <ul>
        {#await v.json() then o}
            {#each o.result as e }
                <li>
                    <b>{e.id}</b> {e.value}
                </li>
            {:else}
                No matched data
            {/each}
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