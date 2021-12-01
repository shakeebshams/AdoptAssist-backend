import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'
import ejs from 'ejs'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

const port = process.env.PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const _server = express()
_server.set('view engine', 'ejs')

function requestHandler(obj) {
    var newFile = '/frontend/login.html'
    if (isLogin(obj)) {
        newFile = '/frontend/findAPet.html'
    }
    if (isShelter(obj) != '') {
        newFile = isShelter(obj)
    }
    return newFile
}

function isLogin(obj) {
    if (obj.hasOwnProperty('email') && obj.hasOwnProperty('password')) {
        return (obj.email != '' && obj.password != '')
    }
    return false
}

function isShelter(obj) {
    if (obj.hasOwnProperty('Fulton')) {
        return '/frontend/shelter1.html'
    }
    if (obj.hasOwnProperty('Atlanta')) {
        return '/frontend/shelter2.html'
    }
    if (obj.hasOwnProperty('DeKalb')) {
        return '/frontend/shelter3.html'
    }
    if (obj.hasOwnProperty('Best')) {
        return '/frontend/shelter4.html'
    }
    return '';
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

