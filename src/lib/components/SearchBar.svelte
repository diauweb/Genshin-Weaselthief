<script type="ts">
    export let form: { error?: string } = {};
    export let value: string = '';
    export let lang: string = 'cn';
</script>

{#if form?.error}
<div class="uk-alert-danger" data-uk-alert>
    <a class="uk-alert-close" data-uk-close href={'#'}> </a>
    {form.error}
</div>
{/if}

<form method="POST" action="/">
    <input type="search" name="kw" class="uk-input" value={value} placeholder="Search through game texts..."/>

    <div class="uk-flex buttons-column-small">
        <select class="uk-select uk-margin-top uk-margin-right option-inline" name="lang" value={lang}>
            <option value="cn">CHS</option>
            <option value="en">EN</option>
            <option value="jp">JP</option>
        </select>
        <button type="submit" class="uk-button uk-button-primary uk-margin-top">Search</button>
    </div>
</form>

<style class="postcss">
    .option-inline {
        width: 20% !important;
    }

    @media(max-width: 640px) {
        .buttons-column-small {
            flex-direction: column;
        }

        .option-inline {
            width: auto !important;
        }
    }

</style>