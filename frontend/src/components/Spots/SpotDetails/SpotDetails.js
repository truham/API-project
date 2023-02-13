import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleSpotThunk } from "../../../store/spots";
import "./SpotDetails.css";

const SpotDetails = () => {
  // pass spotId from params to thunk to search for spot in backend
  const dispatch = useDispatch();
  const { spotId } = useParams();

  // grab the singleSpot from state for react usage
  const spot = useSelector((state) => state.spots.singleSpot);
  console.log(spot);

  // grabs single spot details from redux
  useEffect(() => {
    dispatch(getSingleSpotThunk(spotId));
  }, [dispatch]);

  // first render returns empty object
  if (!Object.values(spot).length) return;

  // Grab max 5 spot images - come back to later
  //   let spotImages = [];
  //   for (let i = 0; i < 5; i++) {
  //     spotImages.push(spot.SpotImages[i]);
  //   }

  return (
    <div className="single-spot-container">
      <div>
        {/* Heading */}
        <h3>{spot.name}</h3>
        <p className="single-spot-heading">
          {spot.city}, {spot.state}, {spot.country}
        </p>
      </div>

      {/* Images */}
      <div>
        <img className="single-spot-image" src={spot.SpotImages[0].url} />
        {/* {spotImages.map((image) => (image ? console.log(image.url) : "null"))} */}
      </div>

      <div className="single-spot-info-container">
        {/* Text */}
        <div>
          <h3>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h3>
          <p>{`${spot.description}`}</p>
        </div>

        {/* Callout box */}
        <div className="single-spot-callout-container">
          <div className="price-reviews-container">
            <div>
              <p>{`$${spot.price} night`}</p>
            </div>
            <div className="stars-reviews">
              <i className="fa-solid fa-star"></i>
              <p>{`${
                Number(spot.avgStarRating) ? spot.avgStarRating : "New"
              } - ${spot.numReviews} reviews`}</p>
            </div>
          </div>
          <div>
            <button
              className="reserve-button"
              onClick={() => alert("Feature coming soon")}
            >
              Reserve
            </button>
          </div>
        </div>
      </div>

      <hr className="hz-line"></hr>

      <div></div>
    </div>
  );
};

export default SpotDetails;
