const express = require ('express')
const router = express.Router()

const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models')
const { requireAuth } = require('../../utils//auth')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')



// ADD AN IMAGE TO A REVIEW BASED ON THE REVIEW'S ID
// POST /api/reviews/:reviewId/images
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const findReview = await Review.findByPk(req.params.reviewId)

    // error handle for non existing review
    if (!findReview){
        res.status(404)
        return res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    // error handle for must belong to current user
    if (findReview.userId !== req.user.id){
        res.status(404)
        return res.json({
            message: "Unauthorized user",
            statusCode: 404
        })
    }

    // error handler for reviews that have more than 10 images // set max to 10 per resource
    const findReviewImages = await ReviewImage.findAll({
        where: {
            reviewId: req.params.reviewId
        }
    })

    console.log(findReviewImages)

    if (findReviewImages.length >= 10){
        res.status(403)
        return res.json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403
        })
    }

    // add the image with provided url
    // had issues hitting the 10 max, needed to include reviewId in there, thought it autopopulated, but mistook that for just general id
    const { url } = req.body
    const addReviewImage = await ReviewImage.create({
        reviewId: req.params.reviewId,
        url
    })

    res.json({
        id: addReviewImage.id,
        reviewId: addReviewImage.reviewId,
        url: addReviewImage.url
    })
})



// GET ALL REVIEWS OF THE CURRENT USER
// GET /api/reviews/current
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req
    const userReviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: User,
                attributes: {
                    exclude: ['email', 'username', 'hashedPassword', 'createdAt', 'updatedAt' ]
                }
            },
            {
                model: Spot,
                include: [{ model: SpotImage }], // needed res.body to have "previewImage" within "Spots" object
                // got super messy in here very quickly, lots to key into later too
                // maybe check later if can refactor a bit here
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                }
            },
            {
                model: ReviewImage,
                attributes: {
                    exclude: ['reviewId', 'createdAt', 'updatedAt']
                }
            }
        ],
    })

    // adjusting object with toJSON() so can manipulate
    let reviewsList = []
    userReviews.forEach(review => {
        reviewsList.push(review.toJSON())
    })

    // handling the inclusion of "previewImage" within the "Spots" object
    reviewsList.forEach(review => {
        review.Spot.SpotImages.forEach(image => {
            if (image.preview){
                review.Spot.previewImage = image.url
            } else {
                review.Spot.previewImage = 'No preview image available'
            }
        })
        delete review.Spot.SpotImages
    })

    return res.json({
        "Reviews": reviewsList
    })
})



module.exports = router