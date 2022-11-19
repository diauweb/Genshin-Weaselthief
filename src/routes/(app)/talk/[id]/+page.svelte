<script lang="ts">
    import type { PageData } from './$types';
    import Translated from '$lib/components/Translated.svelte';
    import Dialogs from '$lib/components/Dialogs.svelte';

    export let data: PageData;
</script>

<h1>Talk {data.id}</h1>
<table class="uk-table uk-table-small uk-table-divider">
    <tr>
        <th>ID</th>
        <td>{data.talk.Id}</td>
    </tr>
    <tr>
        <th>BeginWay</th>
        <td>{data.talk.BeginWay}</td>
    </tr>
    <tr>
        <th>ActiveMode</th>
        <td>{data.talk.ActiveMode}</td>
    </tr>
    <tr>
        <th>Relevant Npcs</th>
        <td>
            {#each data.npcs as n}
                <Translated id={n.NameTextMapHash} />&nbsp;
            {/each}
        </td>
    </tr>
    <tr>
        <th>QuestId</th>
        <td><a href={`/quest/${data.talk.QuestId}`}>{data.talk.QuestId}</a></td>
    </tr>
    <tr>
        <th>LockGameTime</th>
        <td>{data.talk.LockGameTime}</td>
    </tr>
</table>

<h2>Dialogs</h2>
<Dialogs data={data.dialogs}/>