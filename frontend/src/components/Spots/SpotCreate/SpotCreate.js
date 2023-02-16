import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { postNewSpotThunk, postNewSpotImageThunk } from "../../../store/spots";

import "./SpotCreate.css";

const PostNewSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // Create spot form inputs
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [errors, setErrors] = useState({});

  // Add spot images inputs
  // 5 total inputs for each img, img #1 set as preview true
  // Different error conditionals for preview and file format
  const [previewImage, setPreviewImage] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [image5, setImage5] = useState("");

  // handle frontend error validaitons
  useEffect(() => {
    // switch to objects, faster via finding key instead of filter
    // *less code to write when finding which error to populate for user
    const valErrors = {};

    // text and number inputs
    if (country.length < 1) valErrors.country = "Country is required";
    if (address.length < 1) valErrors.address = "Address is required";
    if (city.length < 1) valErrors.city = "City is required";
    if (state.length < 1) valErrors.state = "State is required";
    if (lat.length < 1) valErrors.lat = "Latitude is required";
    if (lng.length < 1) valErrors.lng = "Longitude is required";
    if (description.length < 30)
      valErrors.description = "Description needs a minimum of 30 characters";
    if (name.length < 1) valErrors.name = "Name is required";
    if (price.length < 1) valErrors.price = "Price is required";

    // image inputs
    // helper fxn to check url match
    const checkImageURL = (imageURL) => {
      return (
        !imageURL.endsWith(".png") &&
        !imageURL.endsWith(".jpg") &&
        !imageURL.endsWith(".jpeg")
      );
    };

    if (previewImage.length < 1)
      valErrors.previewImage = "Preview image is required";
    if (checkImageURL(previewImage))
      valErrors.previewImageURL = "Image URL must end in .png, .jpg, or .jpeg";
    if (image2 && checkImageURL(image2))
      valErrors.image2URL = "Image URL must end in .png, .jpg, or .jpeg";
    if (image3 && checkImageURL(image3))
      valErrors.image3URL = "Image URL must end in .png, .jpg, or .jpeg";
    if (image4 && checkImageURL(image4))
      valErrors.image4URL = "Image URL must end in .png, .jpg, or .jpeg";
    if (image5 && checkImageURL(image5))
      valErrors.image5URL = "Image URL must end in .png, .jpg, or .jpeg";

    setErrors(valErrors);
  }, [
    country,
    address,
    city,
    state,
    lat,
    lng,
    description,
    name,
    price,
    previewImage,
    image2,
    image3,
    image4,
    image5,
  ]);

  // handle submission after create spot button clicked
  const onSubmit = async (e) => {
    // prevent form submission page refresh
    e.preventDefault();

    // toggle that user has submitted form to populate errors
    setHasSubmitted(true);

    // check for any errors, if so, populate errors for user
    if (Object.values(errors).length > 0) return "Please";

    // body format expected from backend
    const newSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    };

    // send newSpot body to bridge to backend
    let createdSpot = await dispatch(postNewSpotThunk(newSpot));

    // -------------- IMAGE HANDLING --------------
    const createdSpotId = createdSpot.id;
    // send required image body to bridge to backend
    const newPreviewImage = {
      url: previewImage,
      preview: true,
    };
    dispatch(postNewSpotImageThunk(newPreviewImage, createdSpotId));

    // optional images
    if (image2)
      await dispatch(
        postNewSpotImageThunk({ url: image2, preview: false }, createdSpotId)
      );
    if (image3)
      await dispatch(
        postNewSpotImageThunk({ url: image3, preview: false }, createdSpotId)
      );
    if (image4)
      await dispatch(
        postNewSpotImageThunk({ url: image4, preview: false }, createdSpotId)
      );
    if (image5)
      await dispatch(
        postNewSpotImageThunk({ url: image5, preview: false }, createdSpotId)
      );

    // redirect user to new spot's single display page
    if (createdSpot) {
      history.push(`/spots/${createdSpotId}`);
    }
  };

  return (
    <div>
      <form className="create-spot-form" onSubmit={onSubmit}>
        <h3>Create a New Spot</h3>
        <h4>Where is your place located?</h4>
        <p>
          Guests will only get your exact address once they've booked a
          reservation.
        </p>
        <div className="create-spot-country">
          <label>
            Country{" "}
            <span className="create-spot-errors">
              {hasSubmitted && errors.country}
            </span>
          </label>
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></input>
        </div>
        <div className="create-spot-address">
          <label>
            Street Address{" "}
            <span className="create-spot-errors">
              {hasSubmitted && errors.address}
            </span>
          </label>
          <input
            type="text"
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></input>
        </div>
        <div className="create-spot-city-state">
          <div className="create-spot-city">
            <label>
              City{" "}
              <span className="create-spot-errors">
                {hasSubmitted && errors.city}
              </span>
            </label>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></input>
          </div>
          <div className="create-spot-state">
            <label>
              State{" "}
              <span className="create-spot-errors">
                {hasSubmitted && errors.state}
              </span>
            </label>
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="create-spot-lng-lat">
          <div className="create-spot-lat">
            <label>
              Latitude{" "}
              <span className="create-spot-errors">
                {hasSubmitted && errors.lat}
              </span>
            </label>
            <input
              type="number"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            ></input>
          </div>
          <div className="create-spot-lng">
            <label>
              {`Longitude`}{" "}
              <span className="create-spot-errors">
                {hasSubmitted && errors.lng}
              </span>
            </label>
            <input
              type="number"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            ></input>
          </div>
        </div>
        <hr className="create-spot-hz-line"></hr>
        <div>
          <h4>Describe your place to guests</h4>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            type="textarea"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p className="create-spot-errors">
            {hasSubmitted && errors.description}
          </p>
        </div>
        <hr className="create-spot-hz-line"></hr>
        <div>
          <h4>Create a title for your spot</h4>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <input
            type="text"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
          <p className="create-spot-errors">{hasSubmitted && errors.name}</p>
        </div>
        <hr className="create-spot-hz-line"></hr>
        <div>
          <h4>Set a base price for your spot</h4>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <span>$</span>
          <input
            type="number"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          ></input>
          <p className="create-spot-errors">{hasSubmitted && errors.price}</p>
        </div>
        <hr className="create-spot-hz-line"></hr>
        <div className="create-spot-photos-container">
          <h4> Liven up your spot with photos </h4>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input
            placeholder="Preview Image URL"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
          ></input>
          <p className="create-spot-errors">
            {hasSubmitted && errors.previewImage}
          </p>
          <p className="create-spot-errors">
            {hasSubmitted && errors.previewImageURL}
          </p>
          <input
            placeholder="Image URL"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
          ></input>{" "}
          <p className="create-spot-errors">
            {hasSubmitted && errors.image2URL}
          </p>
          <input
            placeholder="Image URL"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
          ></input>
          <p className="create-spot-errors">
            {hasSubmitted && errors.image3URL}
          </p>
          <input
            placeholder="Image URL"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
          ></input>
          <p className="create-spot-errors">
            {hasSubmitted && errors.image4URL}
          </p>
          <input
            placeholder="Image URL"
            value={image5}
            onChange={(e) => setImage5(e.target.value)}
          ></input>
          <p className="create-spot-errors">
            {hasSubmitted && errors.image5URL}
          </p>
        </div>
        <hr className="create-spot-hz-line"></hr>
        <div className="create-spot-button-container">
          <button className="create-spot-submit-button" type="submit">
            Create Spot
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostNewSpot;
