import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoUser = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.demoUser()).then(closeModal);
  };

  let loginButton;
  if (credential.length >= 4 && password.length >= 6) {
    loginButton = (
      <button type="submit" id="login-button">
        Log In
      </button>
    );
  } else {
    loginButton = (
      <button type="submit" disabled id="login-disabled-button">
        Log In
      </button>
    );
  }

  return (
    <>
      <div id="login-div">
        <h1 id="login-txt">Log In</h1>
        <form onSubmit={handleSubmit}>
          <input
            id="credential-input"
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            id="password-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.credential && <p>{errors.credential}</p>}
          {loginButton}
          <button onClick={handleDemoUser} id="demouser-button">
            Log in as Demo User
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
