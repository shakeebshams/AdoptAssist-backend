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
let savedAnimals = []
let upcomingAppts = []
let animalsWithAdoptionForms = []
let currentAnimal
let currentUserEmail

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
        if (obj.email != '' && obj.password != '') {
            currentUserEmail = obj.email
            return true
        }
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
            name: `Josh`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',
            shelterName: 'Best Friends Lifesaving Center'
        },
        {
            url: `https://picsum.photos/200`,
            name: `Dooly`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: `Bud`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: `Light`,
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
            name: `Monkey`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: `NotMonkey`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: `Smoll`,
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
    ],
    'Fulton': [{
            url: `https://picsum.photos/200`,
            name: 'AJ',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',
            shelterName: 'Fulton County Animal Services'
        },
        {
            url: `https://picsum.photos/200`,
            name: 'StellaArtois',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: 'BingeDrinking',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        },
        {
            url: `https://picsum.photos/200`,
            name: 'Cocaine',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',

        }
    ],
    'DeKalb': [{
            url: `https://picsum.photos/200`,
            name: 'AlexisTexas',
            age: '7',
            breed: 'Something',            
            info: 'Something About the Animal',
            shelterName: 'DeKalb County Animal Services',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'TummyTux',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'PromNight',
            age: '7',
            breed: 'Something',
            info: 'Something About the Animal',
        },
        {
            url: `https://picsum.photos/200`,
            name: 'Punk',
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

function getHTMLToRenderForShelter(obj) {
    currentShelter = obj.location
    let location = obj.location
    //console.log(location)
    let details_from_db = location_animals[location]
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

        arr_of_html.push(html);
    })
    return arr_of_html;
}


_server.post('/shelter', function(req, res) {
    //console.log(req.body)
    let arr_of_html = getHTMLToRenderForShelter(req.body)

    res.render('shelter1', {form: arr_of_html});
    //res.sendFile(path.join(__dirname, requestHandler(req.body)))
})

_server.post('/SetUpMeetingTimePage', function(req, res) { 
    //console.log(req.body)
    //console.log(currentShelter)
    let HTMLToReturn = []
    currentAnimal = req.body.petName
    let animal_from_db = location_animals[currentShelter]
    //console.log(animal_from_db)
    animal_from_db = animal_from_db.find(x => x.name == currentAnimal)
    let appointmentDisabled = ''
    let formDisabled = ''
    if (!((upcomingAppts.length > 0) && (upcomingAppts.filter(x => x.name == currentAnimal && x.email == currentUserEmail).length != 0))) {
        formDisabled = 'disabled = "true"'
    } else {
        if (completedForms.length > 0 && (completedForms.filter(x => x => x.name == currentAnimal && x.email == currentUserEmail).length != 0)) {
            formDisabled = 'disabled = "true"'
        }
        appointmentDisabled = 'disabled = "true"'
    }

    let startHTML = `<div class="title">
                        <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <img src ="${animal_from_db.url}" width="10px" height="100px">
                            <h1 class="heading" style = "text-align: center;"> ${currentAnimal}</h1>
                            <h2 class="heading">Adopt Me</h2>

                            <h3 class="heading">A little bit about me!</h3>
                            <h4 class="heading">Name: ${animal_from_db.name}</h4>
                            <h4 class="heading">Age: ${animal_from_db.age}</h4>
                            <h4 class="heading">Age: ${animal_from_db.breed}</h4>
                            <h4 class="heading">${animal_from_db.info}</h4>


                            <h3 class="heading">First fill outa  time to meet me!</h3>
                            <form method="post" action="/meetingTimePage">
                                <input type="text" name="petName" id="petName" hidden value=${currentAnimal}>
                                <button name = ${currentShelter} ${appointmentDisabled}>
                                    Set up an appointment
                                </button>
                            </form>

                            <h3 class="heading">Optionally fill out an adoption form!</h3>
                            <form method="post" action="/adoptionForm">
                                <input type="text" name="petName" id="petName" hidden value=${currentAnimal}>
                                <button name = "fillOutForm" ${formDisabled}>
                                    Fill out Adoption Form
                                </button>
                            </form>
                            <div class="mouse">
                        <div class="wheel"></div>
                        </div>
                    </a> </div>`
    HTMLToReturn.push(startHTML)

    let endHTML = `
                    <div class = "row">
                    <form method="post" action="/shelter">
                    <input type="text" name="location" id="location1" hidden value=${currentShelter}>
                        <button name = "backToMap">
                            Back
                        </button>
                    </form>
                    <form method="post" action="/saveAnimal">
                    <input type="text" name="petName" id="petName" hidden value=${currentAnimal}>
                        <button name = "backToMap">
                            Or save me for later!
                        </button>
                    </form>
                    </div>
                    `
    
    HTMLToReturn.push(endHTML)
 
    res.render('SetUpMeetingTimePage', {form: HTMLToReturn});
    })

