import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleSpotThunk } from "../../../store/spots";
import { getSpotsReviewsThunk } from "../../../store/reviews";
import "./SpotDetails.css";

const SpotDetails = () => {
  // pass spotId from params to thunk to search for spot in backend
  const dispatch = useDispatch();
  const { spotId } = useParams();

  // Post Review - check if user is logged in
  const sessionUser = useSelector((state) => state.session.user);
  console.log(sessionUser);
  const sessionUserReviewed = sessionUser.id;

  // --------------- Spot's Details Feature ---------------
  // grab the singleSpot from state for react usage
  const spot = useSelector((state) => state.spots.singleSpot);

  // grabs single spot details from redux
  useEffect(() => {
    dispatch(getSingleSpotThunk(spotId));
  }, [dispatch]);

  // --------------- Spot's Ratings & Reviews Feature ---------------
  const reviewsList = useSelector((state) => state.reviews.spot);
  const reviews = Object.values(reviewsList);
  // console.log("reviews", reviews);

  useEffect(() => {
    dispatch(getSpotsReviewsThunk(spotId));
  }, [dispatch]);

  // --------------- Current User's Reviews ---------------
  useEffect(() => {
    // dispatch
    // create thunk to get reviews of current user from backend
    // update state from action + store reducer
    // access reviews to check if current user has written a review for the spot
    // if not, populate button to create review
    // if so, hide button from user
    // delete button pops up for logged in user's review only
  }, [dispatch]);

  // --------------- Additional business logic ---------------
  // if first render returns empty object
  if (!Object.values(spot).length) return;

  // Grab max 5 spot images - come back to later
  //   let spotImages = [];
  //   for (let i = 0; i < 5; i++) {
  //     spotImages.push(spot.SpotImages[i]);
  //   }

  // Month + Year helper fxn - consider refactor
  const dateCreator = (dateData) => {
    let newDate = new Date(dateData);

    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let month = months[newDate.getMonth()];
    let year = newDate.getFullYear();
    let dateOutput = `${month} ${year}`;

    return dateOutput;
  };

  const previewImage = spot.SpotImages.find((image) => image.preview);
  const extraImages = spot.SpotImages.filter(
    (image) => image.preview === false
  );

  return (
    <div className="single-spot-container">
      {/* Heading */}
      <div>
        <h3>{spot.name}</h3>
        <p className="single-spot-heading">
          {spot.city}, {spot.state}, {spot.country}
        </p>
      </div>

      {/* Images */}
      <div>
        <img className="single-spot-image" src={previewImage.url} />
        {extraImages.map((image) => (
          <img
            key={image.url}
            className="single-spot-extra-images"
            src={image.url}
          ></img>
        ))}
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
                Number(spot.avgStarRating)
                  ? `${spot.avgStarRating} · ${spot.numReviews} ${
                      Number(spot.numReviews) === 1 ? "review" : "reviews"
                    }`
                  : "New"
              }`}</p>
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

      {/* {sessionUser && (
        <div className="nav-right-loggedin-user">
          <li className="nav-right-login">

          </li>
        </div>
      )} */}

      {/* Ratings & Reviews Feature */}
      <div className="ratings-reviews-container">
        {/* R&R Heading */}
        <div className="ratings-reviews-heading">
          <i className="fa-solid fa-star"></i>
          <p>{`${
            Number(spot.avgStarRating)
              ? `${spot.avgStarRating} · ${spot.numReviews} ${
                  Number(spot.numReviews) === 1 ? "review" : "reviews"
                }`
              : "New"
          }`}</p>
        </div>
        {/* List of Reviews */}
        <div>
          <ul>
            {/* refactor for conditional later */}
            {reviews.length
              ? reviews.map((review) => (
                  <li key={review.id}>
                    <p>{review.User.firstName}</p>
                    <p>{dateCreator(review.createdAt)}</p>
                    <p>{review.review}</p>
                    <br></br>
                  </li>
                ))
              : "Be the first to post a review!"}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
