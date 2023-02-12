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

  // disable log in
  useEffect(() => {
    const valErrors = [];

    if (password.length < 6 || credential.length < 4) valErrors.push("");

    setErrors(valErrors);
  }, [credential, password]);

  // log in demo user
  const demoSignIn = (e) => {
    // e.preventDefault() // returns an error reading undefined
    // used for forms bc they refresh inherently, buttons do not

    setCredential("Demo-lition");
    setPassword("password");

    handleSubmit();
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
  const logInDisable = errors.length > 0 ? true : false;

  return (
    <>
      <div className="login-modal-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h3>Log In</h3>
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
            Demo User
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
