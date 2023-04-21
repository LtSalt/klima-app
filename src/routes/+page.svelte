<script>
	import { scaleThreshold, schemeOranges } from 'd3';
	import { createViz } from '$lib/stores/viz.js';
	import { prepareMapData } from '$lib/helpers.js';

	export let data;
	const { pool, geo, metrics } = data;

	let metric = 'temp_dev';
	$: geo.district.features = prepareMapData(geo.district.features, metrics, 'ars', metric);

	const map = createViz();
	$: mapPath = $map.path;

	const fillScale = scaleThreshold([1, 1.5, 2, 2.5, 3, 3.5], schemeOranges[7]);
</script>

<section id="graphics" class="grid gap-4 border-4 p-4 md:grid-cols-2">
	<div use:map.container class="aspect-square border border-slate-500">
		<svg use:map.svg>
			<g use:map.g>
				<g use:map.create={{ type: 'chloropleth', projection: 'geoMercator', fit: geo.national }}>
					{#if $mapPath}
						{#each geo.district.features as feature}
							<path
								d={$mapPath(feature)}
								fill={fillScale(feature.metric)}
								class="stroke-white stroke-[0.1]"
							/>
						{/each}
						{#each geo.state.features as feature}
							<path d={$mapPath(feature)} class="fill-none stroke-black stroke-[0.2]" />
						{/each}
						{#each geo.national.features as feature}
							<path d={$mapPath(feature)} class="fill-none stroke-black stroke-[0.5]" />
						{/each}
					{/if}
				</g>
			</g>
		</svg>
	</div>
</section>
