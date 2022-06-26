<script lang="ts">
    import { onMount } from "svelte";
    import VersionData from "../components/VersionData.svelte";
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
    <p>Data Version: {data.currentVersion.fullVersion}</p>

    <p>Data:</p>
    <fluent-accordion>
        {#each data.versions as d}
            <VersionData data={d} />
        {/each}
    </fluent-accordion>
{:else}
    <i>Loading introspection</i>
{/if}
