const express = require ('express')
const router = express.Router()

// Spot to find all spots
// Review to include the avgRating
// SpotImage to include previewImage? Review has a url: 'image url' too
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')

// imported these to handle body validation of new spot
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

// validating new spot
const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isNumeric()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isNumeric()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .isNumeric()
        .withMessage('Price per day is required'),
    handleValidationErrors
]

let validateReview = [
    check('review')
        .exists({ checkFalsy: true})
        .isString()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true})
        .isFloat({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]



// CREATE A BOOKING FROM A SPOT BASED ON THE SPOT'S ID
// POST /api/spots/:spotId/bookings
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const findSpot = await Spot.findByPk(req.params.spotId)
    if (!findSpot){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    if (req.user.id === findSpot.ownerId){
        res.status(404)
        return res.json({
            message: "Spot must not belong to the current user",
            statusCode: 404
        })
    }

    const { startDate, endDate } = req.body
    const startD = new Date (startDate)
    console.log(startD.getTime())
    // come back to this tomorrow

    res.json()
})



// GET ALL BOOKINGS FOR A SPOT BASED ON THE SPOT'S ID
// GET /api/spots/:spotId/bookings
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const findSpot = await Spot.findByPk(req.params.spotId)
    if (!findSpot){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    // if you ARE NOT the owner of the spot
    if (req.user.id !== findSpot.ownerId){
        const bookingsNotOwner = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            attributes: {
                exclude: ['id', 'userId', 'createdAt', 'updatedAt']
            }
        })
        return res.json({
            "Bookings": bookingsNotOwner
        })
    }

    // if you ARE the owner of the spot
    if (req.user.id === findSpot.ownerId){
        const bookingsOwner = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            },
            include: {
                model: User,
                attributes: {
                    exclude: ['email', 'username', 'hashedPassword', 'createdAt', 'updatedAt' ]
                }
            }
        })
        res.json({
            "Bookings": bookingsOwner
        })
    }
})



// CREATE A REVIEW FOR A SPOT BASED ON THE SPOT'S ID
// POST /api/spots/:spotId/reviews
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    const findSpot = await Spot.findByPk(req.params.spotId)

    // error handle for couldn't find spot with specified id
    if (!findSpot){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    // error handle review from current user already exists for spot
    const existingReview = await Review.findOne({
        where: {
            userId: req.user.id,
            spotId: req.params.spotId
        }
    })

    if (existingReview){
        res.status(403)
        return res.json({
            message: "User already has a review for this spot",
            statusCode: "403"
        })
    }

    // create review for spot with current user
    const { review, stars } = req.body
    const newReview = await Review.create({
        userId: req.user.id,
        spotId: req.params.spotId,
        review, stars
    })

    await newReview.save()

    res.status(201)
    return res.json(newReview)
})



// CREATE AND RETURN A NEW IMAGE FOR A SPOT SPECIFIED BY ID
// POST /api/spots/:spotId/images
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const findSpot = await Spot.findByPk(req.params.spotId)
        
    // err handle, spot must belong to current user
    if (findSpot.ownerId !== req.user.id){
        res.status(404)
        return res.json({
            message: "Unauthorized user",
            statusCode: 404
        })
    }

    // err handle couldn't find spot with the specified id
    if (!findSpot) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    // grab info needed to create image
    const { url, preview } = req.body

    // create spot with provided req.body
    const newImage = await SpotImage.create({
        url, preview
    })

    return res.json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
        // excludes createAt and updateAt
    })
})



// GET ALL REVIEWS BY A SPOT'S ID
// GET /api/spots/:spotId/reviews
router.get('/:spotId/reviews', async (req, res) => {
    const findSpot = await Spot.findByPk(req.params.spotId)

    if (!findSpot){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    const reviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [
            {
                model: User,
                attributes: {
                    exclude: ['email', 'username', 'hashedPassword', 'createdAt', 'updatedAt' ]
                }
            },
            {
                model: ReviewImage,
                attributes: {
                    exclude: ['reviewId', 'createdAt', 'updatedAt']
                }
            }
        ]
    })

    return res.json({
        "Reviews": reviews
    })
})



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

    return res.json({
        "Spots": spotsList
    })
})



