<script lang="ts">
    import { lang } from '$lib/client-settings';
	import Translated from '$lib/components/Translated.svelte';
    export let data;
</script>

<h1>Document {data.document.Id}</h1>
<table class="uk-table uk-table-small uk-table-divider">
    <tr>
        <th>ContentLocalizedId</th>
        <td>{data.document.ContentLocalizedId}</td>
    </tr>
    <tr>
        <th>PreviewPath</th>
        <td>{data.document.PreviewPath}</td>
    </tr>
    <tr>
        <th>AssetType</th>
        <td>{data.content.AssetType}</td>
    </tr>
    <tr>
        <th>DefaultPath</th>
        <td>{data.content.DefaultPath}</td>
    </tr>
</table>
<article>
<h5><Translated id={data.document.TitleTextMapHash}/></h5>
<p class="content">
{#if $lang === 'en'}
{data.text.en};
{:else if $lang === 'jp'}
{data.text.jp}
{:else}<!-- is chinese -->
{data.text.cn}
{/if}
</p>
</article>

<style>
    .content {
        white-space: pre-wrap;
    }
</style>