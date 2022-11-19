<script lang="ts">
	import 'uikit/dist/js/uikit';
	import 'uikit/dist/css/uikit.css';
	import Lang from './Lang.svelte';

	let ver = __version__;
	export let data: { dataver: { ver: string }};
</script>

<header>
	<div class="uk-navbar-container uk-padding uk-padding-remove-vertical" data-uk-navbar>
		<div class="uk-navbar-left">
			<a href="/" class="uk-navbar-item uk-logo">Genshin Weaselthief</a>
			<div>
				<span class="uk-badge">{ver}</span>
				<span class="uk-badge">{data?.dataver.ver}</span>
			</div>
			<ul class="uk-navbar-nav">
				<li><a href="/">Home</a></li>
				<li>
					<a href={"#"}>Data</a>
					<div class="uk-navbar-dropdown">
						<ul class="uk-nav uk-navbar-dropdown-nav">
							<li><a href="/npc">NPC</a></li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
		<div class="uk-navbar-right">
			<Lang />
		</div>
	</div>
</header>



<main class="uk-container uk-margin-top container">
	<slot/>
</main>

<footer class="uk-margin-large-top">
	<hr/>
	<div class="uk-container">
        <div class="uk-card">
            <h3 class="uk-card-title">Genshin Weaselthief</h3>
            <p>
                This project is made for educational and research purpose.<br>
                This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with miHoYo, or any of its subsidiaries or its affiliates. <br>
                Genshin Impact as well as related names, marks, emblems and images are registered trademarks of their respective owners.
            </p>
        </div>
    </div>
</footer>

<style>
	.container {
		min-height: 60vh;
	}
</style>