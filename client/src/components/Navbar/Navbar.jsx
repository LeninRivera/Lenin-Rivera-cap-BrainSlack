import React, { useState } from "react";
import "./Navbar.scss";
import Userfront from "@userfront/react";

function Navbar({ logout, username }) {
  return (
    <nav className="nav">
      <h1 className="nav--title">BrainSlack</h1>
      <ul className="nav__list">
        <li className="nav__list--profile">
          <a href="/my-profile">My Profile</a>
        </li>
        <li className="nav__list--chat">
          <a href="/">Chat</a>
        </li>
        <li className="nav__list--logout" onClick={logout}>
          Logout, {username}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
