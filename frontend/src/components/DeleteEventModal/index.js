import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { Redirect, useHistory, useParams } from "react-router-dom";
import "./DeleteEventModal.css";
import { deleteEvent } from "../../store/oneEvent";

function DeleteEventModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const history = useHistory();

  const event = useSelector((state) => state.event);

  const id = event.id;

  const group = useSelector((state) => state.group);

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteEvent(id)).then(closeModal());
    history.push(`/groups/${group.id}`);
  };

  return (
    <>
      <h1 className="dm-title-txt">Confirm Delete</h1>
      <h3 className="dm-confirm-txt">
        Are you sure you want to remove this event?
      </h3>
      <button className="dm-delete-button" onClick={handleDelete}>
        Yes (Delete Event)
      </button>
      <button className="dm-close-delete-button" onClick={closeModal}>
        No (Keep Event)
      </button>
    </>
  );
}

export default DeleteEventModal;
