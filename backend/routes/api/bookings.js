const express = require ('express')
const router = express.Router()
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator')



// EDIT A BOOKING
// PUT /api/bookings/:bookingId
router.put('/:bookingId', requireAuth, async (req, res) => {
    const findBooking = await Booking.findByPk(req.params.bookingId)

    // err handle, couldn't find booking with specified id
    if (!findBooking){
        res.status(404)
        return res.json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }

    // err handle, booking must belong to current user
    if (findBooking.userId !== req.user.id){
        res.status(403)
        return res.json({
            message: "Unauthorized user",
            statusCode: 403
        })
    }

    // err handle, can't edit a booking past end date
    let bookingEndString = new Date(findBooking.endDate).toDateString()
    let bookingEndTime = new Date(bookingEndString).getTime()
    let currentDate = new Date().toDateString()
    let currentDateTime = new Date(currentDate).getTime()
    if (currentDateTime > bookingEndTime){
        res.status(403)
        return res.json({
            message: "Past bookings can't be modified",
            statusCode: 403
        })
    }

    const { startDate, endDate } = req.body

    let endDateString = new Date(endDate).toDateString()
    let endDateTime = new Date(endDateString).getTime()
    let startDateString = new Date(startDate).toDateString()
    let startDateTime = new Date(startDateString).getTime()

    // err handle client providing endDate before startDate
    if (endDateTime <= startDateTime){
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    }

    // find all bookings by spotId to handle conflicts at that specific location
    const findAssociatedBookings = await Booking.findAll({
        where: {
            spotId: findBooking.spotId
        }
    })

    let bookingsList = []
    findAssociatedBookings.forEach(booking => {
        bookingsList.push(booking.toJSON())
    })

    // check for conflicts in existing bookings vs client requested booking
    // change forEach to for of loop to avoid cannot set headers after sent to client
    // bookingsList.forEach(booking => {
    for (let booking of bookingsList){
        // get existing booking's start and end dates' time to compare against
        let existingStartDate = new Date(booking.startDate).toDateString()
        let existingStartTime = new Date(existingStartDate).getTime()

        let existingEndDate = new Date(booking.endDate).toDateString()
        let existingEndTime = new Date(existingEndDate).getTime()

        // client sends both conflicting startDate and endDate
        if (startDateTime >= existingStartTime && startDateTime <= existingEndTime &&
            endDateTime >= existingStartTime && endDateTime <= existingEndTime){
            res.status(403)
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking"
                }
            })
        }

        // establishing a range - seems like there should be a more elegant way to do this
        if (startDateTime >= existingStartTime && startDateTime <= existingEndTime){
            res.status(403)
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                errors: {
                    startDate: "Start date conflicts with an existing booking"
                }
            })
        }

        // establishing a range - seems like there should be a more elegant way to do this
        if (endDateTime >= existingStartTime && endDateTime <= existingEndTime){
            res.status(403)
            return res.json({
                message: "Sorry, this spot is already booked for the specified dates",
                statusCode: 403,
                errors: {
                    endDate: "End date conflicts with an existing booking"
                }
            })
        }
    }

    // actual editing phew
    if (startDate) findBooking.startDate = startDate
    if (endDate) findBooking.endDate = endDate
    await findBooking.save()
    // similar to edit spot,
    // look into whether we can do findBooking.update({ startDate, endDate })
    // await findBooking.save()
    // sequelize docs show creation of an instance first, then editing from there
    // curious if we can just update an existing instance after finding it then save from there

    return res.json(findBooking)
})



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
        res.status(403)
        return res.json({
            message: "Unauthorized user",
            statusCode: 403
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
        if (!booking.Spot.SpotImages.length) booking.Spot.previewImage = 'No preview image available'

        // booking.Spot.SpotImages.forEach(image => {
        let foundPreview = []
        for (let image of booking.Spot.SpotImages){
            if (image.preview) foundPreview.push(image)
        }

        if (foundPreview.length) booking.Spot.previewImage = foundPreview[0].url
        else booking.Spot.previewImage = 'No preview image available'

        delete booking.Spot.SpotImages
    })

    return res.json({
        "Bookings": bookingsList
    })
})

module.exports = router