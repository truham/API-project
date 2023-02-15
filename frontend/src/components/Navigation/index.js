// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "../../assets/giburi-logo.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navbar">
      <ul className="navbar-content">
        <li className="nav-left-logo">
          <NavLink exact to="/">
            <img className="logo-image" src={logo}></img>
          </NavLink>
        </li>
        {isLoaded && sessionUser ? (
          <div className="nav-right-loggedin-user">
            <li>
              <NavLink className="nav-right-new-spot" exact to="/spots/new">
                Create a New Spot
              </NavLink>
            </li>
            <li className="nav-right-login">
              <ProfileButton className="profile-button" user={sessionUser} />
            </li>
          </div>
        ) : (
          <div className="nav-right-login">
            <ProfileButton className="profile-button" user={sessionUser} />
          </div>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
