<script lang="ts">
import { onMount } from 'svelte';
import Translated from '../../components/Translated.svelte';

    let data
    let hide = true
    
    onMount(async () => {
        data = (await (await fetch('/api/npcs')).json()).result
    })
</script>

{#if data}
<div class="config-box">
    <input type="checkbox" id="hide-test" bind:checked={hide} />
    <label for="hide-test">Hide Test & Unreleased</label>
</div>

<ul>
    {#each data as d}
    {#if !hide || !/(\(test\))|(\$UNRELEASED)/.test(d.NameTextMapHash.cn) }
    <li>
        <a href={`/npc?id=${d.Id}`}>{d.Id}</a> <Translated id={d.NameTextMapHash} />
    </li>
    {/if}
    {/each}
</ul>
{:else}
Loading Data...
{/if}

<style>
    .config-box {
        display: flex;
        align-content: center;
        align-items: center;
    }

    .config-box input {
        margin: 0 5px;
    }
</style>