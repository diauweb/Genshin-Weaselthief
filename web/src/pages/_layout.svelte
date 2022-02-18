<script lang="ts">
    import { url } from '@roxi/routify'
</script>
<h1>Genshin-WeaselThief</h1>
<nav>
    Navigation: 
    <a href="{$url("/")}">Home</a>
</nav>
<main>
    <slot></slot>
</main>

<style>
nav {
    margin: 1em 0;
}
</style>