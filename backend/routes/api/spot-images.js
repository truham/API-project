const express = require ('express')
const router = express.Router()
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models')
const { handleValidationErrors } = require('../../utils/validation')
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator')



// DELETE A SPOT IMAGE
// DELETE /api/spot-images/:imageId
router.delete('/:imageId', requireAuth, async (req, res) => {
    const findSpotImage = await SpotImage.findByPk(req.params.imageId)
    if (!findSpotImage){
        res.status(404)
        return res.json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        })
    }

    // spot must belong to the current user
    const findSpot = await Spot.findByPk(findSpotImage.spotId)
    if (findSpot.ownerId !== req.user.id){
        res.status(403)
        return res.json({
            message: "Unauthorized user",
            statusCode: 403
        })
    }
    
    await findSpotImage.destroy()

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
    // this is tricky because it deletes successfully
    // but when i run get all spots or get spots by current user
    // the search is unable to find any associated SpotImages
    // so the res.body doesn't include "previewImage" at all anymore
    // ask tomorrow
})

module.exports = router