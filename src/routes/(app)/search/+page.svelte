<script lang="ts">
	import { lang } from '$lib/client-settings';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import TextRenderer from '$lib/components/TextRenderer.svelte';
	import { toDotVersion } from '$lib/util';
    
	export let data;
    let value = data.kw;
</script>

<SearchBar lang={data.lang} value={value}/>

<table class="uk-table uk-table-divider uk-table-small uk-table-striped sm-break-table">
    <tbody>
        {#each data.result as e}
		<tr>
            <td class="td-hash">
                <b><a href={`/text/${e.hash}`}>{e.hash}</a></b>
            </td>
            <!-- <td>
                <span class="weak">{toDotVersion(e._ver)}</span>
            </td> -->
            <td>
                <TextRenderer text={e[$lang]} highlight={data.kw} />
            </td>
        </tr>
	    {:else}
        <tr>
            <td><i>No matched text.</i></td>
        </tr>
        {/each}

        {#if data.more}
		<tr>
            <td></td>
            <td></td>
            <td>more...</td>
        </tr>
	    {/if}
    </tbody>
</table>

<style>
    @media(max-width: 640px) {
        .sm-break-table td {
            display: table-row;
        }
    }
</style>
