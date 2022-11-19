<script lang="ts">
    import { lang } from '$lib/client-settings';
    
</script>

<div class="lang-box">
    <a href={"#"} on:click="{() => lang.set('cn')}" class:active="{$lang === 'cn'}">CN</a>
    <a href={"#"} on:click="{() => lang.set('en')}" class:active="{$lang === 'en'}">EN</a>
    <a href={"#"} on:click="{() => lang.set('jp')}" class:active="{$lang === 'jp'}">JP</a>
</div>

<style>
    .active {
        font-weight: bold;
    }

    .lang-box a {
        margin: 5px;
        cursor: pointer;
        color: rgb(75, 75, 125);
    }

    .lang-box a:hover {
        text-decoration: none;
    }
</style>