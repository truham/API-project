const express = require ('express')
const router = express.Router()
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator')



// GET ALL OF THE CURRENT USER'S BOOKINGS
// GET /api/bookings/current
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req
    const userBookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [
            {
                model: Spot,
                include: [{ model: SpotImage }],
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt']
                }
            }
        ]
    })

    let bookingsList = []
    userBookings.forEach(booking => {
        bookingsList.push(booking.toJSON())
    })

    // handling the inclusion of "previewImage" within the "Spots" object
    bookingsList.forEach(booking => {
        booking.Spot.SpotImages.forEach(image => {
            if (image.preview){
                booking.Spot.previewImage = image.url
            } else {
                booking.Spot.previewImage = 'No preview image available'
            }
        })
        delete booking.Spot.SpotImages
    })

    return res.json({
        "Bookings": bookingsList
    })
})

module.exports = router