
interface Format {
    type: string
    children?: Formatted[]
    value?: string
}

export type Formatted = string | Format 

const COLOR_MATCHER = /<color=#([0-9A-Fa-f]{6,8})>\s*(.+?)<\/color>/g
const ITALIC_MATCHER = /<i>\s*(.+?)<\/i>/g

function color (raw: string): Formatted[] {
    let ret = []
    raw = raw.toString()
    let iter = raw.matchAll(COLOR_MATCHER)
    let i = 0
    let cur
    while (cur = iter.next().value) {
        ret.push(raw.substring(i, cur.index))
        ret.push({
            type: 'color',
            value: cur[1],
            children: [cur[2]]
        })
        i = cur.index + cur[0].length
    }
    ret.push(raw.substring(i, raw.length))
    return ret
}

export function renderText (raw: string) : Formatted {
    if (!raw) return raw
    return {
        type: 'root',
        children: color(raw)
    }
}
