import React, { useState } from "react";
import "./Navbar.scss";

function Navbar({ logout }) {
  return (
    <nav className="nav">
      <h1 className="nav--title">BrainStation WynSLack</h1>
      <ul className="nav__list">
        <li className="nav__list--profile">
          <a href="/my-profile">My Profile</a>
        </li>
        <li className="nav__list--chat">
          <a href="/chat">Chat</a>
        </li>
        <li className="nav__list--logout" onClick={logout}>
          Logout
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
