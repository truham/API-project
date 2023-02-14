import { csrfFetch } from "./csrf";

const GET_SPOTS_REVIEWS = "spots/GET_SPOTS_REVIEWS";

/* ------- ACTIONS ------- */
const getSpotsReviewsAction = (spotId) => {
  return {
    type: GET_SPOTS_REVIEWS,
    spotId,
  };
};

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
    default:
      return state;
  }
};

export default reviewsReducer;
