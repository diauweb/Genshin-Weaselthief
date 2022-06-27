<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "@roxi/routify";
    import TextRenderer from '../../components/TextRenderer.svelte'
    import { findByOid } from "../../version-util";

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

    let hTexts = [];
    let loadButton;
    function loadHistory() {
        loadButton.disabled = true
        fetch(`/api/find_text?q=${id}`).then(r => r.json()
            .then(o => {
                hTexts = [...o.result]
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

<h2>History</h2>
<fluent-button on:click={loadHistory} bind:this={loadButton}>Load History</fluent-button>
<div style="margin: 1em 0">
    <fluent-accordion>
        {#each hTexts as t}
            <fluent-accordion-item>
                <span slot="heading">{#await findByOid(t._ver) then v}{v.ver}{/await}</span>
                <p><TextRenderer text={t.cn} /></p>
                <p><TextRenderer text={t.en}/></p>
                <p><TextRenderer text={t.jp}/></p>
            </fluent-accordion-item>
        {/each}
    </fluent-accordion>
</div>
