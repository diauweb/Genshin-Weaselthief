<script lang="ts">
    import { onMount } from 'svelte'

    let data : {
        buildDate: string,
        version: string,
        branch: string,
        vcs: boolean,
        status: Record<string, string>,
        commit: Record<string, any>
    }
    onMount(async function () {
        data = await (await fetch('/api/introspect')).json()
    })
</script>

<h2>Introspect</h2>
{#if data}
<p>Version: {data.version}</p>
<p>Build Date: {data.buildDate}</p>
<p>Branch: {data.branch}</p>
{#if data.vcs}
<p>Data:</p>
<pre>{ JSON.stringify(data.status, null, 2)}</pre>
<pre>{ JSON.stringify(data.commit, null, 2)}</pre>
{:else}
<p><i>Data file is not in Version Control</i></p>
{/if}
{:else}
<i>Loading introspection</i>
{/if}
