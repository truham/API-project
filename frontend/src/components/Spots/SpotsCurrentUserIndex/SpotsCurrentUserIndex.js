import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getCurrentUserSpotsThunk } from "../../../store/spots";

import "./SpotsCurrentUserIndex.css";

import SpotsCurrentUserTile from "../SpotsCurrentUserTile/SpotsCurrentUserTile";
import { NavLink } from "react-router-dom";

const SpotsCurrentUserIndex = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentSpotsList = useSelector((state) => state.spots.currentUserSpots);
  
  // bug post grading - needed to reroute non-logged in users
  const currentUser = useSelector((state) => state.session.user);
  if (!currentUser) history.push("/");

  // grab all of current user's spots
  useEffect(() => {
    dispatch(getCurrentUserSpotsThunk());
  }, [dispatch]);

  if (!currentSpotsList) return;

  return (
    <div className="currentspots-container">
      <div className="currentspots-content">
        <h3>Manage Spots</h3>
        <NavLink exact to="/spots/new">
          <button className="currentspots-create-button">
            Create a New Spot
          </button>
        </NavLink>
        <div className="currentspots-tiles-container">
          {currentSpotsList.Spots.map((spot) => (
            <SpotsCurrentUserTile spot={spot} key={spot.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpotsCurrentUserIndex;
