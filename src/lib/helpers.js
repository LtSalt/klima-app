export function prepareMapData(features, metrics, id, metric) {
    const lookup = new Map();

    metrics.forEach((d) => {
        lookup.set(d[id], d[metric]);
    });
    features = features.map((f) => {
        const value = lookup.get(f.properties[id]);
        return { ...f, metric: value };
    });
    return features
}