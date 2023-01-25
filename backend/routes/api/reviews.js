const express = require ('express')
const router = express.Router()

const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models')
const { requireAuth } = require('../../utils//auth')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')



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