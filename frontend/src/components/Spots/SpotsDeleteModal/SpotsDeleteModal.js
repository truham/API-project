import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import "./SpotsDeleteModal";

const SpotsDeleteModal = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  return (
    <div>
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <button>Yes (Delete Spot)</button>
      <button onClick={closeModal}>No (Keep Spot)</button>
    </div>
  );
};

export default SpotsDeleteModal;
