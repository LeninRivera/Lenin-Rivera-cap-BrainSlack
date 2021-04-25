import React, { useState, useEffect } from "react";
import socket from "../socket";

function Username(props) {
  const [username, setUsername] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    console.log(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.username.value !== "") {
      sessionStorage.setItem("username", e.target.username.value);
      socket.auth = { username };
      // socket.connect();
      props.history.push("/");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          name="username"
          placeholder="Username"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Username;
