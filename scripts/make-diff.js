import ExcelJS from 'exceljs'
import ProgressBar from 'progress'
import fs from 'fs'
import deepEqual from 'fast-deep-equal'
import simpleGit from 'simple-git'

// if (process.argv.length < 4) {
//     console.log(`Usage: make-diff.js <fromSHA> <toSHA>`)
//     process.exit(1)
// }

// const [v1, v2] = [process.argv[2], process.args[3]]

const [v1, v2] = ["ebb117f78dab56e704853b71fa60f45ee2cefe79", "d56ed231c4513963d27051dd6f7828f0e06c2588"]

const git = simpleGit('./GenshinData')

async function getContent (name, commit) {
    const k = await git.raw('ls-tree', commit, name);
    const v = k.replace('\t', ' ').split(' ')[2];
    if (v?.length !== 40) {
        return null;
    }
    const resp = await git.binaryCatFile(['blob', v]);
    return resp;
}

const workbook = new ExcelJS.Workbook();
const mainSheet = workbook.addWorksheet('Summary')

const report = {
}

async function getVersion(sha) {
    const log = await git.log([sha])
    const shortver = /\d+\.\d+\.\d+/.exec(log.latest?.message)?.[0] ?? '???'

    return { ver: shortver, msg: log.latest?.message }
}

const v1l = JSON.parse(await getContent('TextMap/TextMapCHS.json', v1))
const v2l = JSON.parse(await getContent('TextMap/TextMapCHS.json', v2))

const fillType = {
    add: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10FFCB' } },
    delete: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC42021' } },
    modify: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE066' } },
    orig: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE088' } },
}

async function addLangDiff() {
    const sheet = workbook.addWorksheet('Language Mappings')
    const v1lKeys = Object.keys(v1l)
    const v2lKeys = Object.keys(v2l)
    const diff = []

    const progess = new ProgressBar('TextMap [:bar] :current/:total D=:diff', { total: v2lKeys.length + 1 })
    for (const o of v2lKeys) {
        if (v1l[o] === undefined) {
            diff.push({ type: 'add', value: o, new: v2l[o] })
        } else {
            const s = v2l[o]
            const v = v1l[o]
            if (s !== v) {
                diff.push({ type: 'modify', value: o, new: s, old: v })
            }
        }
        progess.tick({ diff: diff.length })
    }

    for (const o of v1lKeys) {
        if (v2l[o] === undefined) {
            diff.push({ type: 'delete', value: o, old: v1lKeys[o] })
        }
    }
    progess.tick({ diff: diff.length })

    sheet.columns = [
        { header: 'state', width: 8 },
        { header: 'key', width: 10 },
        { header: 'value', width: 100 },
        { header: 'old_value', width: 100 },
    ]

    for (const k of diff) {
        if (k.new === '') continue
        const row = sheet.addRow([k.type, k.value, k.new, k.old])
        row.getCell(1).fill = fillType[k.type]
    }
}

async function addDiff(tableName, dispName, masterKey, compares) {
    const sheet = workbook.addWorksheet(dispName)
    
    let v1t = JSON.parse(await getContent(tableName, v1))
    let v2t = JSON.parse(await getContent(tableName, v2))
    
    // lowercase all keys to ignore the cAsE changes
    v1t = v1t.map(e => {
        const obj = {}
        Object.keys(e).forEach(k => obj[k.toLowerCase()] = e[k])
        return obj
    })
    v2t = v2t.map(e => {
        const obj = {}
        Object.keys(e).forEach(k => obj[k.toLowerCase()] = e[k])
        return obj
    })
    masterKey = masterKey.toLowerCase()

    let v1o = {}
    let v2o = {}
    v1t.forEach(e => v1o[e[masterKey]] = e)
    v2t.forEach(e => v2o[e[masterKey]] = e)
    
    const v1lKeys = Object.keys(v1o)
    const v2lKeys = Object.keys(v2o)
    const diff = []
    const progress = new ProgressBar(`${dispName} [:bar] :current/:total D=:diff`, { total: v2lKeys.length + 1 })
    
    for (const o of v2lKeys) {
        if (v1o[o] === undefined) {
            diff.push({ type: 'add', id: o, value: v2o[o] })
        } else {
            const s = v2o[o]
            const v = v1o[o]

            let dirty = false
            for (const kk of compares) {
                const ck = kk.toLowerCase()
                if (!deepEqual(s[ck], v[ck])) {
                    dirty = true
                    break
                }
                if (ck.endsWith("textmaphash")) {

                    // skip strip differences
                    if (v1l[v[ck]] === '' && v2l[s[ck]] === undefined) {
                        continue
                    }

                    if (v2l[s[ck]] !== v1l[v[ck]]) {
                        dirty = true
                        break
                    }
                }
            }

            if (dirty) {
                diff.push({ type: 'modify', id: o, value: v })
                diff.push({ type: 'orig', id: o, value: s })
            }
        }
        progress.tick({ diff: diff.length })
    }

    for (const o of v1lKeys) {
        if (v2o[o] === undefined) {
            diff.push({ type: 'delete', id: o, value: v1lKeys[o] })
        }
    }
    progress.tick({ diff: diff.length })

    sheet.columns = [
        { header: 'state' },
        { header: 'id' },
        ...compares.map(e => ({ header: e, width: 50 }))
    ]

    for (const k of diff) {
        const vs = compares.map(ek => {
            const e = ek.toLowerCase()
            if (e.endsWith("textmaphash")) {
                const t = k.type === 'orig' ? v1l : v2l
                return t[k.value[e]]
            } else {
                return k.value[e]
            }
        })
        const row = sheet.addRow([k.type, k.id, ...vs])
        row.getCell(1).fill = fillType[k.type]
    }
    
    const tableKey = tableName.replace(/.*\/?(.*)\.json/, '$1')
    report[`len_table_${tableKey}`] = [v1t.length, v2t.length]
    report[`diff_table_${tableKey}`] = [diff.length]
}


async function createSummaryPage() {
    mainSheet.columns = [
        { header: 'Property', id: 'prop', width: 25 },
        { header: 'A', id: 'a', width: 50 },
        { header: 'B', id: 'b', width: 50 }
    ]

    function add(prop, a, b) {
        mainSheet.addRow([prop, a, b])
    }

    const [o1, o2] = await Promise.all([v1, v2].map(e => getVersion(e)))
    add('commit', v1, v2)
    add('version', o1.ver, o2.ver)
    add('commit_message', o1.msg, o2.msg)
    for (const k of Object.keys(report)) {
        add(k, ...report[k])
    }
}

async function main() {
    workbook.creator = 'Genshin Weaselthief'
    workbook.created = new Date()
    workbook.calcProperties.fullCalcOnLoad = true

    await addLangDiff()
    const diffs = JSON.parse(fs.readFileSync('./scripts/diffs.json').toString())
    for (const k of diffs) {
        await addDiff(...k)
    }
    await createSummaryPage()
    await workbook.xlsx.writeFile(`diff-${(await getVersion(v1)).ver}-${(await getVersion(v2)).ver}.xlsx`)
}

await main()