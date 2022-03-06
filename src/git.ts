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
