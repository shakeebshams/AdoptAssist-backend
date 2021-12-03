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
let currentUserEmail
let savedAnimals = []
let upcomingAppts = []
let animalsWithAdoptionForms = []
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
        if (obj.email != '' && obj.password != '') {
            currentUserEmail = obj.email
            return true;
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
            url: `https://yt3.ggpht.com/ytc/AKedOLRvxGYSdEHqu0X4EYcJ2kq7BttRKBNpfwdHJf3FSg=s900-c-k-c0x00ffffff-no-rj`,
            name: `Bella`,
            age: '1',
            breed: 'Yellow Lab',
            info: 'Bella is not potty-trained yet, but has learned simple commands and loves walks and pets',
            shelterName: 'Best Friends Lifesaving Center',
            Address: '1692 Oak St SE, Marietta, GA 30060'
        },
        {
            url: `https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*`,
            name: `Luna`,
            age: '3',
            breed: 'Golden Retriever',
            info: 'Luna is well-trained and very affectionate, and loves her toys',

        },
        {
            url: `https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg`,
            name: `Charlie`,
            age: '1',
            breed: 'Mixed Breed',
            info: 'Charlie loves to bark, but is affectionate and good with kids',

        },
        {
            url: `https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/funny-dog-captions-1563456605.jpg`,
            name: `Lucy`,
            age: '7',
            breed: 'Australian Shepherd',           
            info: 'Lucy is very well-trained and loves walks and running around in parks',

        },
    ],
    'Atlanta': [{
            url: `https://i.guim.co.uk/img/media/fe1e34da640c5c56ed16f76ce6f994fa9343d09d/0_174_3408_2046/master/3408.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=0d3f33fb6aa6e0154b7713a00454c83d`,
            name: `Cooper`,
            age: '2',
            breed: 'Pug',
            info: 'Cooper can be nervous around other dogs, but loves humans and treats',
            shelterName:'Atlanta Humane Society',
            Address: '981 Howell Mill Rd NW, Atlanta, GA 30318',

        },
        {
            url: `https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2020%2F10%2F13%2Fcorgi-dog-POPDOGNAME1020.jpg`,
            name: `Max`,
            age: '7',
            breed: 'Corgi',
            info: 'Max is a great dog that loves long walks and belly rubs',

        },
        {
            url: `https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/smartest-dog-breeds-1553287693.jpg?crop=0.673xw:1.00xh;0.167xw,0&resize=640:*`,
            name: `Bailey`,
            age: '4',
            breed: 'German Shepherd',
            info: 'Bailey is very well-trained, affectionate, and loves kids',

        },
        {
            url: `https://www.cesarsway.com/wp-content/uploads/2019/10/AdobeStock_190562703-768x535.jpeg`,
            name: `Daisy`,
            age: '7',
            breed: 'Entlebucher',
            info: 'Daisy loves playing with toys and running around at the dog park',

        },
    ],
    'Fulton': [{
            url: `https://cdn.britannica.com/q:60/49/161649-050-3F458ECF/Bernese-mountain-dog-grass.jpg`,
            name: 'Sadie',
            age: '7',
            breed: 'Australian Shepherd',
            info: 'Sadie sheds a lot, but is a great dog and loves pets',
            shelterName: 'Fulton County Animal Services',
            Address: '860 Marietta Blvd NW, Atlanta, GA 30318'
        },
        {
            url: `https://s3-us-west-2.amazonaws.com/uw-s3-cdn/wp-content/uploads/sites/6/2019/10/08113321/Dog-behavior-Kasper-Luijsterburg.jpg`,
            name: 'Lola',
            age: '3',
            breed: 'Panda Shepherd',
            info: 'Lola can be nervous around strangers, but is very affectionate and loves to run',

        },
        {
            url: `https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F47%2F2021%2F03%2F25%2Fdoberman-pinscher-red-collar-1100812121-2000.jpg`,
            name: 'Buddy',
            age: '4',
            breed: 'Doberman Pinscher',
            info: 'Buddy is a great guard dog, but is still friendly with strangers',

        },
        {
            url: `https://i1.wp.com/www.opindia.com/wp-content/uploads/2021/07/istockphoto-1163331995-612x612-1.jpg?fit=612%2C408&ssl=1`,
            name: 'Molly',
            age: '6',
            breed: 'Black Lab',
            info: 'Molly is a lovable, obedient dog that loves to play fetch and run around outside',

        }
    ],
    'DeKalb': [{
            url: `https://i.inews.co.uk/content/uploads/2020/07/PRI_156427438.jpg`,
            name: 'Stella',
            age: '5',
            breed: 'Yellow Lab',            
            info: 'Stella loves to go to the park and hang out with other dogs',
            shelterName: 'DeKalb County Animal Services',
            Address: '3280 Chamblee Dunwoody Rd, Chamblee, GA 30341'
        },
        {
            url: `https://cdn.cnn.com/cnnnext/dam/assets/201030094143-stock-rhodesian-ridgeback-super-tease.jpg`,
            name: 'Tucker',
            age: '3',
            breed: 'Mixed Breed',
            info: 'Tucker loves to be chased around and played with, and is very obedient',
        },
        {
            url: `https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2hpdGUlMjBkb2d8ZW58MHx8MHx8&w=1000&q=80`,
            name: 'Bear',
            age: '3',
            breed: 'Samoyed',
            info: 'Bear',
        },
        {
            url: `https://i.insider.com/521cd2136bb3f7df4c7c0a06?width=1000&format=jpeg&auto=webp`,
            name: 'Zoey',
            age: '4',
            breed: 'West Highland White Terrier',
            info: 'Zoey is a bit nervous around new people and dogs, but is affectionate and obedient once acquainted',
        },
    ],
    'Random': [{
            url: `https://vetstreet.brightspotcdn.com/dims4/default/acfa4c4/2147483647/crop/0x0%2B0%2B0/resize/645x380/quality/90/?url=https%3A%2F%2Fvetstreet-brightspot.s3.amazonaws.com%2F7b%2F0526609e8c11e0a2380050568d634f%2Ffile%2FBeagle-3-645mk062311.jpg`,
            name: 'Duke',
            age: '4',
            breed: 'Beagle',
            info: 'DUKE',
        }
    ]
}

