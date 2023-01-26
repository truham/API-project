const express = require ('express')
const router = express.Router()
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator')



// DELETE A BOOKING
// DELETE /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const findBooking = await Booking.findByPk(req.params.bookingId)
    if (!findBooking){
        res.status(404)
        return res.json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }

    // err handle, booking must belong to current user
    if (findBooking.userId !== req.user.id){
        res.status(404)
        return res.json({
            message: "Unauthorized user",
            statusCode: 404
        })
    }

    // bookings that have started can't be deleted
    let bookingTime = findBooking.startDate.getTime()
    const currentDateTime = new Date().getTime()
    if (bookingTime < currentDateTime){
        res.status(403)
        return res.json({
            message: "Bookings that have been started can't be deleted",
            statusCode: 403
        })
    }

    await findBooking.destroy()

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    })

})



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