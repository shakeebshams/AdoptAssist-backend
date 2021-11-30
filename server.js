import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'
import ejs from 'ejs'
import dotenv from 'dotenv'
import { truncateSync } from 'fs'
dotenv.config()

const port = process.env.PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const _server = express()
_server.set('view engine', 'ejs')

function requestHandler(obj) {
    // write to a JSON file
    // File locations for images of animals
    // Delete info after going back
    var newFile = '/frontend/login.html'
    if (isLogin(obj)) {
        newFile = '/frontend/findAPet.html'
    }
    return newFile
}

function isLogin(obj) {
    if (obj.hasOwnProperty('email') && obj.hasOwnProperty('password')) {
        return (obj.email != '' && obj.password != '')
    }
    return false
}

_server.use(express.urlencoded({extended: true}))
_server.use(express.json())

//_server.use(express.static(path.join(__dirname ,'/assets')))
_server.use('/frontend', express.static(path.join(__dirname, '/frontend')))
// _server.use('/frontend/findAPet', express.static(path.join(__dirname, '/frontend/findAPet')))


_server.get('/', function(req, res) {
    console.log(__dirname)
    res.sendFile(path.join(__dirname, '/frontend/index.html'))
})


_server.post('/', function(req, res) {
    console.log(__dirname)
    console.log(req.body)
    res.sendFile(path.join(__dirname, requestHandler(req.body)))
})

_server.get('/frontend/styles.css', function(req, res) {
    conao
    res.sendFile(path.join(__dirname, '/frontend/styles.css'))
})

_server.listen(port, function() {
    console.log("Web server listening on port: " + port)
})

