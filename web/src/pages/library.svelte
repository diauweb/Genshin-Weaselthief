<script lang="ts">
    import { onMount } from 'svelte'
    import Translated from '../components/Translated.svelte'
    import TranslatedDocument from '../components/TranslatedDocument.svelte'

    let docs = []
    let perPage = 20
    let page = 0
    $: maxPage = Math.floor(docs.length / perPage)

    onMount(() => {
        fetch('/api/documents').then(e => e.json().then(j => docs = j.result ))
    })

    function read (i) {
        docs[i].text = docs[i].content.split('/').slice(-1)[0]
    }

    function paging (ev) {
        page = parseInt(ev.target.value)
    }

</script>

<h1>Mondstadt Library</h1>
{#if docs}
<p class="pager">
    <span>{docs.length} documents, Page {page + 1} of {maxPage}</span>
    <fluent-select on:change={paging}>
        {#each [...Array(maxPage).keys()] as i (i)}
        <fluent-option value={i}>{i + 1}</fluent-option>
        {/each}
    </fluent-select>
</p>

<fluent-accordion>
    {#each docs as d,i (d.Id)}
    {#if i >= page * perPage && i < (page + 1) * perPage }
    <fluent-accordion-item>
        <span slot="heading">
            <Translated id={d.TitleTextMapHash} />
        </span>
        {#if d.content}
        <fluent-button on:click={() => read(i)}>Read</fluent-button>
        {/if}
        <p><b>Id</b> {d.Id}</p>
        {#if d.text }
        <TranslatedDocument id={d.text}/>
        {/if}
    </fluent-accordion-item>
    {/if}
    {/each}
</fluent-accordion>
{:else}
    <fluent-progress-ring />
{/if}

<style>
    .pager {
        display: flex;
        align-items: center;
        gap: 10px;
    }
</style>
