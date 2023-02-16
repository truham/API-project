import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import "./SpotsDeleteModal.css";
import {
  deleteSpotThunk,
  getCurrentUserSpotsThunk,
} from "../../../store/spots";

const SpotsDeleteModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const onClick = async () => {
    // e.preventDefault();

    await dispatch(deleteSpotThunk(spotId)).then(closeModal);
    // await dispatch(getCurrentUserSpotsThunk()).then(closeModal);

    history.push("/spots/current");
  };

  return (
    <div>
      <div className="delete-spot-container">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <button className="delete-spot-button" onClick={onClick}>
          Yes (Delete Spot)
        </button>
        <button className="keep-spot-button" onClick={closeModal}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
};

export default SpotsDeleteModal;
