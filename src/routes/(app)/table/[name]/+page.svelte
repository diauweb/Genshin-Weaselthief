<script>
    import Translated from "$lib/components/Translated.svelte";

    export let data;

    function pagination(c, m) {
        var current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;
        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i);
            }
        }
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    }
</script>

<ul class="uk-breadcrumb">
    <li><a href="/table">Tables</a></li>
    <li><span>{data.name}</span></li>
</ul>

<p>Showing #{(data.page - 1) * 100}~{data.page * 100 - 1 >= data.len ? data.len - 1 : data.page * 100 - 1} of {data.len}
    items</p>
<ul class="uk-pagination">
    <li class:uk-disabled={data.page <= 1}><a href={`?page=${data.page-1}`}><span
            data-uk-pagination-previous></span></a></li>
    {#each pagination(data.page, data.allPage) as p}
        {#if p === '...'}
            <li class="uk-disabled"><span>{p}</span></li>
        {:else if p === data.page}
            <li class="uk-active"><span>{p}</span></li>
        {:else}
            <li><a href={`?page=${p}`}>{p}</a></li>
        {/if}
    {/each}
    <li class:uk-disabled={data.page >= data.allPage}><a href={`?page=${data.page+1}`}><span
            data-uk-pagination-next></span></a></li>
</ul>

<table class="uk-table uk-table-striped uk-table-small uk-table-responsive">
    <thead>
    <tr>
        {#each data.data.mapper as m}
            <th>{m}</th>
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each data.data.table as t (t[0])}
        <tr>
            {#each t as e, i}
                {#if data.data.mapper[i].endsWith('MapHash')}
                    <td>
                        <Translated id={e}/>
                    </td>
                {:else if typeof e === 'object' || Array.isArray(e)}
                    <td class="uk-text-truncate">{JSON.stringify(e)}</td>
                {:else if e === undefined }
                    <td></td>
                {:else}
                    <td>{e}</td>
                {/if}
            {/each}
        </tr>
    {/each}
    </tbody>
</table>

