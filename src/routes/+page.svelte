<script>
	import { create, scaleThreshold, schemeOranges, arc } from 'd3';
	import { createViz } from '$lib/stores/viz.js';
	import { prepareMapData } from '$lib/helpers.js';

	export let data;
	const { pool, geo, metrics } = data;

	let metric = 'temp_dev';
	$: geo.district.features = prepareMapData(geo.district.features, metrics, 'ars', metric);

	const map = createViz();
	$: mapPath = $map.path;

	const donut = createViz();
	$: ({ slices } = $donut);
	const templates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	const fillScale = scaleThreshold([1, 1.5, 2, 2.5, 3, 3.5], schemeOranges[7]);
</script>

<section id="graphics" class="grid gap-4 border-4 p-4 md:grid-cols-2">
	<div use:donut.container class="aspect-square border border-slate-500">
		<svg use:donut.svg>
			<g use:donut.g>
				<g use:donut.create={{ type: 'donut', data: Array(12).fill(1), fraction: 2 / 3 }}>
					{#if $slices}
						{#each templates as template}
							<path d={$slices[template - 1]} class="fill-none stroke-black" />
						{/each}
					{/if}
				</g>
			</g>
		</svg>
	</div>
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
