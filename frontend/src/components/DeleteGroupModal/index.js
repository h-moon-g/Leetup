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

  const group = useSelector((state) => state.group);

  const id = group.id;

  const handleDelete = (e) => {
    e.preventDefault();
    return dispatch(deleteGroup(id)).then(closeModal);
  };

  return (
    <>
      <h1>Confirm Delete</h1>
      <h3>Are you sure you want to remove this group?</h3>
      <button onClick={handleDelete}>Yes Delete Group</button>
      <button onClick={closeModal}>No Keep Group</button>
    </>
  );
}

export default DeleteGroupModal;
