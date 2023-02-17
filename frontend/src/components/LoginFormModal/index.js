// frontend/src/components/LoginFormModal/index.js
import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  // log in demo user
  // all buttons naturally submit if forms have onSubmit
  const demoSignIn = (e) => {
    // console.log(e)
    e.preventDefault();

    return dispatch(
      sessionActions.login({ credential: "Demo-lition", password: "password" })
    ).then(closeModal);
    // switched to directly dispatching login above
    // setCredential("Demo-lition");
    // setPassword("password");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  // disable login conditional
  const logInDisable = credential.length < 4 || password.length < 6;

  return (
    <>
      <div className="login-modal-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h3 className="login-header">Log In</h3>
          <ul>
            {errors.map((error, idx) => (
              <li className="login-errors" key={idx}>
                {error}
              </li>
            ))}
          </ul>
          <input
            className="login-modal-input"
            placeholder="Username or Email"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            className="login-modal-input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            disabled={logInDisable}
            className={`${
              logInDisable
                ? "login-modal-button-disabled"
                : "login-modal-button"
            }`}
            type="submit"
          >
            Log In
          </button>
          <button
            onClick={(e) => demoSignIn(e)}
            className="login-demo-user"
            type="submit"
          >
            Log in as Demo User
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
