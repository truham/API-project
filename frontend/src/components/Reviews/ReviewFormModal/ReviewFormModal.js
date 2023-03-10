import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { postNewReviewThunk } from "../../../store/reviews";
import { useModal } from "../../../context/Modal";
import "./ReviewFormModal.css";

function ReviewFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState([]);

  // Grab spotId information from state
  const spotId = useSelector((state) => state.spots.singleSpot.id);

  // Gather logged in user information
  const user = useSelector((state) => state.session.user);
  let currentUser = {};
  currentUser.firstName = user.firstName;
  currentUser.lastName = user.lastName;
  currentUser.id = user.id;

  // Form input values
  const [review, setReview] = useState("");

  // star rating hover
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);

  const onSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      review,
      stars,
    };

    dispatch(postNewReviewThunk(newReview, spotId, currentUser))
      .then(closeModal)
      // catch server error from backend
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });

    // need server error above, history push is redundant here
    // history.push(`/spots/${spotId}`);
  };

  const submitReviewDisabled = review.length < 10 || stars === 0;

  return (
    <>
      <div className="review-form-modal-container">
        <form className="review-form-modal" onSubmit={onSubmit}>
          <h3 className="review-form-header">How was your stay?</h3>
          <ul>
            {errors.map((error, idx) => (
              <li className="review-form-errors" key={idx}>
                {error}
              </li>
            ))}
          </ul>
          <div className="review-form-textarea-container">
            <textarea
              placeholder="Leave your review here..."
              className="review-form-textarea"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
          </div>
          <div className="review-form-stars-container">
            {/* Each star value 1-5
            On hover/click, set stars value to appropriate number */}
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={index <= (hover || stars) ? "on" : "off"}
                  onClick={() => setStars(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(stars)}
                >
                  <span className="star-rating">&#9733;</span>
                </button>
              );
            })}
            <span>{` Stars`}</span>
          </div>
          <div className="review-form-button-container">
            <button
              disabled={submitReviewDisabled}
              className={`${
                submitReviewDisabled
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
