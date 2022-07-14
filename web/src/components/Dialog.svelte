<script lang="ts">
    import { goto } from '@roxi/routify'

    import Translated from './Translated.svelte'
    import Role from './Role.svelte'
    export let data

    function gotoAndRefresh (dest) {
        $goto(`/dialog/${dest}`)
        // if(window) {
            // workaround
        //    window.location.pathname = `/dialog/${dest}`
        //}
    }
</script>

<div class="card" class:player="{data?.TalkRole__Type === 'TALK_ROLE_PLAYER'}">
    <details>
        <summary>
            <Translated id={data.TalkContentTextMapHash}/>
        </summary>
        <p>
            <b>Id</b> <a href={"#"} on:click="{() => gotoAndRefresh(data.Id)}">{data.Id}</a>
        </p>
        <p>
            <b>TalkRole</b> <Role role={{ Type: data.TalkRole__Type, Id: data.TalkRole__Id }}></Role>
        </p>
        <p>
            <b>Name</b> <Translated id={data.TalkRoleNameTextMapHash}/>
        </p>
        <p>
            <b>Title</b> <Translated id={data.TalkTitleTextMapHash}/>
        </p>
        <p>
            <b>Content:</b> <Translated id={data.TalkContentTextMapHash}/>
        </p>
        <p>
            <b>Next Dialog</b> 
            {#each data.NextDialogs as d}
                <a href={"#"} on:click="{() => gotoAndRefresh(d)}">{d} </a> 
            {/each}
        </p>
    </details>
</div>

<style>
    .card {
        background-color: #eee;
        margin: 5px;
        padding: 8px 10px;
        border-radius: 5px;
    }

    .card summary {
        cursor: pointer;
    }
    .player {
        background-color: rgb(230, 235, 210) !important;
    }
</style>