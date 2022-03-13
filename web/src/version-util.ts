
let data

export async function getIntrospection () {
    return data = await (await fetch('/api/introspect')).json()
}

export async function getCommits () {
    if (!data) {
        await getIntrospection()
    }
    if (!data.vcs) return []
    return data.commit.all
}
