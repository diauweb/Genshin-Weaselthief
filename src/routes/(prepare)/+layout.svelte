<script lang="ts">
	// import 'uikit/dist/js/uikit';
	// import 'uikit/dist/css/uikit.css';
	import { onMount } from 'svelte';
	onMount(() => {
		setInterval(() => {
			window.location.reload();
		}, 5000);
	});
</script>

<div class="uk-container uk-margin-top">
    <h1>Genshin Weaselthief is loading</h1>
	<div data-uk-spinner></div> 
    <h3>Please wait while we are building data...</h3>
</div>
