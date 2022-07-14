import { gitAvailable } from "./git.js"

let version : string | null = null 

export function setVersion (commitId: string) {
    if (!gitAvailable()) {
        return
    }
    version = commitId
}

export function getVersion () {
    return version
}
