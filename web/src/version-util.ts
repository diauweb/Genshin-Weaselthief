
let data
let verTable

export async function getIntrospection () {
    return data = await (await fetch('/api/introspect')).json()
}

export async function getCommits () {
    if (!data) {
        await getIntrospection()
        verTable = {}
        data.versions.forEach(e => verTable[e.vid] = e);
    }
    return data.versions
}

export async function findByOid (oid) {
    await getCommits();
    return verTable[oid];
}