import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleSpotThunk } from "../../../store/spots";
import { getSpotsReviewsThunk } from "../../../store/reviews";

// Create New Review Modal + Form
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import ReviewFormModal from "../../Reviews/ReviewFormModal/ReviewFormModal";

// Delete Review Modal
import ReviewDeleteModal from "../../Reviews/ReviewDeleteModal/ReviewDeleteModal";

import "./SpotDetails.css";

const SpotDetails = () => {
  // pass spotId from params to thunk to search for spot in backend
  const dispatch = useDispatch();
  const { spotId } = useParams();

  // --------------- Spot's Details Feature ---------------
  // grab the singleSpot from state for react usage
  const spot = useSelector((state) => state.spots.singleSpot);

  // from app => navigation
  const [isLoaded, setIsLoaded] = useState(false);

  // grabs single spot details from redux
  useEffect(() => {
    dispatch(getSingleSpotThunk(spotId)).then(() => setIsLoaded(true));
    // dispatch(getSpotsReviewsThunk(spotId)).then(() => setIsLoaded(true)); // moved into store getSingleSpotThunk
  }, [dispatch]);

  // --------------- Spot's Ratings & Reviews Feature ---------------
  const reviewsList = useSelector((state) => state.reviews.spot);
  const reviews = Object.values(reviewsList);
  // console.log("reviews", reviews);

  // useEffect(() => {}, [dispatch]);

  // --------------- Current User Reviewed? ---------------
  // check if user is logged in
  const sessionUser = useSelector((state) => state.session.user);
  // check if user has written a review
  const sessionUserReview = reviews.find(
    (review) => review.userId === sessionUser?.id
  );
  const sessionUserOwned = spot.ownerId === sessionUser?.id;

  // if spot belongs to owner, don't populate button

  // if not, populate button to create review
  // if so, hide button from user
  // delete button pops up for logged in user's review only

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
    <>
      {isLoaded ? (
        <div className="single-spot-outer">
          <div className="single-spot-container">
            {/* Heading */}
            <div>
              <h3>{spot.name}</h3>
              <p className="single-spot-heading">
                {spot.city}, {spot.state}, {spot.country}
              </p>
            </div>

            {/* Images */}
            <div className="spot-details-images-container">
              <img className="single-spot-image" src={previewImage.url} />
              <div className="extra-spot-images-container">
                {extraImages.map((image) => (
                  <img
                    key={image.url}
                    className="single-spot-extra-images"
                    src={image.url}
                  ></img>
                ))}
              </div>
            </div>

            <div className="single-spot-info-container">
              {/* Text */}
              <div className="single-spot-info-text">
                <h3>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h3>
                <p>{`${spot.description}`}</p>
              </div>

              {/* Callout box */}
              <div className="single-spot-callout-container">
                <div className="price-reviews-container">
                  <div>
                    <span className="tile-price">{`$${Number(
                      spot.price
                    ).toFixed(2)}`}</span>
                    <span>{` night`}</span>
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
                    Register
                  </button>
                </div>
              </div>
            </div>

            <hr className="hz-line"></hr>

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

              {/* Create Review Button for Session User */}
              {sessionUser && !sessionUserOwned && !sessionUserReview && (
                <button className="post-your-review-button">
                  <OpenModalMenuItem
                    itemText="Post Your Review"
                    modalComponent={<ReviewFormModal />}
                  />
                </button>
              )}

              {/* List of Reviews */}
              <div>
                <ul>
                  {reviews.length
                    ? reviews.map((review) => (
                        <li key={review.id}>
                          <p>{review.User.firstName}</p>
                          <p>{dateCreator(review.createdAt)}</p>
                          <p>{review.review}</p>
                          {/* Populate review delete for logged in users */}
                          {review.userId === sessionUser?.id && (
                            <button className="spot-delete-review-button">
                              <OpenModalMenuItem
                                itemText="Delete"
                                modalComponent={
                                  <ReviewDeleteModal
                                    reviewId={review.id}
                                    spotId={spotId}
                                  />
                                }
                              />
                            </button>
                          )}
                          <br></br>
                        </li>
                      ))
                    : sessionUser
                    ? "Be the first to post a review!"
                    : ""}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h3>Unable to retrieve details. Please try again shortly.</h3>
      )}
    </>
  );
};

export default SpotDetails;
