import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllSpotsThunk } from "../../../store/spots";

import SpotsIndexTile from "../SpotsIndexTile/SpotsIndexTile";

const SpotsIndex = () => {
  const dispatch = useDispatch();
  const allSpotsList = useSelector((state) => state.spots);
  // console.log("Component allSpots", allSpotsList);
  const allSpots = Object.values(allSpotsList.allSpots);
  // console.log(allSpots);

  // grabs all the spots from redux on initial render
  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);

  return (
    <div>
      <ul>
        {allSpots.map((spot) => (
          <SpotsIndexTile spot={spot} key={spot.id} />
        ))}
      </ul>
    </div>
  );
};

export default SpotsIndex;
