<script>
	import { createViz } from '$lib/stores/viz.js';

	export let data;
	const map = createViz();
</script>

<section id="graphics" class="grid gap-4 border-4 p-4 md:grid-cols-2">
	<div use:map.container class="aspect-square border border-slate-500">
		<svg use:map.svg>
			<g use:map.g />
		</svg>
	</div>
</section>
