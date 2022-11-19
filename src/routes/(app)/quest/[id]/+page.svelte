<script lang="ts">
    import type { PageData } from './$types';
    import Translated from '$lib/components/Translated.svelte';
    import Dialogs from '$lib/components/Dialogs.svelte';

    export let data: PageData;
    console.dir(data, { depth: Infinity })
</script>

<h1>Quest {data.id}</h1>
<table class="uk-table uk-table-small uk-table-divider">
    <tr>
        <th>ID</th>
        <td>{data.quest.mainQuest.Id}</td>
    </tr>
    <tr>
        <th>Series</th>
        <td>{data.quest.mainQuest.Series}</td>
    </tr>
    <tr>
        <th>Active Mode</th>
        <td>{data.quest.mainQuest.ActiveMode}</td>
    </tr>
    <tr>
        <th>Type</th>
        <td>{data.quest.mainQuest.Type}</td>
    </tr>
    <tr>
        <th>ShowType</th>
        <td>{data.quest.mainQuest.ShowType}</td>
    </tr>
    <tr>
        <th>LuaPath</th>
        <td>{data.quest.mainQuest.LuaPath}</td>
    </tr>
    <tr>
        <th>Title</th>
        <td><Translated id={data.quest.mainQuest.TitleTextMapHash} /></td>
    </tr>
    <tr>
        <th>Description</th>
        <td><Translated id={data.quest.mainQuest.DescTextMapHash} /></td>
    </tr>
</table>

<h2>Subquests</h2>
<ul class="dialog" data-uk-accordion="multiple: true">
	{#each data.quest.subQuests as d}
		<li>
			<a class="uk-accordion-title" href={'#'}>
                {d.Order}
				<Translated id={d.DescTextMapHash} />
			</a>
			<div class="uk-accordion-content">
                <table class="uk-table uk-table-small">
					<tr>
						<th>Id</th>
						<td>{d.Id}</td>
					</tr>
					<tr>
						<th>Step Text</th>
						<td><Translated id={d.StepTextMapHash}/></td>
					</tr>
                    <tr>
						<th>Guide Text</th>
						<td><Translated id={d.GuideTextMapHash}/></td>
					</tr>
                    <tr>
						<th>Show Type</th>
						<td>{d.ShowType}</td>
					</tr>
				</table>
            </div>
		</li>
	{/each}
</ul>