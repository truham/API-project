// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
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
          <button className="login-modal-button" type="submit">Log In</button>
          <button className="login-demo-user" type="submit">
            Temp Demo
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginFormModal;
