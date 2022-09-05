<script>
    import { goto, params, url } from "@roxi/routify";
    import { lang } from "../lang-store.js";
    import { onDestroy } from "svelte";
    import TextRenderer from "../components/TextRenderer.svelte";

    let data = { loading: true };
    let failed = false;
    let input = {};
    function update() {
        try {
            if ($params.keyword) {
                fetch(
                    `/api/search_text?q=${encodeURIComponent(
                        $params.keyword
                    )}&lang=${$lang}`
                ).then((e) =>
                    e.json().then((k) => {
                        data = k;
                    })
                );
            }
        } catch (e) {
            failed = true;
        }
    }

    function search() {
        document.location = `/search_text?keyword=${encodeURIComponent(input.value)}`;
        // document.location.reload();
    }

    function toDotVersion(number) {
        const major = Math.floor(number / 10000);
        const minor = Math.floor((number - major * 10000) / 100);
        const revision = number - major * 10000 - minor * 100;

        return `${major}.${minor}.${revision}`;
    }

    const unsub = lang.subscribe(() => update());

    onDestroy(unsub);
</script>

<div class="search">
    <fluent-text-field
        type="search"
        bind:this={input}
        value={$params.keyword}
    />
    <fluent-button on:click={search}>Search</fluent-button>
</div>

<p>Show up to 100 items in registry</p>

{#if data.loading}
    <p>loading data...</p>
{:else if !failed && data.ok}
    <ul>
        {#each data.result as e}
            <li>
                <b>
                    <a href={$url(`/text/${e.hash}`)}>
                        {e.hash}
                    </a>
                </b>
                <span class="weak">{toDotVersion(e._ver)}</span>
                <TextRenderer 
                    text={e[$lang]}
                    highlight={$params.keyword} 
                />
            </li>
        {:else}
            No matched data
        {/each}
        {#if data.more}
            <li>more...</li>
        {/if}
    </ul>
{:else}
    <p>failed loading data</p>
    <pre>{data.error}</pre>
{/if}

<style>
    .search {
        display: flex;
        align-items: center;
    }

    .weak {
        color: gray;
    }
</style>
