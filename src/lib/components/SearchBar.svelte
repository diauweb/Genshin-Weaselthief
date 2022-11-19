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
    <select class="uk-select option-inline uk-margin-top uk-margin-right" name="lang" value={lang}>
        <option value="cn">CHS</option>
        <option value="en">EN</option>
        <option value="jp">JP</option>
    </select>
    <button type="submit" class="uk-button uk-button-primary uk-margin-top">Search</button>
</form>

<style>
    .option-inline {
        width: 10% !important;
    }
</style>