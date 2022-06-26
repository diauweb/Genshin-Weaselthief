<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "@roxi/routify";
    import { getCommits } from "../../version-util.js";
    import TextRenderer from '../../components/TextRenderer.svelte'

    export let id;
    let text = { cn: "", en: "", jp: "" };
    onMount(async function () {
        let k = await fetch(`/api/get_text?t=${id}`);
        text = (await k.json()).text;
    });

    let loading = false;
    function searchDialogs() {
        if (loading) return;
        loading = true;
        fetch(`/api/search_dialogs?q=${encodeURIComponent(id)}`).then((v) =>
            v.json().then((e) => {
                if (e.result === null) {
                    alert("No dialogs were found");
                    loading = false;
                } else {
                    $goto(`/dialog/${e.result.Id}`);
                }
            })
        );
    }

    function searchReminders() {
        if (loading) return;
        loading = true;
        fetch(`/api/search_reminders?q=${encodeURIComponent(id)}`).then((v) =>
            v.json().then((e) => {
                if (e.result) {
                    $goto(`/reminder/${e.result}`);
                } else {
                    alert("No reminders were found");
                    loading = false;
                }
            })
        );
    }

    let htext = { cn: "", en: "", jp: "" };
    let selector;
    let loadButton;
    function loadHistory() {
        loadButton.disabled = true
        fetch(`/api/get_history_text?q=${id}&h=${selector.value}`).then(r => r.json()
            .then(o => {
                htext = o.text
                loadButton.disabled = false
            })
        )
    }
</script>

<h2>{id} Text:</h2>
<p><TextRenderer text={text.cn} /></p>
<p><TextRenderer text={text.en}/></p>
<p><TextRenderer text={text.jp}/></p>

<h2>Reverse Search</h2>
<ul>
    <li>
        <a href={"#"} on:click={searchDialogs}>Search {id} in dialogs</a>
    </li>
    <li>
        <a href={"#"} on:click={searchReminders}>Search {id} in reminders</a>
    </li>
    <li>Search {id} in ...</li>
</ul>

{#await getCommits() then c}
    <h2>History</h2>
    <fluent-select bind:this={selector}>
        {#each c as v}
            <fluent-option value={v.hash}>{v.ver}</fluent-option>
        {/each}
    </fluent-select>
    <fluent-button on:click={loadHistory} bind:this={loadButton}>Load</fluent-button>
    <p>{htext.cn}</p>
    <p>{htext.en}</p>
    <p>{htext.jp}</p>
{/await}
