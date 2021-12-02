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

let currentShelter
let selectedAnimals
let currentAnimal

function requestHandler(obj) {
    var newFile = '/views/login.html'
    if (isLogin(obj)) {
        newFile = '/views/findAPet.html'
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
        currentShelter = 'Fulton'
        return '/views/shelter1.html'
    }
    if (obj.hasOwnProperty('Atlanta')) {
        currentShelter = 'Atlanta'
        return '/views/shelter2.html'
    }
    if (obj.hasOwnProperty('DeKalb')) {
        currentShelter = 'Atlanta'
        return '/views/shelter3.html'
    }
    if (obj.hasOwnProperty('Best')) {
        currentShelter = 'Best'
        return '/views/shelter4.html'
    }
    return '';
}

_server.use(express.urlencoded({extended: true}))
_server.use(express.json())

//_server.use(express.static(path.join(__dirname ,'/assets')))
_server.use('/views', express.static(path.join(__dirname, '/views')))
// _server.use('/frontend/findAPet', express.static(path.join(__dirname, '/frontend/findAPet')))


_server.get('/', function(req, res) {
    console.log(__dirname)
    res.sendFile(path.join(__dirname, '/views/index.html'))
})


_server.post('/', function(req, res) {
    console.log(__dirname)
    console.log(req.body)
    res.sendFile(path.join(__dirname, requestHandler(req.body)))
})
let location_animals = {
    'Best': [{
            url: `https://picsum.photos/200`,
            name: `BEST 1`
        },
        {
            url: `https://picsum.photos/200`,
            name: `BEST 2`
        },
        {
            url: `https://picsum.photos/200`,
            name: `BEST 3`
        },
        {
            url: `https://picsum.photos/200`,
            name: `BEST 4`
        },
    ],
    'Atlanta': [{
            url: `https://picsum.photos/200`,
            name: `Atlanta Humane 1`
        },
        {
            url: `https://picsum.photos/200`,
            name: `Atlanta Humane 2`
        },
        {
            url: `https://picsum.photos/200`,
            name: `Atlanta Humane 3`
        },
        {
            url: `https://picsum.photos/200`,
            name: `Atlanta Humane 4`
        },
    ],
    'Fulton': [{
            url: `https://picsum.photos/200`,
            name: 'Fulton County',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'Fulton County',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'Fulton County',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'Fulton County',
        }
    ],
    'Dekalb': [
        {
            url: `https://picsum.photos/200`,
            name: 'Dekalb County',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'Dekalb County',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'Dekalb County',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'Dekalb County',
        }
    ],
}
_server.post('/shelter', function(req, res) {
    console.log('function called')
    console.log(__dirname)
    console.log(req.body)
    let location = req.body.location;
    let details_from_db = location_animals[location]
    let arr_of_html = []

    details_from_db.forEach(async function(details) {
        let html = `<li style = "text-align: center; align-items: center;">
                        <h4>Animal: ${details.name}</h4>
                        <img src ="${details.url}" width="10px" height="100px">
                    </li>
                    <li style = "text-align: center; align-items: center;">
                        <form method ="post" action="/">
                            <button>Select</button>
                        </form>
                    </li>`
        arr_of_html.push(html)
        console.log(html)
    })
    res.render('shelter1', {form: arr_of_html});
    //res.sendFile(path.join(__dirname, requestHandler(req.body)))
})

_server.get('/views/styles.css', function(req, res) {
    conao
    res.sendFile(path.join(__dirname, '/views/styles.css'))
})

_server.listen(port, function() {
    console.log("Web server listening on port: " + port)
})

