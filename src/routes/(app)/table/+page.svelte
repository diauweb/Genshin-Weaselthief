<script lang="ts">
    export let data;
</script>

<h1>Tables of v{data.dataver.ver}</h1>
<p>Total {data.files.length} tables</p>

<table class="uk-table uk-table-striped uk-table-small">
    <thead>
    <tr>
        <th>Name</th>
    </tr>
    </thead>
    <tbody>
    {#each data.files as f}
        <tr>
            <td><a href={`/table/${f}`}>{f}</a></td>
        </tr>
    {/each}
    </tbody>
</table>