_server.post('/meetingTimePage', function(req, res) { 
    let HTMLToReturn = []
    isShelter(req.body)
    let animal_from_db = location_animals[currentShelter]
    //console.log(currentShelter)
    animal_from_db = animal_from_db.find(x => x.name == req.body.petName)

    let startHTML = `<div class="title">
                    <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <img src ="${animal_from_db.url}" width="10px" height="100px">
                            <h1 class="heading" style = "text-align: center;"> ${currentAnimal}</h1>
                            <h2 class="heading">Set Up A day to meet Me</h2>
                            <div type = "column" class = "column">
                                <form method="post" action="/completeMeetingTime">
                                <input type="text" name="name" id="name" hidden value=${currentAnimal}>
                                <input type="text" name="location" id="location" hidden value=${currentShelter}>
                                <input type="text" name="email" id="email" hidden value=${currentUserEmail}>


                                <div>
                                    <label for ="date">Choose a date for your appointment:</label>
                                </div>
                                <div>
                                    <input type="date" id="start" name="date"
                                        value="2021-12-02"
                                        min="2021-12-03" max="2022-01-31">
                                </div>
                                <div>
                                    <label for="appt">Choose a time for your appointment:</label>
                                </div>
                                <div>
                                    <input type="time" id="appt" name="time"
                                        min="09:00" max="18:00" required>
                                </div>
                                <div>
                                    <small>Shelter hours are 9am to 6pm</small>
                                </div>

                                <div>
                                    <label for="inputName">Let us know a bit about you!</label>
                                </div>
                                <div>
                                    <input id="inputName" name="firstName" placeholder = "First Name">
                                </div>
                                <div>
                                    <input id="inputName" name="lastName" placeholder = "Last Name">
                                </div>
                                <div>
                                    <input id="inputName" name="phoneNumber" placeholder = "Phone Number">
                                </div>

                                <div>
                                    <input type = "submit">
                                </div>

                                </form>
                            </div>
                            <div class="mouse">
                            <div class="wheel"></div>
                        </div>
                   `

    HTMLToReturn.push(startHTML)

    let endHTML =  `
                    <div>
                        <form method="post" action="/setUpMeetingTimePage">
                            <input type="text" name="petName" id="petName" hidden value=${req.body.petName}>
                            <button name = "backToMap">
                                Back
                            </button>
                        </form>
                            <form method="post" action="/saveAnimal">
                            <input type="text" name="petName" id="petName" hidden value=${currentAnimal}>
                                <button name = "backToMap">
                                    Or save me for later!
                                </button>
                            </form>
                        </div>
                    </a> </div>
                    `
    HTMLToReturn.push(startHTML)
    HTMLToReturn.push(endHTML)

    res.render('meetingTimePage', {form: HTMLToReturn});

})

_server.post('/completeMeetingTime', function(req, res) { 

    console.log(req.body)
    upcomingAppts.push(req.body)
    let animal_from_db = location_animals[currentShelter]
    //console.log(currentShelter)
    animal_from_db = animal_from_db.find(x => x.name == req.body.petName)
    if (savedAnimals.filter(x => x.animal.name == req.body.petName && x.email == currentUserEmail).length == 0) {
        savedAnimals.push({animal: animal_from_db, email: currentUserEmail})
    }
    let HTMLToReturn = []

    let startHTML = `<div class="title">
                    <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <img src ="${animal_from_db.url}" width="10px" height="100px">
                            <h1 class="heading" style = "text-align: center;">Completed!</h1>
                        </div>`
    let endHTML =  `
                        <div>
                            <form method="post" action="/setUpMeetingTimePage">
                                <input type="text" name="petName" id="petName" hidden value=${req.body.name}>
                                <button name = "backToMap">
                                    Back
                                </button>
                            </form>
                        </a> </div>
                        `
    HTMLToReturn.push(startHTML)
    HTMLToReturn.push(endHTML)

    res.render('meetingTimePage', {form: HTMLToReturn});
})

_server.post('/saveAnimal', function(req, res) { 
    currentAnimal = req.body.petName
    if (savedAnimals.filter(x => x.animal.name == req.body.petName && x.email == currentUserEmail).length == 0) {
        let animal_from_db = location_animals[currentShelter].find(x => x.name == currentAnimal)
        savedAnimals.push({animal: animal_from_db, email: currentUserEmail})
    }
    let arr_of_html = getHTMLToRenderForShelter({location: currentShelter})
    res.render('shelter1', {form: arr_of_html});
})

_server.post('/adoptionForm', function(req, res) { 
    //console.log(req.body)
    let animal_from_db = location_animals[currentShelter]
    //console.log(currentShelter)
    animal_from_db = animal_from_db.find(x => x.name == req.body.petName)
    
    let HTMLToReturn = []

    let startHTML = `<div class="title">
                    <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <img src ="${animal_from_db.url}" width="10px" height="100px">
                            <h1 class="heading" style = "text-align: center;">Fill out ${req.body.petName}'s adoption form!</h1>
                        </div>`
    let endHTML =  `
                        <div>
                            <form method="post" action="/setUpMeetingTimePage">
                                <input type="text" name="petName" id="petName" hidden value=${req.body.petName}>
                                <button name = "backToMap">
                                    Back
                                </button>
                            </form>
                        </a> </div>
                        `
    HTMLToReturn.push(startHTML)
    HTMLToReturn.push(endHTML)

    res.render('adoptionForm', {form: arr_of_html});
})

_server.get('/views/styles.css', function(req, res) {
    conao
    res.sendFile(path.join(__dirname, '/views/styles.css'))
})

_server.listen(port, function() {
    console.log("Web server listening on port: " + port)
})

