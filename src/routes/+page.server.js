import { prisma } from "$lib/server/prisma.js"

export async function load() {
    const getGeometries = async() => {
        const data =  await prisma.geometry.findMany()
        return Object.fromEntries(data.map(d => [d.level, d.geojson]))
        }
    const getDistricts = async() => {
        return await prisma.district.findMany()
    }
    const getMetrics = async() => {
        return await prisma.Periodic_Annual.findMany({
            where: {
                period: "2018-2022"
            }
        })
    }
    return { geo: getGeometries(), pool: getDistricts(), metrics: getMetrics()}
}