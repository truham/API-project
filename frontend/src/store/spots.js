import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS";
const GET_SINGLE_SPOT = "spots/GET_SINGLE_SPOT";

/* ------- ACTIONS ------- */
const getAllSpotsAction = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
  };
};

const getSingleSpotAction = (spotId) => {
  return {
    type: GET_SINGLE_SPOT,
    spotId,
  };
};

/* ------- THUNKS ------- */

// Display all spots at root page
export const getAllSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");

  if (res.ok) {
    const allSpots = await res.json();
    // console.log("thunk allSpots", allSpots);
    dispatch(getAllSpotsAction(allSpots));
  }
};

// View single spot details
export const getSingleSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const singleSpot = await res.json();
    // console.log("thunk singleSpot", singleSpot);
    dispatch(getSingleSpotAction(singleSpot));
  }
};

/* ------- INITIAL STATE ------- */
const initialState = {
  allSpots: {},
  singleSpot: {},
};

/* ------- REDUCER ------- */
const spotsReducer = (state = initialState, action) => {
  // copy state
  let newState = { ...state };

  switch (action.type) {
    case GET_ALL_SPOTS:
      // normalize array of spots from backend
      const allSpots = {};
      action.spots.Spots.forEach((spot) => (allSpots[spot.id] = spot));
      // return newState with allSpots data included
      return { ...newState, allSpots: allSpots };
    case GET_SINGLE_SPOT:
      const singleSpot = { ...action.spotId };
      // console.log("case singleSpot", singleSpot);
      return { ...newState, singleSpot: singleSpot };
    default:
      return state;
  }
};

export default spotsReducer;
