<script lang="ts">
	import SearchBar from "$lib/components/SearchBar.svelte";

    export let form: { error: string };
</script>

<SearchBar form={form} />