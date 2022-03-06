import express from 'express'
import { getText, searchText } from './text.js'
import path from 'path'
import fse from 'fs-extra'
import { getAllDialogs, getDialog, searchDialogContaining } from './dialog.js'

import * as git from './git.js'
import { getNpc } from './role.js'

const app = express()
const fallbackIndex = (await fse.readFile(path.resolve('./web/public/index.html'))).toString()

app.use(express.static(path.resolve('web', 'public')))

const api = express.Router()
api.get('/status', function (req, res) {
    res.json({
        version: 1
    })
})

function ensureArg (req: any, res: any, v: string , cb: (v: string) => void) {
    if (req.query[v]) {
        cb(req.query[v])
    } else {
        res.status(400)
        res.json({
            ok: false,
            error: 'No search criteria provided'
        })
    }
}

function query (route : string, cb : (q: string) => any) {
    api.get(route, function(req, res) {
        ensureArg(req, res, 'q', v => {
            try {
                res.json({ ok: true, ...cb(v) })
            } catch (error) {
                res.status(500).json({ ok: false, error })
            }
        })
    })
}

query('/npc', q => getNpc(q))

api.get('/search_text', function(req, res) {
    ensureArg(req, res, 'q', v => {
        res.json({ ok: true, ...searchText(v, req.query['lang'] as string) })
    })
})

api.get('/search_dialogs', function(req, res) {
    ensureArg(req, res, 'q', v => {
        res.json({ ok: true, result: searchDialogContaining(v) })
    })
})

api.get('/get_text', function(req, res) {
    ensureArg(req, res, 't', v => {
        res.json({ ok: true, text: getText(v) })
    })
})

api.get('/get_dialog', function(req, res) {
    ensureArg(req, res, 't', v => {
        res.json({ ok: true, dialog: getDialog(v) })
    })
})

api.get('/dialog_set', function(req, res) {
    ensureArg(req, res, 't', v => {
        res.json({ ok: true, dialogs: getAllDialogs(v) })
    })
})

api.get('/version', async function (req, res) {
    let __version__ = 'dev'
    return res.json({ ok: true, version: __version__ })
})

api.get('/introspect', async function (req, res) {
    let __buildDate__ = 'dev'
    let __version__ = 'dev'
    let __branch__ = 'dev'
    let data, commit
    if (git.gitAvailable()) {
        data = await git.getStatus()
        commit = await git.getCommit()
    }

    res.json({
        ok: true,
        buildDate: __buildDate__,
        version: __version__,
        branch: __branch__,
        vcs: git.gitAvailable(),
        status: data,
        commit
    })
})

app.use('/api', api)
app.use('*', function (req, res) {
    res.status(200).send(fallbackIndex)
})

app.listen(8081, () => {
    console.log('app serving at http://localhost:8081')
})
