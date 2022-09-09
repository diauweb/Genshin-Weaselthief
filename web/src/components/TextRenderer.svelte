<script lang="ts">
    import { renderText } from '../format-util.js'
    export let text = undefined
    export let value = undefined
    export let highlight = undefined

    $: if (text) value = renderText(text)
</script>

{#if typeof value === 'object'}
    {#if value.type === 'color'}
        <span class="text-colored" style={`color: #${value.value}`}>
        {#each value.children as t}
            <svelte:self value={t} highlight={highlight} />
        {/each}
        </span>
    {:else if value.children }
        {#each value.children as t}
            <svelte:self value={t} highlight={highlight} />
        {/each}
    {:else }
        {value}
    {/if}
{:else}
    {#if highlight}
        {#each `${value}`.split(highlight).flatMap(e => [e, highlight]).slice(0, -1) as e, i }
            {#if i % 2}
            <mark>{e}</mark>
            {:else}
            {e}
            {/if}
        {/each}
    {:else}
        {value}
    {/if}
{/if}

<style>
    .text-colored {
        text-shadow: 0 .8px 0 rgba(0, 0, 0, .5);
    }
</style>
