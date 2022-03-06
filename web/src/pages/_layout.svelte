<script lang="ts">
    import { url } from '@roxi/routify'
    import { lang } from '../lang-store.js'
    
    let v
    fetch('/api/version').then(e => e.json().then(k => v = k.version))
</script>
<h1>Genshin-WeaselThief</h1>
<p style="margin-top: -0.67em;">{v}</p>
<nav>
    Navigation:
    <a href="{$url("/")}">Home</a> 
    <a href="{$url("/introspect")}">Introspect</a>
    <b> | </b>
    Language:
    <div class="lang-box">
        <span on:click="{() => lang.set('CHS')}" class:active="{$lang === 'CHS'}">CHS</span>
        <span on:click="{() => lang.set('EN')}"  class:active="{$lang === 'EN'}">EN</span>
        <span on:click="{() => lang.set('JP')}"  class:active="{$lang === 'JP'}">JP</span>
    </div>
</nav>
<main>
    <slot></slot>
</main>

<style>
nav {
    margin: 1em 0;
}

.lang-box {
    display: inline-block;
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