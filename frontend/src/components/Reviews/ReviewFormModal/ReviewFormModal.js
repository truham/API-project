import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { postNewReviewThunk } from "../../../store/reviews";
import "./ReviewFormModal.css";

function ReviewFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const spotId = useSelector((state) => state.spots.singleSpot.id);

  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);

  const onSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      review,
      stars: "5",
    };

    dispatch(postNewReviewThunk(newReview, spotId));

    history.push(`/spots/${spotId}`);
  };

  const submitReviewDisabled = review.length < 10 || stars === 0;

  return (
    <>
      <div className="review-form-modal-container">
        <form className="review-form-modal" onSubmit={onSubmit}>
          <h3 className="review-form-header">How was your stay?</h3>
          <div className="review-form-textarea-container">
            <textarea
              placeholder="Just a quick review."
              className="review-form-textarea"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
          </div>
          <div className="review-form-stars-container">
            {/* Each star value 1-5
            On hover/click, set stars value to appropriate number */}
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <i className="fa-regular fa-star"></i>
            <span>Stars</span>
          </div>
          <div className="review-form-button-container">
            <button
              disabled={false}
              className={`${
                false
                  ? "review-form-submit-button-disabled"
                  : "review-form-submit-button"
              }`}
            >
              Submit Your Review
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ReviewFormModal;
