<script lang="ts">
    import { onMount } from "svelte"
    import Translated from '../../components/Translated.svelte'
    import Role from '../../components/Role.svelte'

    export let id
    let quests = []
    let main

    onMount(async function () {
        const e = await (await fetch(`/api/get_quests?q=${id}`)).json()
        quests = [...e.subQuests]
        main = e.mainQuest
    })
</script>

{#if main}
<h2>Main Quest</h2>
<table>
    <tr><th>Id</th><td>{main.Id}</td></tr>
    <tr><th>Type</th><td>{main.Type}</td></tr>
    <tr><th>ActiveMode</th><td>{main.ActiveMode}</td></tr>
    <tr><th>LuaPath</th><td>{main.LuaPath}</td></tr>
    <tr><th>Title</th><td><Translated id={main.TitleTextMapHash}/></td></tr>
    <tr><th>Description</th><td><Translated id={main.DescTextMapHash}/></td></tr>
    <tr><th>ShowType</th><td>{main.ShowType}</td></tr>
</table>
<h2>Sub Quests</h2>
<fluent-accordion>
    {#each quests as q}
    <fluent-accordion-item>
        <span slot="heading">{q.Order} <Translated id={q.DescTextMapHash}/></span>
        <table>
            <tr><th>Id</th><td>{q.SubId}</td></tr>
            <tr><th>Order</th><td>{q.Order}</td></tr>
            <tr><th>Description</th><td><Translated id={q.DescTextMapHash}/></td></tr>
            <tr><th>StepDesc</th><td><Translated id={q.StepDescTextMapHash}/></td></tr>
            <tr><th>GuideDesc</th><td><Translated id={q.GuideTipsTextMapHash}/></td></tr>
        </table>
        {#if q.ExclusiveNpcList.length > 0}
        <p>Exclusive Npcs:</p>
        <div style="margin: 5px; background: #fdfdfd;">
            {#each q.ExclusiveNpcList as npc}
            <Role id={npc} />
            {/each}    
        </div>
        {/if}
    </fluent-accordion-item>
    
    {/each}
</fluent-accordion>
{:else}
<i>Loading</i>
{/if}

<style>
    th {
        text-align: right;
    }
</style>