import express from 'express'
import fse from 'fs-extra'
import path from 'path'
import { getAllDialogs, getDialog, getReminder, getTalk, searchDialogContaining, searchReminder, searchTalkByDialog } from './dialog.js'
import * as git from './git.js'
import { getQuests } from './quest.js'
import { getAllNpcs, getDetailNpc, getNpc } from './role.js'
import { getAllText, getText, searchText } from './text.js'
import { getVersion, setVersion } from './version.js'
import morgan from 'morgan'
import * as db from './db.js'


const app = express();
const fallbackIndex = (await fse.readFile(path.resolve('./web/public/index.html'))).toString()
const accessLogStream = fse.createWriteStream(path.join('.', 'access.log'), { flags: 'a' })

app.use(express.static(path.resolve('web', 'public')))
app.use(express.json())
app.use(morgan('common', { stream: accessLogStream }))
app.use(morgan('dev', { skip: (req) => req.path == '/get_text' }))

if (git.gitAvailable()) {
    setVersion((await git.getVersioningCommit()).hash)
}

await db.initDatabase();

const api = express.Router()
api.get('/status', function (req, res) {
    res.json({
        version: 1
    })
})

async function ensureArg (req: any, res: any, v: string , cb: (v: string) => Promise<void>) {
    if (req.query[v]) {
        await cb(req.query[v])
    } else {
        res.status(400)
        res.json({
            ok: false,
            error: 'No search criteria provided'
        })
    }
}

function query (route : string, cb : (q: string) => any) {
    api.get(route, async function(req, res) {
        ensureArg(req, res, 'q', async v => {
            try {
                res.json({ ok: true, ...await cb(v) })
            } catch (error) {
                res.status(500).json({ ok: false, error })
            }
        })
    })
}

query('/npc', q => getNpc(q))

api.get('/search_text', async function(req, res) {
    ensureArg(req, res, 'q', async v => {
        try {
            console.time(`search ${req.query['lang']} ${v}`)
            const rst = await searchText(v, req.query['lang'] as string)
            res.json({ ok: true, ...rst })
        } catch (e) {
            console.log(e)
            res.json({ ok: false, error: e })
        } finally {
            console.timeEnd(`search ${req.query['lang']} ${v}`)
        }
    })
})

api.get('/search_dialogs', async function(req, res) {
    ensureArg(req, res, 'q', async v => {
        res.json({ ok: true, result: await searchDialogContaining(v) })
    })
})

query('/search_talk', q => searchTalkByDialog(q))
query('/get_talk', q => getTalk(q))
query('/get_quests', q => getQuests(q))
query('/search_reminders', q => searchReminder(q))
query('/get_reminder', q => getReminder(q))
query('/find_text', q => getAllText(q))
query('/npc_details', q => getDetailNpc(q))

api.get('/npcs', async (req, res) => res.json(await getAllNpcs()));

api.get('/get_text', async function(req, res) {
    ensureArg(req, res, 't', async v => {
        res.json({ ok: true, text: await getText(v) })
    })
})

api.get('/get_dialog', async function(req, res) {
    ensureArg(req, res, 't', async v => {
        res.json({ ok: true, dialog: await getDialog(v) })
    })
})

api.get('/dialog_set', async function(req, res) {
    ensureArg(req, res, 't', async v => {
        res.json({ ok: true, dialogs: await getAllDialogs(v) })
    })
})

api.get('/version', async function (req, res) {
    let __version__ = 'dev'
    return res.json({ 
        ok: true, 
        version: __version__,
        dataVersion: (await db.findOne('Version', { vid: db.currentOid() }))?.ver
    })
})

api.get('/introspect', async function (req, res) {
    let __buildDate__ = 'dev'
    let __version__ = 'dev'
    let __branch__ = 'dev'
    let currentVersion = await db.findOne('Version', { vid: db.currentOid() });
    let versions = await db.find('Version', {});

    res.json({
        ok: true,
        buildDate: __buildDate__,
        version: __version__,
        branch: __branch__,
        currentVersion,
        versions
    })
})

api.put('/set_version', async function (req, res) {
    setVersion(req.body.version)
    console.log('running on data version', getVersion())
})

app.use('/api', api)
app.use('*', function (req, res) {
    res.status(200).send(fallbackIndex)
})

app.listen(8081, () => {
    console.log(`app serving at http://0.0.0.0:${8081}`)
})
