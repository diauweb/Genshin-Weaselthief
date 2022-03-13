import simpleGit from 'simple-git'

let git : ReturnType<typeof simpleGit>
let gitOk = false

try {
    git = simpleGit('./GenshinData')
    if(!await git.checkIsRepo()) throw new Error('data is not in a repository')
    gitOk = true
} catch (e) {
    console.log('git: git module not enabled:', (e as any).message)
}

export function gitAvailable () {
    return gitOk
}

export async function getCommit () {
    return git.log()
}

export async function getStatus () {
    return git.status()
}

let dataVersion : { fullVersion: string, version: string }
export async function getDataVersion () {
    if (dataVersion) return dataVersion

    if (!gitOk) return { fullVersion: 'live', version: 'live' }
    const log = await git.log({
        file: 'TextMap/',
        maxCount: 1
    })

    const shortver = /\d+\.\d+\.\d+/.exec(log.latest?.message!)?.[0] ?? '???'

    return dataVersion = {
        fullVersion: log.latest?.message!,
        version: shortver
    }
}

export async function getFile (name: string, commit: string) : Promise<Buffer | null> {
    const k = await git.raw('ls-tree', commit, name)
    const v = k.replace('\t', ' ').split(' ')[2]
    if (v?.length !== 40) {
        return null
    }
    const resp = await git.binaryCatFile(['blob', v])
    return resp
}
