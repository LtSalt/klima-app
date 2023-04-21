// probably better to move "create" to store setup, providing params

import { writable, derived, get } from "svelte/store";

export const createViz = (margins = {top:20, right: 20, bottom: 20, left: 20}) => {

    // DIMENSIONS
    const outerWidth = writable()
    const outerHeight = writable()
    const innerWidth = derived(outerWidth, $outerWidth => {
        if (outerWidth) return $outerWidth - margins.left - margins.right
    })
    const innerHeight =  derived(outerHeight, $outerHeight => {
        if (outerHeight) return $outerHeight - margins.left - margins.right
    })

    // INITIAL CONTENT
    const { subscribe, update } = writable(
        {
            margins,
            outerWidth,
            outerHeight,
            innerWidth,
            innerHeight
        }
    )

    // PRIVATE METHODS
    const _watchDims = (entries) => {
        const entry = entries[0]
        let width;
        let height;

        if (entry.borderBoxSize) {
            width = entry.borderBoxSize[0].inlineSize
            height = entry.borderBoxSize[0].blockSize
        } else {
            width = entry.contentRect.width
            height = entry.contentRect.height
        }

        update((that) => {
            that.outerWidth.update(() => width)
            that.outerHeight.update(() => height)

            return {...that} 
        })

        
    }
    const _transformToCenter = (entries) => {
        const element = entries[0].target
        const width = get(innerWidth)
        const height = get(innerHeight)

        element.setAttribute("transform", `translate(${width / 2}, ${height / 2})`)
    }
    
    // PUBLIC METHODS
    const container = (element) => {
        new ResizeObserver(_watchDims).observe(element);
    }
    const svg = (element) => {
        element.setAttribute("width", "100%")
        element.setAttribute("height", "100%")
    }
    const g = (element) => {
        element.setAttribute("transform", `translate(${margins.left}, ${margins.top})`)
    }
    const create = async(element, params) => {
        if (params.type === "chloropleth") {
            const { geoPath } = (await import("d3"))
            const projection = (await import("d3"))[params.projection]

            update(that => {
                const path = derived(
                    [that.innerWidth, that.innerHeight], 
                    ([$innerWidth, $innerHeight]) => {
                      return geoPath(projection().fitSize([$innerWidth, $innerHeight], params.fit));
                })
            return {...that, path}
            })
        }
        if (params.type === "donut") {
            new ResizeObserver(_transformToCenter).observe(element);
            // element.setAttribute("transform", `translate(${margins.left}, ${margins.top})`)

            const { pie, arc } = (await import("d3"))
            const makeArc = arc()
            const { data, fraction } = params
            const slices = derived(
                [innerWidth, innerHeight], 
                ([$innerWidth, $innerHeight]) => {
                    const radius = Math.min($innerWidth, $innerHeight) / 2;
                    const specs = pie().value(d => d)(data).map(({ startAngle, endAngle }) => {
                        return {
                            innerRadius: radius * fraction,
                            outerRadius: radius,
                            startAngle,
                            endAngle
                        }
                    })
                    return specs.map(d => makeArc(d))
                }
            )
            update(that => {
                console.log("updating")
                return {...that, slices}
            })
        }
    }

    return {
        subscribe,
        container,
        svg,
        g,
        create
    }
}