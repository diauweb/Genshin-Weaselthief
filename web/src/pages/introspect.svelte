<script lang="ts">
    import { onMount } from "svelte";
    import GitCommit from "../components/GitCommit.svelte";
    import { getIntrospection } from "../version-util.js";

    let data;
    onMount(async function () {
        data = await getIntrospection();
    });
</script>

<h2>Introspect</h2>
{#if data}
    <p>Version: {data.version}</p>
    <p>Build Date: {data.buildDate}</p>
    <p>Branch: {data.branch}</p>
    <p>Data Version: {data.dataVersion.fullVersion}</p>
    {#if data.vcs}
        <p>Data:</p>
        <pre>{JSON.stringify(data.status, null, 2)}</pre>
        <fluent-accordion>
            {#each data.commit.all as d}
                <GitCommit data={d} />
            {/each}
        </fluent-accordion>
    {:else}
        <p><i>Data file is not in Version Control</i></p>
    {/if}
{:else}
    <i>Loading introspection</i>
{/if}
