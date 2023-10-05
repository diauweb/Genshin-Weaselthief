<script lang="ts">
	import Translated from './Translated.svelte';
	import { stripBsid } from '$lib/util';

	export let data;
	if (!Array.isArray(data)) data = [data];
</script>

<ul class="dialog" data-uk-accordion="multiple: true">
	{#each data as d}
		<li>
			<a class="uk-accordion-title" href={'#'}>
				<b>
					{#if d?.TalkRoleNameTextMapHash?.cn}
						<Translated id={d.TalkRoleNameTextMapHash} />
					{:else if d.TalkRole__Type === 'TALK_ROLE_NPC'}
						<Translated id={d.TalkRoleNpc?.NameTextMapHash} />
					{/if}
				</b>
				<Translated id={d.TalkContentTextMapHash} />
			</a>
			<div class="uk-accordion-content">
                <table class="uk-table uk-table-small sm-break-table">
					<tr>
						<th>Id</th>
						<td>{d.Id}</td>
					</tr>
					<tr>
						<th>TalkRole Type</th>
						<td>{d.TalkRole__Type}</td>
					</tr>
					{#if d.TalkShowType}
					<tr>
						<th>TalkShowType</th>
						<td>{d.TalkShowType}</td>
					</tr>
					{/if}
					{#if d.TalkRoleNpc}
					<tr>
						<th>TalkRole Npc</th>
						<td class="mono">{JSON.stringify(stripBsid(d?.TalkRoleNpc))}</td>
					</tr>
					{/if}
					<tr>
						<th>Next Dialogs</th>
						<td>{JSON.stringify(d.NextDialogs)}</td>
					</tr>
					<tr>
						<th>Talk Title</th>
						<td><Translated id={d.TalkTitleTextMapHash}/></td>
					</tr>
					<tr>
						<th>Talk Role Name</th>
						<td><Translated id={d.TalkRoleNameTextMapHash}/></td>
					</tr>
					{#if d.TalkShowType}
					<tr>
						<th>TalkShowType</th>
						<td>{d.TalkShowType}</td>
					</tr>
					{/if}
				</table>
            </div>
		</li>
	{/each}
</ul>

<style>
	.dialog {
		background-color: #f8f8f8;
		padding: 0.7em;
		border-radius: 8px;
		/* margin: em; */
	}

	.dialog a {
		font-size: inherit;
	}

	.mono {
		font-family: monospace;
	}

	@media(max-width: 640px) {
        .sm-break-table th,td {
            display: table-row;
        }
    }
</style>
