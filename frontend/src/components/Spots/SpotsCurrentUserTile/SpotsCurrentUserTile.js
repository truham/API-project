import { Link } from "react-router-dom";
import "./SpotsCurrentUserTile.css";
import "../SpotsIndexTile/SpotsIndexTile.css";

// Delete Modal
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import SpotsDeleteModal from "../SpotsDeleteModal/SpotsDeleteModal";

const SpotsCurrentUserTile = ({ spot }) => {
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
        </div>
      </Link>
      <div className="current-tile-price-container">
        <div>
          <Link className="tile-link" to={`/spots/${spot.id}`}>
            <span className="tile-price">{`$${spot.price}`}</span>
            <span>{` night`}</span>
          </Link>
        </div>
        <div className="buttons-update-delete-container">
          <Link to={`/spots/${spot.id}/edit`}>
            <button className="buttons-update-delete update-button">
              Update
            </button>
          </Link>
          <div>
            {/* Delete modal popup confirmation */}
            <button className="buttons-update-delete">
              <OpenModalMenuItem
                itemText="Delete"
                modalComponent={<SpotsDeleteModal />}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotsCurrentUserTile;
