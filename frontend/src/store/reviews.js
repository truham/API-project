import { csrfFetch } from "./csrf";

import { getSingleSpotThunk } from "./spots";

const GET_SPOTS_REVIEWS = "spots/GET_SPOTS_REVIEWS";
const POST_NEW_REVIEW = "reviews/POST_NEW_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";
// const GET_USER_REVIEWS = "reviews/GET_USER_REVIEWS"; // complete feature later

/* ------- ACTIONS ------- */
const getSpotsReviewsAction = (spotId) => {
  return {
    type: GET_SPOTS_REVIEWS,
    spotId,
  };
};

const postNewReviewAction = (review) => {
  return {
    type: POST_NEW_REVIEW,
    review,
  };
};

const deleteReviewAction = (reviewId) => {
  return {
    type: DELETE_REVIEW,
    reviewId,
  };
};

// complete feature later
// const getUserReviewsAction = (userId) => {
//   return {
//     type: GET_USER_REVIEWS,
//     userId,
//   };
// };

/* ------- THUNKS ------- */
// View rating and reviews by spotId
export const getSpotsReviewsThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (res.ok) {
    const spotsReviews = await res.json();
    // console.log(spotsReviews);
    dispatch(getSpotsReviewsAction(spotsReviews));
  }
};

// Post a new review for spot based on spotId
export const postNewReviewThunk =
  (review, spotId, user) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });

    if (res.ok) {
      const newReview = await res.json();
      // console.log("NEW REVIEW RES", newReview);
      newReview.User = user;
      dispatch(postNewReviewAction(newReview));
      dispatch(getSingleSpotThunk(spotId));
      return newReview;
    }
  };

// Delete a review based on reviewId
export const deleteReviewThunk = (reviewId, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(deleteReviewAction(reviewId));
    // update store state so review removed from render
    dispatch(getSpotsReviewsThunk(spotId));
    // update store state for spot to recalculate avgRating + # reviews
    dispatch(getSingleSpotThunk(spotId));
  }
};

/* ------- INITIAL STATE ------- */
const initialState = {
  spot: {},
  user: {},
};

/* ------- SORTING ------- */
const sortReviews = (reviews) => {
  return reviews.sort((reviewA, reviewB) => {
    return Date.parse(reviewB.updatedAt) - Date.parse(reviewA.updatedAt);
  });
};

/* ------- REDUCER ------- */
const reviewsReducer = (state = initialState, action) => {
  // copy state
  let newState = { ...state };

  switch (action.type) {
    case GET_SPOTS_REVIEWS:
      const spot = {};
      // original - no sorting
      // action.spotId.Reviews.forEach((review) => (spot[review.id] = review));
      // sorting reviews
      const sortedReviews = sortReviews(action.spotId.Reviews);
      sortedReviews.forEach((review) => (spot[Object.keys(review)] = review));
      return { ...newState, spot: sortedReviews };
    case POST_NEW_REVIEW:
      newState.spot = { ...newState.spot, [action.review.id]: action.review };
      return { ...newState };
    case DELETE_REVIEW:
      delete newState.spot[action.reviewId];
      return { ...newState };
    default:
      return state;
  }
};

export default reviewsReducer;
