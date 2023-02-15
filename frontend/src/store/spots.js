import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS";
const GET_SINGLE_SPOT = "spots/GET_SINGLE_SPOT";
const POST_NEW_SPOT = "spots/POST_NEW_SPOT";
const POST_NEW_IMAGE = "spots/POST_NEW_IMAGE";

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

const postNewSpotAction = (spot) => {
  return {
    type: POST_NEW_SPOT,
    spot,
  };
};

const postNewSpotImageAction = (image) => {
  return {
    type: POST_NEW_IMAGE,
    image,
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

// Post new spot
export const postNewSpotThunk = (spot) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const newSpot = await res.json();
    // console.log("thunk newSpot", newSpot);
    dispatch(postNewSpotAction(newSpot));
    return newSpot;
  }
};

// Post new spot's photos
export const postNewSpotImageThunk = (image, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(image),
  });

  // console.log("POST NEW SPOT IMAGE THUNK");

  if (res.ok) {
    const newSpotImage = await res.json();
    // console.log("RES.OK NEW SPOT IMAGE", newSpotImage);
    dispatch(postNewSpotImageAction(newSpotImage));
    return newSpotImage;
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
    case POST_NEW_SPOT:
      // Creating new spot
      const newSpotId = action.spot.id;
      if (!newState.allSpots[newSpotId]) {
        // console.log("INSIDE CONDITION");
        // console.log("before", newState.allSpots);
        // update state's allSpot key to include all former spots then add new spot
        newState.allSpots = { ...state.allSpots, [newSpotId]: action.spot };
        // console.log("after", newState.allSpots);
        return newState;
      }
      // Updating former spot - separate feature
      // reference pokedex
      return { ...newState };
    case POST_NEW_IMAGE:
      return { ...newState };
    default:
      return state;
  }
};

export default spotsReducer;