function getHTMLToRenderForShelter(obj) {
    currentShelter = obj.location
    let location = obj.location
    //console.log(location)
    let details_from_db = location_animals[location]
    let arr_of_html = []

    let header =`<div class="title" style = "text-align: center; align-items: center; max-width: 100%;">
                    <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <h1 class="heading" style = "text-align: center;"> ${details_from_db[0].shelterName}</h1>
                            <h2 class="heading" style = "text-align: center;"> ${details_from_db[0].Address}</h2>
                            <h2 class="heading" style = "text-align: center;"> Meet our animals!</h2>
                            <div class="mouse">
                        <div class="wheel"></div>
                        </div>
                    </a> </div>`
    arr_of_html.push(header)

    details_from_db.forEach(async function(details) {
        let html = `<li style = "list-style: none; text-align: center; align-items: center;">
                        <h4>Animal: ${details.name}</h4>
                        <img src ="${details.url}" width="10px" height="100px">
                        <div style = "text-align: center; align-items: center;"> 
                            <div>
                            Age : ${details.age}
                            </div>
                            <div>
                            Breed: ${details.breed}
                            </div>
                            <div>
                            ${details.info}
                            </div>
                        </div>
                    </li>
                    <form method ="post" action="/SetUpMeetingTimePage">
                    <input type="text" name="name" id="name" hidden value=${details.name}>
                        <li style = "list-style: none; text-align: center; align-items: center;">
                                <button class = "button" name = ${details.name} >Meet Me!</button>
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
    currentAnimal = req.body.name
    let animal_from_db = location_animals[currentShelter]
    //console.log(animal_from_db)
    animal_from_db = animal_from_db.find(x => x.name == currentAnimal)
    let appointmentDisabled = ''
    let formDisabled = ''
    //console.log(upcomingAppts)
    //console.log(currentUserEmail)
    if (!((upcomingAppts.length > 0) && (upcomingAppts.filter(x => x.name == currentAnimal && x.email == currentUserEmail).length != 0))) {
        formDisabled = 'disabled = "true"'
    } else {
        if (animalsWithAdoptionForms.length > 0 && (animalsWithAdoptionForms.filter(x => x => x.name == currentAnimal && x.email == currentUserEmail).length != 0)) {
            formDisabled = 'disabled = "true"'
        }
        appointmentDisabled = 'disabled = "true"'
    }

    let startHTML = `<div class="title" style = "text-align: center; align-items: center; max-width: 100%;">
                        <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <img src ="${animal_from_db.url}" width="10px" height="100px">
                            <h1 class="heading" style = "text-align: center;"> ${currentAnimal}</h1>
                            <h2 class="heading">Adopt Me</h2>

                            <h3 class="heading">A little bit about me!</h3>
                            <h4 class="heading">Name: ${animal_from_db.name}</h4>
                            <h4 class="heading">Age: ${animal_from_db.age}</h4>
                            <h4 class="heading">${animal_from_db.info}</h4>


                            <h3 class="heading">First fill outa  time to meet me!</h3>
                            <form method="post" action="/meetingTimePage">
                                <input type="text" name="name" id="name" hidden value=${currentAnimal}>
                                <button name = ${currentShelter} ${appointmentDisabled}>
                                    Set up an appointment
                                </button>
                            </form>

                            <h3 class="heading">Optionally fill out an adoption form!</h3>
                            <form method="post" action="/adoptionForm">
                                <input type="text" name="name" id="name" hidden value=${currentAnimal}>
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
                    <input type="text" name="name" id="name" hidden value=${currentAnimal}>
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
    animal_from_db = animal_from_db.find(x => x.name == req.body.name)

    let startHTML = `<div class="title" style = "text-align: center; align-items: center; max-width: 100%;">
                    <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <img src ="${animal_from_db.url}" width="10px" height="100px">
                            <h1 class="heading" style = "text-align: center;"> ${currentAnimal}</h1>
                            <h2 class="heading">Set Up A day to meet Me</h2>
                            <div>
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
                                    <input type = "text" id="inputName" name="firstName" placeholder = "First Name">
                                </div>
                                <div>
                                    <input type = "text" id="inputName" name="lastName" placeholder = "Last Name">
                                </div>
                                <div>
                                    <input type = "text" id="inputName" name="phoneNumber" placeholder = "Phone Number">
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
                            <input type="text" name="name" id="name" hidden value=${req.body.name}>
                            <button name = "backToMap">
                                Back
                            </button>
                        </form>
                            <form method="post" action="/saveAnimal">
                            <input type="text" name="name" id="name" hidden value=${currentAnimal}>
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
    console.log(currentShelter)
    animal_from_db = animal_from_db.find(x => x.name == req.body.name)
    if (savedAnimals.filter(x => x.animal.name == req.body.name && x.email == currentUserEmail).length == 0) {
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
                                <input type="text" name="name" id="name" hidden value=${req.body.name}>
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
    currentAnimal = req.body.name
    if (savedAnimals.filter(x => x.animal.name == req.body.name && x.email == currentUserEmail).length == 0) {
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
    animal_from_db = animal_from_db.find(x => x.name == req.body.name)
    let appt = upcomingAppts.find(x => x.name == animal_from_db.name && x.email == currentUserEmail)
    console.log(appt)
    let HTMLToReturn = []

    let startHTML = `<div class="title" style = "text-align: center; align-items: center; max-width: 100%;">
                        <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                            <div class="smallsep heading"></div>
                                <img src ="${animal_from_db.url}" width="10px" height="100px">
                                <h1 class="heading" style = "text-align: center;">Fill out ${currentAnimal}'s Adoption Form!</h1>
                                <div>
                                <ol>
                                    <form method="post" action="/completeAdoptionForm">
                                    <div>
                                    <input type="text" name="name" id="name" value="Animal Name: ${currentAnimal}" disabled = "true">
                                    </div>
                                    <div>
                                    <input type="text" name="location" id="location" value="Shelter: ${currentShelter}" disabled = "true">
                                    </div>
                                    <div>
                                    <input type="text" name="email" id="email" value="Appt Details: ${appt.date} ${appt.time}" disabled = "true">
                                    </div>

                                    <div>
                                        <label for="appt">Animal Name Animal ID Shelter Location Reservation Details Do you give consent to your designated microchip company to contact you if your pet is found?:</label>
                                        <input type="text" name="microchip" id="microchip">
                                    </div>
                                    <div>
                                        <label for="prevOwnership">I have owned a dog before:</label>
                                        <input type="text" name="prevOwnership" id="prevOwnership">
                                    </div>
                                    <div>
                                        <label for="walking">How often do you plan on walking your new pet?</label>
                                        <input type="text" name="walking" id="walking">
                                    </div>
                                    <div>
                                        <label for="playtime">What best describes a fun playtime with your dog?</label>
                                        <input type="text" name="playtime" id="playtime">
                                    </div>
                                    <div>
                                        <label for="livingSituation">What is your current living situation?</label>
                                        <input type="text" name="livingSituation" id="livingSituation">
                                    </div>
                                    <div>
                                        <label for="deposits">Are you prepared to pay pet deposits and/or monthly fees?</label>
                                        <input type="text" name="deposits" id="deposits">
                                    </div>
                                    <div>
                                        <label for="prevAdopt">Have you previously adopted from ${currentShelter}? </label>
                                        <input type="text" name="prevAdopt" id="prevAdopt">
                                    </div>
                                    <div>
                                        <label for="smallChildren">Are there small children living or that frequently visit the household?</label>
                                        <input type="text" name="smallChildren" id="smallChildren">
                                    </div>
                                    <div>
                                        <label for="otherAnimals">Are there animals living in the household?</label>
                                        <input type="text" name="otherAnimals" id="otherAnimals">
                                    </div>
                                    <div>
                                        <label for="introduction">How do you plan to introduce your pets?</label>
                                        <input type="text" name="introduction" id="introduction">
                                    </div>
                                    <div>
                                        <label for="energyLevel">What energy level are you looking for in a pet?</label>
                                        <input type="text" name="energyLevel" id="energyLevel">
                                    </div>
                                    <div>
                                        <label for="cuddle">How important is it to you that your pet likes to cuddle?</label>
                                        <input type="text" name="cuddle" id="cuddle">
                                    </div>
                                    <div>
                                        <label for="weekend">What does your average weekend look like?</label>
                                        <input type="text" name="weekend" id="weekend">
                                    </div>
                                    <div>
                                        <label for="meetNewPeople">How often would your pet be meeting new people?</label>
                                        <input type="text" name="meetNewPeople" id="meetNewPeople">
                                    </div>
                                    <div>
                                        <label for="friendsAnimals">Do you intend to get your pet together with friend’s animals?</label>
                                        <input type="text" name="friendsAnimals" id="friendsAnimals">
                                    </div>
                                    <div>
                                        <label for="characteristics">What characteristics are you looking for in a pet?</label>
                                        <input type="text" name="characteristics" id="characteristics">
                                    </div>
                                    <div>
                                        <label for="adjustTime">How long do yo uthink it will take your new pet to adjust to your home and family?</label>
                                        <input type="text" name="adjustTime" id="adjustTime">
                                    </div>
                                    <div>
                                        <label for="questions">Questions</label>
                                        <input type="text" name="questions" id="questions">
                                    </div>
                                    <div>
                                        <input type = "submit">
                                    </div>
                                    </form>
                                    </ol>
                                </div>`
    let endHTML =  `
                        <div>
                            <form method="post" action="/setUpMeetingTimePage">
                                <input type="text" name="name" id="name" hidden value=${req.body.name}>
                                <button name = "backToMap">
                                    Back
                                </button>
                            </form>
                        </a> </div>
                        `
    HTMLToReturn.push(startHTML)
    HTMLToReturn.push(endHTML)

    res.render('adoptionForm', {form: HTMLToReturn});
})
_server.post('/completeAdoptionForm', function(req, res) { 

    animalsWithAdoptionForms.push({form: req.body, email: currentUserEmail})
    let animal_from_db = location_animals[currentShelter]
    console.log(req.body)
    animal_from_db = animal_from_db.find(x => x.name == currentAnimal)
    
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
                                <input type="text" name="name" id="name" hidden value=${currentAnimal}>
                                <button name = "backToMap">
                                    Back
                                </button>
                            </form>
                        </a> </div>
                        `
    HTMLToReturn.push(startHTML)
    HTMLToReturn.push(endHTML)

    res.render('adoptionForm', {form: HTMLToReturn});
})


_server.post('/savedAnimals', function(req, res) { 
    console.log("function called")
    let usersSavedAnimals = savedAnimals.filter(x => x.email == currentUserEmail)
    let HTMLToReturn = []

    //console.log(upcomingAppts)
    let startHTML

    if (usersSavedAnimals.length == 0) {
        startHTML = `<div class="title">
                    <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <h1 class="heading" style = "text-align: center;">You have no saved animals</h1>
                        </div>
                    </a> </div>`
        
        HTMLToReturn.push(startHTML)
    } else {
        startHTML = `<div class="title">
                    <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <h1 class="heading" style = "text-align: center;">You have  ${usersSavedAnimals.length} saved animals</h1>
                        </div>
                    </a> </div>`
        HTMLToReturn.push(startHTML)
        usersSavedAnimals.forEach(async function(details) {
            console.log(details)
            let animal = details.animal
            
            console.log(animal)
            let html = `<li style = "text-align: center; align-items: center;">
                            <h4>Animal: ${animal.name}</h4>
                            <img src ="${animal.url}" width="10px" height="100px">
                            <div class = "Row"> 
                                <div>
                                Age: ${animal.age}
                                </div>
                                <div>
                                Breed: ${animal.breed}
                                </div>
                                <div>
                                ${animal.info}
                                </div>
                                <div> 
                                Location: ${animal.location}
                                </div>
                            </div>
                        </li>
                        <form method ="post" action="/SetUpMeetingTimePage">
                        <input type="text" name="name" id="name" hidden value=${animal.name}>
                            <li style = "text-align: center; align-items: center;">
                                    <button name = ${animal.name} >Manage</button>
                            </li>
                        </form>`
    
            HTMLToReturn.push(html);
        })
    }
    let HTMLEnd =  `<form method="post" action="/">
                        <button name = "backToMap">
                            Back
                        </button>
                    </form>`
    HTMLToReturn.push(HTMLEnd);
    res.render('savedAnimals', {form: HTMLToReturn});
})

_server.post('/upcomingAppointments', function(req, res) { 
    console.log("function called")
    let usersUpComingAppts = upcomingAppts.filter(x => x.email == currentUserEmail)
    let HTMLToReturn = []

    //console.log(upcomingAppts)
    let startHTML

    if (usersUpComingAppts.length == 0) {
        startHTML = `<div class="title">
                    <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <h1 class="heading" style = "text-align: center;">You have no upcoming appointments</h1>
                        </div>
                    </a> </div>`
        
        HTMLToReturn.push(startHTML)
    } else {
        startHTML = `<div class="title">
                    <div><span class="typcn typcn-heart-outline icon heading"></span></div>
                        <div class="smallsep heading"></div>
                            <h1 class="heading" style = "text-align: center;">You have  ${usersUpComingAppts.length} upcoming appointments</h1>
                        </div>
                    </a> </div>`
        HTMLToReturn.push(startHTML)
        usersUpComingAppts.forEach(async function(details) {
            //console.log(details)
            let animal = location_animals['Atlanta'].filter(y => y.name == details.name)
            if (animal.length == 0) {
                animal = location_animals['Best'].filter(y => y.name == details.name)
                if (animal.length == 0) {
                    animal = location_animals['DeKalb'].filter(y => y.name == details.name)
                    if (animal.length == 0) {
                        animal = location_animals['Fulton'].filter(y => y.name == details.name)
                    }
                }
            }
            //console.log(animal)
            animal = animal[0]
            let html = `<li style = "text-align: center; align-items: center;">
                            <h4>Animal: ${animal.name}</h4>
                            <img src ="${animal.url}" width="10px" height="100px">
                            <div class = "Row"> 
                                <div>
                                Age: ${animal.age}
                                </div>
                                <div>
                                Breed: ${animal.breed}
                                </div>
                                <div>
                                ${animal.info}
                                </div>
                                <div>
                                Appointment Date: ${details.date}
                                </div>
                                <div> 
                                Appointment Time: ${details.time}
                                </div>
                                <div> 
                                Location: ${location_animals[details.location][0].location}
                                </div>
                            </div>
                        </li>
                        <form method ="post" action="/SetUpMeetingTimePage">
                        <input type="text" name="name" id="name" hidden value=${details.name}>
                            <li style = "text-align: center; align-items: center;">
                                    <button name = ${details.name} >Manage</button>
                            </li>
                        </form>`
    
            HTMLToReturn.push(html);
        })
    }
    let HTMLEnd =  `<form method="post" action="/">
                        <button name = "backToMap">
                            Back
                        </button>
                    </form>`
    HTMLToReturn.push(HTMLEnd);
    res.render('upcomingAppointments', {form: HTMLToReturn});
})

_server.post('/logOut', function(req, res) { 
    currentUserEmail = undefined

    res.sendFile(path.join(__dirname, requestHandler(req.body)))
})

_server.get('/views/styles.css', function(req, res) {
    conao
    res.sendFile(path.join(__dirname, '/views/styles.css'))
})

_server.listen(port, function() {
    console.log("Web server listening on port: " + port)
})





