import { gitAvailable } from "./git.js"
import { reset } from "./util.js"

let version : string | null = null 

export function setVersion (commitId: string) {
    if (!gitAvailable()) {
        return
    }

    version = commitId
    reset()
}

export function getVersion () {
    return version
}
