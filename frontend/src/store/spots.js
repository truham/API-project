import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS";
const GET_SINGLE_SPOT = "spots/GET_SINGLE_SPOT";
const POST_NEW_SPOT = "spots/POST_NEW_SPOT";
const POST_NEW_IMAGE = "spots/POST_NEW_IMAGE";
const GET_CURRENT_USER_SPOTS = "spots/GET_CURRENT_USER_SPOTS";
const EDIT_SINGLE_SPOT = "spots/PUT_SINGLE_SPOT";

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

const getCurrentUserSpotsAction = (spots) => {
  return {
    type: GET_CURRENT_USER_SPOTS,
    spots,
  };
};

const editSpotAction = (spot) => {
  return {
    type: EDIT_SINGLE_SPOT,
    spot,
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
    return singleSpot;
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

// Get current user's spots
export const getCurrentUserSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");
  if (res.ok) {
    const currentUserSpots = await res.json();
    // console.log("CURRENT USER SPOTS THUNK", currentUserSpots);
    dispatch(getCurrentUserSpotsAction(currentUserSpots));
  }
};

// Edit a single spot
export const editSpotThunk = (spot, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const editedSpot = await res.json();
    console.log("thunk editedSpot", editedSpot);
    dispatch(editSpotAction(editedSpot));
    return editedSpot;
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
      newState.allSpots = { ...state.allSpots, [newSpotId]: action.spot };
      return { ...newState };
    // // Per Daniel - don't reference pokedex for any reducer content
    // if (!newState.allSpots[newSpotId]) {
    //   // console.log("INSIDE CONDITION");
    //   // console.log("before", newState.allSpots);
    //   // update state's allSpot key to include all former spots then add new spot
    //   newState.allSpots = { ...state.allSpots, [newSpotId]: action.spot };
    //   // console.log("after", newState.allSpots);
    //   return newState;
    // }
    // Updating former spot - separate feature
    // reference pokedex
    case POST_NEW_IMAGE:
      return { ...newState };
    case GET_CURRENT_USER_SPOTS:
      // action.spots.Spots.forEach((spot) => (currentUserSpots[spot.id] = spot));
      return { ...newState, currentUserSpots: action.spots };
    case EDIT_SINGLE_SPOT:
      return { ...newState };
    default:
      return state;
  }
};

export default spotsReducer;
