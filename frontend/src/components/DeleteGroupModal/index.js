import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./DeleteGroupModal.css";
import { deleteGroup } from "../../store/oneGroup";

function DeleteGroupModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const history = useHistory();

  const group = useSelector((state) => state.group);

  const id = group.id;

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteGroup(id))
      .then(closeModal)
      .then(history.push("/groups"));
  };

  return (
    <>
      <h1 className="dm-title-txt">Confirm Delete</h1>
      <h3 className="dm-confirm-txt">
        Are you sure you want to remove this group?
      </h3>
      <button className="dm-delete-button" onClick={handleDelete}>
        Yes (Delete Group)
      </button>
      <button className="dm-close-delete-button" onClick={closeModal}>
        No (Keep Group)
      </button>
    </>
  );
}

export default DeleteGroupModal;
