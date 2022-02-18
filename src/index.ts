import express from 'express'
import { getText, searchText } from './text.js'
import path from 'path'
import fse from 'fs-extra'
import { getAllDialogs, getDialog, searchDialogContaining } from './dialog.js'

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

api.get('/search_text', function(req, res) {
    ensureArg(req, res, 'q', v => {
        res.json({ ok: true, result: searchText(v) })
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

app.use('/api', api)
app.use('*', function (req, res) {
    res.status(200).send(fallbackIndex)
})

app.listen(8081, () => {
    console.log('app serving at http://localhost:8081')
})