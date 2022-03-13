<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "@roxi/routify";

    export let id;
    let text = { CHS: "", EN: "", JP: "" };
    onMount(async function () {
        let k = await fetch(`/api/get_text?t=${id}`);
        text = (await k.json()).text;
    });

    let loading = false
    function searchDialogs () {
        if (loading) return
        loading = true
        fetch(`/api/search_dialogs?q=${encodeURIComponent(id)}`)
            .then(v => v.json().then(e => {
                if (e.result.length <= 0) {
                    alert('No dialogs were found')
                    loading = false
                } else {
                    $goto(`/dialog/${e.result[0].Id}`)
                }
        }))
    }
</script>

<h2>{id} Text:</h2>
<p>{text.CHS}</p>
<p>{text.EN}</p>
<p>{text.JP}</p>

<h2>Reverse Search</h2>
<ul>
    <li>
        <a href={"#"} on:click={searchDialogs}>Search {id} in dialogs</a>
    </li>
    <li>Search {id} in ...</li>
</ul>
