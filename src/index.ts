import express from 'express'
import { searchText } from './text.js'
import path from 'path'

const app = express()

app.use(express.static('web/public'))

const api = express.Router()
api.get('/status', function (req, res) {
    res.json({
        version: 1
    })
})

api.get('/search', function(req, res) {
    if (req.query.q) {
        const result = searchText(req.query.q.toString())
        res.json({
            ok: true,
            result
        })
    } else {
        res.status(400)
        res.json({
            ok: false,
            error: 'No search criteria provided'
        })
    }
})

app.use('/api', api)
app.use('*', function (req, res) {
    res.sendFile(path.resolve('web/public/index.html'), { status: 200 })
})

app.listen(8081, () => {
    console.log('app serving at http://localhost:8081')
})