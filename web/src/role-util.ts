
const roles = new Map<number, Promise<any>>()

export async function getRole(id: number | string) {
    let g = roles.get(parseInt(id as any))
    if (g) {
        return g
    } else {
        const p = new Promise((resolve) => {
            fetch(`/api/npc?q=${id}`).then(f => f.json().then(j => {
                resolve(j)
            }))
        })
        roles.set(parseInt(id as any), p)
        return p
    }
}
