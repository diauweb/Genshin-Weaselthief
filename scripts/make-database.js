import sql from 'better-sqlite3'
import fse from 'fs-extra'
import path from 'path'

const tableBase = './GenshinData/ExcelBinOutput'

async function listTables () {
    const dir = await fse.opendir(tableBase)
    let ent
    const ret = []
    while ((ent = await dir.read()) !== null) {
        ret.push(ent.name)
    }

    dir.close()
    return ret
}

async function getJSON (name) {
    const b = JSON.parse((await fse.readFile(path.join(tableBase, name))).toString())
    return b
}

function getFields (t) {
    const fields = new Map()
    const cases = new Map()

    for (const k of t) {
        Object.keys(k).forEach((e,i) => {
            if (cases.has(e.toLowerCase())) {
                if (cases.get(e.toLowerCase()) !== e) {
                    e = `${e}___${i}`
                }
            } else {
                cases.set(e.toLowerCase(), e)
            }
            
            let type
            if (typeof k[e] === 'number') {
                if (!!(k[e] % 1)) {
                    type = 'REAL'
                } else {
                    type = 'INTEGER'
                }
            } else {
                type = 'TEXT'
            }
            
            fields.set(e, type)
        })
    }

    const ret = Array
        .from(fields.entries())
        .reduce((acc, [name, type]) => [...acc, { name, type }], [])
    return ret
}

function getTableName (name) {
    return name.replace('.json', '')
}

function createTable (conn, name, t) {
    let fields = getFields(t).map(e => {
        let type = e.type
        return `"${e.name}" ${type}`
    }).join(', ')
    let create = `CREATE TABLE ${getTableName(name)} (
        _ID INTEGER PRIMARY KEY AUTOINCREMENT ${fields === '' ? '' : ','}
        ${fields}
    );`
    try {
        conn.exec(create)
    } catch (e) {
        console.log(create, e)
        process.exit(1)
    }
}

function addRows (conn, name, json) {
    let fields = getFields(json)
    
    if (fields.length === 0) return

    let keys = fields.map(e => e.name)
    let insert = `INSERT INTO ${getTableName(name)}
    (${keys.map(e => `"${e}"`).join(', ')}) VALUES (${Array(keys.length).fill('?').join(', ')})
    `

    let stmt = conn.prepare(insert)
    for (const i in json) {

        if (i % 1000 === 0) {
            console.timeLog(name, 'insert', i)
        } 
        
        const e = json[i]
        const args = keys.map((o, i) => {
            const k = o.split('___')[0]
            let v = e[k]

            if (typeof v === 'object') v = JSON.stringify(v)
            else if (typeof v === 'boolean') v = v? 1 : 0
            
            return v
        })

        try {
            stmt.run(...args)
        } catch (e) {
            console.log(insert, i, args, e)
            process.exit(1)
        }
    }
}

const tables = await listTables()
const db = sql('./database.db')
db.pragma('journal_mode = WAL')

for (const i in tables) {
    const [t, tl] = [tables[i], tables.length]

    console.log(t, `(${i}/${tl})`)
    console.time(t)
    const json = await getJSON(t)
    createTable(db, t, json)
    addRows(db, t, json)
    console.timeEnd(t)
}

db.close()
