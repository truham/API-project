import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS";

/* ------- ACTIONS ------- */
const getAllSpotsAction = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
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

/* ------- INITIAL STATE ------- */
const initialState = {
  allSpots: {},
  singleSpot: {},
};

/* ------- REDUCER ------- */
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS:
      // copy state
      const newState = { ...state };
      // normalize array of spots from backend
      const allSpots = {};
      action.spots.Spots.forEach((spot) => (allSpots[spot.id] = spot));
      // return newState with allSpots data included
      return { ...newState, allSpots: allSpots };
    default:
      return state;
  }
};

export default spotsReducer;
