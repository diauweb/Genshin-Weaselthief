<script>
    import { getRole } from '../role-util.js'
    import Translated from './Translated.svelte'
    export let role
    
    
    let summaryName = JSON.stringify(role)
    let translation = false
    let npcInfo

    if (role.Type === 'TALK_ROLE_NPC') {
        getRole(role.Id).then(j => {
            if (j?.result?.NameTextMapHash) {
                summaryName = j.result.NameTextMapHash
                translation = true
            }
            npcInfo = j.result
        })
    } else if (role.Type === 'TALK_ROLE_PLAYER') {
        summaryName = 'Player'
    }
</script>

<details>
    <summary>
        {#if translation}
            <Translated id={summaryName}/>
        {:else}
            {summaryName}
        {/if}
    </summary>
    <pre>{ JSON.stringify(role) }</pre>
    {#if npcInfo}
    <pre>{ JSON.stringify(npcInfo) }</pre>
    {/if}
</details>

<style>
    pre {
        overflow-x: auto;
    }

    pre::-webkit-scrollbar {
        height: 4px;
    }

    pre::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, .5);
        border-radius: 999px;
    }
</style>
