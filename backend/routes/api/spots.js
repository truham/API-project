const express = require ('express')
const router = express.Router()

// Spot to find all spots
// Review to include the avgRating
// SpotImage to include previewImage? Review has a url: 'image url' too
const { User, Spot, Review, SpotImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')

// GET ALL SPOTS OWNED BY THE CURRENT USER
// GET /api/spots/current
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req // pulls user info from req (we used this in session.js route)
    const userSpots = await Spot.findAll({ // finding all spots associated with that user.id
        where: {
            ownerId: user.id
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })

    // same code as get all spots, must be a way to refactor, this is repetitive
    let spotsList = []
    userSpots.forEach(spot => {
        spotsList.push(spot.toJSON())
    })

    spotsList.forEach(spot => {
        let starsList = []
        spot.Reviews.forEach(reviews => {
            starsList.push(reviews.stars)
        })

        let total = 0
        for (let star of starsList){ 
            total += star
        }
        let average = total / starsList.length
        spot.avgRating = average 
        delete spot.Reviews 
    })

    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview){ 
                spot.previewImage = image.url
            } else {
                spot.previewImage = 'No preview image available'
            }
        })
        delete spot.SpotImages
    })

    return res.send({
        "Spots": spotsList
    })
})



// GET ALL SPOTS
// GET /api/spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
    // missing avgRating and previewImage without any added conditions to .findAll({})
    // below creates a separate object for the review + spotimage attributes, need to merge those attributes together
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
        // raw: true // this cleans up the pojo a whole lot to only provide the key attributes
        // without this, we get back an array of Promises that can't be manipulated
    })
    // spots.toJSON() // does not work on an array function, get an error. need to iterate over each spot
    // console.log(spots) // returns an array of each spot, need to interate then key into each one to add the desired review + image attributes

    // alec method from 'review on how to manipulate pojos' video (wk13d1)
    // create empty array of spots
    let spotsList = []
    // iterate over each spot from findAll(), and push them into spotsList with .toJSON(), could have done raw:true in query too
    spots.forEach(spot => {
        spotsList.push(spot.toJSON())
    })

    spotsList.forEach(spot => { // iterate over list of spots now, find the stars in reviews and url for previewImage
        let starsList = []
        spot.Reviews.forEach(reviews => {
            starsList.push(reviews.stars) // need to find the stars of each review, then find their average
        })

        // finding the average of all reviews associated with single spot
        let total = 0
        for (let star of starsList){ // iterate thru each star for spot
            total += star
        }
        let average = total / starsList.length // find its average
        spot.avgRating = average // assign new key value pair of avgRating: average calculation
        delete spot.Reviews // removes the excess info not desired from api doc
    })

    // handling previewImage
    spotsList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview){ // check whether t/f for existing spot preview image
                spot.previewImage = image.url // if found, then assign the previewImage to the image's url
            } else {
                spot.previewImage = 'No preview image available' // if not found, then assign 'No preview image available'
            }
        })
        delete spot.SpotImages // removes the excess info not desired from api doc
    })

    return res.json({
        "Spots": spotsList
    })
})

module.exports = router // make sure to export so that index.js can reference