import { Link } from "react-router-dom";

const SpotsIndexTile = ({ spot }) => {
  return (
    <li>
      <Link to={`/spots/${spot.id}`}>
        <img src={spot.previewImage} />
        <div className="tile-location-stars">
          <div className="tile-location">
            {spot.city}, {spot.state}
          </div>
          <div className="tile-stars">{spot.avgRating}</div>
        </div>
        <div className="tile-price">${spot.price} night</div>
      </Link>
    </li>
  );
};

export default SpotsIndexTile;
