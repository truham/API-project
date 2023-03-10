import { Link } from "react-router-dom";
import "./SpotsIndexTile.css";

const SpotsIndexTile = ({ spot }) => {
  return (
    <div className="tile-container-outer">
      <div className="tile-container">
        <Link className="tile-link" to={`/spots/${spot.id}`}>
          <img className="tile-img" src={spot.previewImage} />
          <div className="tile-text-content">
            <div className="tile-name-stars">
              <p className="tile-name">{spot.name}</p>
              <p className="tile-stars">
                <i className="fa-solid fa-star"></i>
                {Number(spot.avgRating) ? spot.avgRating : "New"}
              </p>
            </div>
            <div className="tile-location">
              {spot.city}, {spot.state}
            </div>
            <div className="tile-price-container">
              <span className="tile-price">{`$${Number(spot.price).toFixed(
                2
              )}`}</span>
              <span>{` night`}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SpotsIndexTile;
