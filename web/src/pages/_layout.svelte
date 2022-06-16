<script lang="ts">
    import { url } from '@roxi/routify'
    import { lang } from '../lang-store.js'
    
    let v
    let dv = { version: '?' }
    fetch('/api/version').then(e => e.json().then(k => [v, dv] = [k.version, k.dataVersion]))
</script>

<header>
    <div class="header-container">
        <div class="header-heading">
            <h1>Genshin-WeaselThief</h1>
            <fluent-badge>{v}</fluent-badge>
            <fluent-badge>{dv.version}</fluent-badge>
        </div>
        <nav>
            <div>
                <a href="{$url("/")}">Home</a> 
                <a href="{$url("/introspect")}">Introspect</a>
                <a href="{$url("/library")}">Library</a>
            </div>
            <div class="lang-box">
                <span on:click="{() => lang.set('cn')}" class:active="{$lang === 'cn'}">CN</span>
                <span on:click="{() => lang.set('en')}" class:active="{$lang === 'en'}">EN</span>
                <span on:click="{() => lang.set('jp')}" class:active="{$lang === 'jp'}">JP</span>
            </div>
        </nav>
    </div>
</header>

<main>
    <slot></slot>
</main>

<style>

header {
    background: #f2f0d8;
    width: 100%;
}

header .header-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 .8em;
}

.header-container .header-heading {
    display: flex;
    align-items: center;
}

.header-heading h1 {
    font-size: 1.2em;
}

.header-heading fluent-badge {
    --badge-fill-primary: #00FF00;
    --badge-fill-danger: #FF0000;
    --badge-color-light: #FFFFFF;
    --badge-color-dark: #000000;
}

nav {
    margin: 1em 0;
    display: flex;
}

main {
    margin: 1em;
}

.lang-box {
    display: inline-block;
    margin: 0 .5em;
}

.lang-box .active {
    font-weight: bold;
    color: rgb(55, 70, 75);
}

.lang-box span {
    margin: 5px;
    cursor: pointer;
    color: rgb(75, 75, 125);
}

</style>