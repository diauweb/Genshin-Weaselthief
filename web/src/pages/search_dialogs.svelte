<script>
    import { params, url } from '@roxi/routify'
    import Dialog from '../components/Dialog.svelte'
    
    let data = new Promise((resolve) => resolve({ json: () => [] }))
    if ($params.id) {
        data = fetch(`/api/search_dialogs?q=${encodeURIComponent($params.id)}`)
    }
</script>

<input type="search" value="{$params.id}" disabled>

{#await data}
    <p>loading data...</p> 
{:then v}
    <ul>
        {#await v.json() then o}
            {#each o.result as e }
                <li>
                    <Dialog data="{e}"/>
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