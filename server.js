import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'
import ejs from 'ejs'
import dotenv from 'dotenv'
import fs from 'fs'
import { dirname } from 'path/posix'
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
    if (isBackToMap(obj)) {
        newFile = '/views/findAPet.html'
    }
    return newFile
}

function isBackToMap(obj) {
    if (obj.hasOwnProperty('backToMap')) {
        return true
    }
    return false
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
        return '/views/shelter1.html'
    }
    if (obj.hasOwnProperty('DeKalb')) {
        currentShelter = 'DeKalb'
        return '/views/shelter1.html'
    }
    if (obj.hasOwnProperty('Best')) {
        currentShelter = 'Best'
        return '/views/shelter1.html'
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
            name: `BEST 1`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',
            shelterName: 'Best Friends Lifesaving Center'
        },
        {
            url: `https://picsum.photos/200`,
            name: `BEST 2`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: `BEST 3`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: `BEST 4`,
            age: '7',
            breed: 'Something',           
            info: 'Something About the Animal',

        },
    ],
    'Atlanta': [{
            url: `https://picsum.photos/200`,
            name: `Rosie`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',
            shelterName:'Atlanta Humane Society',

        },
        {
            url: `https://picsum.photos/200`,
            name: `Atlanta Humane 2`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: `Atlanta Humane 3`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: `Atlanta Humane 4`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
    ],
    'Fulton': [{
            url: `https://picsum.photos/200`,
            name: 'Fulton County',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',
            shelterName: 'Fulton County Animal Services'
        },
        {
            url: `https://picsum.photos/200`,
            name: 'Fulton County',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: 'Fulton County',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: 'Fulton County',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        }
    ],
    'DeKalb': [{
            url: `https://picsum.photos/200`,
            name: 'Dekalb County',
            age: '7',
            breed: 'Something',            
            info: 'Something About the Animal',
            shelterName: 'DeKalb County Animal Services',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'Dekalb County',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'Dekalb County',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'Dekalb County',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',
        },
    ],
    'Random': [{
            url: `https://picsum.photos/200`,
            name: 'Dekalb County',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',
        }
    ]
}
_server.post('/shelter', function(req, res) {
    console.log('function called')
    console.log(__dirname)
    console.log(req.body)
    isShelter(req.body)
    let location = req.body.location;
    console.log(location)
    let details_from_db = location_animals[location]
    console.log(details_from_db)
    let arr_of_html = []

    let header =`<div class="title">
                    <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <h1 class="heading" style = "text-align: center;"> ${details_from_db[0].shelterName}</h1>
                            <div class="mouse">
                        <div class="wheel"></div>
                        </div>
                    </a> </div>`
    arr_of_html.push(header)

    details_from_db.forEach(async function(details) {
        let html = `<li style = "text-align: center; align-items: center;">
                        <h4>Animal: ${details.name}</h4>
                        <img src ="${details.url}" width="10px" height="100px">
                        <div class = "Row"> 
                            ${details.age}
                            ${details.breed}
                            ${details.info}
                        </div>
                    </li>
                    <form method ="post" action="/SetUpMeetingTimePage">
                    <input type="text" name="petName" id="petName" hidden value=${details.name}>
                        <li style = "text-align: center; align-items: center;">
                                <button name = ${details.name} >Meet Me!</button>
                        </li>
                    </form>`

        arr_of_html.push(html)
        console.log(html)
    })
    res.render('shelter1', {form: arr_of_html});
    //res.sendFile(path.join(__dirname, requestHandler(req.body)))
})

_server.post('/SetUpMeetingTimePage', function(req, res) { 
    console.log(req.body)
    let HTMLToReturn = []
    currentAnimal = req.body.petName

    let startHTML = `<div class="title">
                    <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <h1 class="heading" style = "text-align: center;"> ${currentAnimal}</h1>
                            <div class="mouse">
                        <div class="wheel"></div>
                        </div>
                    </a> </div>`
    HTMLToReturn.push(startHTML)

    let endHTML = `
                    <form method="post" action="/shelter">
                    <input type="text" name="location" id="location1" hidden value=${currentShelter}>
                        <button name = "backToMap">
                            Back
                        </button>
                    </form>
                    `
    
    HTMLToReturn.push(endHTML)
 
    res.render('SetUpMeetingTimePage', {form: HTMLToReturn});
})

_server.get('/views/styles.css', function(req, res) {
    conao
    res.sendFile(path.join(__dirname, '/views/styles.css'))
})

_server.listen(port, function() {
    console.log("Web server listening on port: " + port)
})

