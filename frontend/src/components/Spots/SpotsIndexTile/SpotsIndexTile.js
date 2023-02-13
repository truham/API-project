import { Link } from "react-router-dom";
import "./SpotsIndexTile.css";

const SpotsIndexTile = ({ spot }) => {
  return (
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
            <p className="tile-price">${spot.price}</p>
            <p>/night</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SpotsIndexTile;
