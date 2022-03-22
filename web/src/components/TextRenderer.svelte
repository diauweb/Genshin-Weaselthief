<script lang="ts">
    import { renderText } from '../format-util.js'
    export let text = undefined
    export let value = undefined
    $: if (text) value = renderText(text)
</script>

{#if typeof value === 'object'}
    {#if value.type === 'text'}
        {value.value}
    {:else if value.type === 'color'}
        <span class="text-colored" style={`color: #${value.value}`}>
        {#each value.children as t}
            <svelte:self value={t} />
        {/each}
        </span>
    {:else if value.children }
        {#each value.children as t}
            <svelte:self value={t} />
        {/each}
    {:else }
        {value}
    {/if}
{:else}
    {value}
{/if}

<style>
    .text-colored {
        text-shadow: 0 1px 0 rgba(0, 0, 0, .5);
    }
</style>