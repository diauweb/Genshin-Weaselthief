<script lang="ts">
    import type { PageData } from './$types';
    import Translated from '$lib/components/Translated.svelte';
    import Dialogs from '$lib/components/Dialogs.svelte';

    export let data: PageData;
</script>

<h1>Reminder {data.id}s</h1>
<ul class="dialog" data-uk-accordion="multiple: true">
	{#each data.reminders as d}
		<li>
			<a class="uk-accordion-title" href={'#'}>
				<b>
				    <Translated id={d.SpeakerTextMapHash} />
				</b>
				<Translated id={d.ContentTextMapHash} />
			</a>
			<div class="uk-accordion-content">
                <b>Id:</b> {d.Id}
                <b>ShowTime:</b> {d.ShowTime}
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

</style>