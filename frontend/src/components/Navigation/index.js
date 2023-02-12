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
        {isLoaded && (
          <li className="nav-right-login">
            <ProfileButton className="profile-button" user={sessionUser} />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