// GET DETAILS OF A SPOT FROM AN ID
// GET /api/spots/:spotId
router.get('/:spotId', async (req, res) => {
    const spotById = await Spot.findByPk(req.params.spotId)

    // error handling when spot not found with given id
    if (!spotById){
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    const spotFound = spotById.toJSON()

    const spotReviews = await Review.findAll({
        where: {
            spotId: spotFound.id
        },
        raw: true
    })

    // key:value for numReviews
    spotFound.numReviews = spotReviews.length

    // key:value for avgStarRating
    let starsList = []
    for (let reviewStars of spotReviews){
        starsList.push(reviewStars.stars)
    }
    let total = 0
    for (let star of starsList){
        total += star
    }
    let average = total / starsList.length
    spotFound.avgStarRating = average

    // key:value for SpotImages
    const spotImages = await SpotImage.findAll({
        where: {
            spotId: spotFound.id
        },
        // raw: true, // including this will convert a boolean to 0s and 1s
        // not sure if that's desirable, will ask
        // it doesn't matter, it shows up as 1/0s on sqlite
        // but postgres will interpret it as true/false anyway
        // tested on render and render will display true/false while postman shows 1/0 with this on
        attributes: ['id', 'url', 'preview']
    })
    spotFound.SpotImages = spotImages

    // key:value for Owner
    const owner = await User.findOne({
        where: {
            id: spotFound.ownerId
        },
        raw: true,
        attributes: ['id', 'firstName', 'lastName']
    })
    spotFound.Owner = owner

    return res.json(spotFound)
})



// EDIT A SPOT
// PUT /api/spots/:spotId
router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const findSpot = await Spot.findByPk(req.params.spotId)
    
    // err handle couldn't find spot with the specified id
    if (!findSpot) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    // err handle, spot must belong to current user
    if (findSpot.ownerId !== req.user.id){
        res.status(404)
        return res.json({
            message: "Unauthorized user",
            statusCode: 404
        })
    }
    
    // pull data from client
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    // from wk11d3 content of updating puppies, can set condition then reassign the values
    // if item is provided, then update; otherwise keep current info
    if (address) findSpot.address = address
    if (city) findSpot.city = city
    if (state) findSpot.state = state
    if (country) findSpot.country = country
    if (lat) findSpot.lat = lat
    if (lng) findSpot.lng = lng
    if (name) findSpot.name = name
    if (description) findSpot.description = description
    if (price) findSpot.price = price 
    // updates the information in db
    await findSpot.save() // saves a persisting instance in the database

    // simple update queries per sequelize, potential refactor, can revisit
    // findSpot.update({ address, city, state, country, lat, lng, name, description, price })
    // await findSpot.save()

    return res.json(findSpot)
})



// CREATE A SPOT
// POST /api/spots
router.post('/', requireAuth, validateSpot, async (req, res) => {
    // reference spot model to get necessary attributes
    // should be logged in to create a spot, so userId or ownerId already referenced
    const { user } = req
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const newSpot = await Spot.create({
        ownerId: user.id,
        address, city, state, country, lat, lng, name, description, price        
    })

    return res.json(newSpot)
})



// DELETE A SPOT
// DELETE /api/spots/:spotId
// note, needed to include on delete cascade to appropriate associations otherwise run into foreign key constraint error in postman
router.delete('/:spotId', requireAuth, async (req, res) => {
    const findSpot = await Spot.findByPk(req.params.spotId)

    // err handle couldn't find spot with the specified id
    if (!findSpot) {
        res.status(404)
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    // err handle, spot must belong to current user
    if (findSpot.ownerId !== req.user.id){
        res.status(404)
        return res.json({
            message: "Unauthorized user",
            statusCode: 404
        })
    }

    await findSpot.destroy()

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
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