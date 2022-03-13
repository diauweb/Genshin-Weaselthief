<script>
	import { Router } from "@roxi/routify";
	import { routes } from "../.routify/routes";

	import {
    	provideFluentDesignSystem,
    	fluentBadge,
		fluentTextField,
		fluentButton
	} from "@fluentui/web-components";

	provideFluentDesignSystem().register(
		fluentBadge(),
		fluentTextField(),
		fluentButton(),
	);

</script>

<Router {routes} />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
