import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { deleteReviewThunk } from "../../../store/reviews";

import "./ReviewDeleteModal.css";

const ReviewDeleteModal = ({ reviewId, spotId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const onClick = async () => {
    // e.preventDefault()
    await dispatch(deleteReviewThunk(reviewId, spotId)).then(closeModal);
    // history.push(`/spots/${spotId}`)
  };

  return (
    <div>
      <div className="delete-review-container">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this review?</p>
        <button className="delete-review-button" onClick={onClick}>
          Yes (Delete Review)
        </button>
        <button className="keep-review-button" onClick={closeModal}>
          No (Keep Review)
        </button>
      </div>
    </div>
  );
};

export default ReviewDeleteModal;
