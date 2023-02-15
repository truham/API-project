import { csrfFetch } from "./csrf";

const GET_SPOTS_REVIEWS = "spots/GET_SPOTS_REVIEWS";
const POST_NEW_REVIEW = "reviews/POST_NEW_REVIEW";
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
export const postNewReviewThunk = (review, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });

  if (res.ok) {
    const newReview = await res.json();
    dispatch(postNewReviewAction(newReview));
    console.log("NEW REVIEW RES", newReview);
    return newReview;
  }
};

/* ------- INITIAL STATE ------- */
const initialState = {
  spot: {},
  user: {},
};

/* ------- REDUCER ------- */
const reviewsReducer = (state = initialState, action) => {
  // copy state
  let newState = { ...state };

  switch (action.type) {
    case GET_SPOTS_REVIEWS:
      const spot = {};
      // console.log("case spotsReviews", action.spotId.Reviews);
      action.spotId.Reviews.forEach((review) => (spot[review.id] = review));
      return { ...newState, spot: spot };
    case POST_NEW_REVIEW:
      newState.spot = { ...newState.spot, [action.review.id]: action.review };
      return { ...newState };
    default:
      return state;
  }
};

export default reviewsReducer;
