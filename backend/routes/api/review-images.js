const express = require ('express')
const router = express.Router()
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')



// DELETE A REVIEW IMAGE
// DELETE /api/review-images/:imageId
router.delete('/:imageId', requireAuth, async (req, res) => {
    const findReviewImage = await ReviewImage.findByPk(req.params.imageId)
    if (!findReviewImage){
        res.status(404)
        return res.json({
            message: "Review Image couldn't be found",
            statusCode: 404
        })
    }

    // review must belong to the current user
    const findReview = await Review.findByPk(findReviewImage.reviewId)
    if (findReview.userId !== req.user.id){
    res.status(404)
        return res.json({
            message: "Unauthorized user",
            statusCode: 404
        })
    }
    
    await findReviewImage.destroy()

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    })
})

module.exports = router