import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllSpotsThunk } from "../../../store/spots";

import "./SpotsIndex.css";

import SpotsIndexTile from "../SpotsIndexTile/SpotsIndexTile";

const SpotsIndex = () => {
  const dispatch = useDispatch();
  const allSpotsList = useSelector((state) => state.spots);
  // console.log("Component allSpots", allSpotsList);
  const allSpots = Object.values(allSpotsList.allSpots);
  // console.log(allSpots);

  // from app => navigation
  const [isLoaded, setIsLoaded] = useState(false);

  // grabs all the spots from redux on initial render
  useEffect(() => {
    dispatch(getAllSpotsThunk()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {isLoaded ? (
        <div className="spots-tile-outer-outer">
          <div className="spots-tiles-container">
            {allSpots.map((spot) => (
              <SpotsIndexTile spot={spot} key={spot.id} />
            ))}
          </div>
        </div>
      ) : (
        <h3>Unable to retrieve spots. Please try again shortly.</h3>
      )}
    </>
  );
};

export default SpotsIndex;
