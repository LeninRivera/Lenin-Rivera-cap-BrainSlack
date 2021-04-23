import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Username from "../../pages/Username";
import socket from "../../socket";

function Chat(props) {
  const [msg, setMsg] = useState("");
  const [usersArr, setUsersArr] = useState([]);
  const [currentSelectedUserId, setCurrentSelectedUserId] = useState("");

  //   socket.on("connect_error", (err) => {
  //     if (err.message === "invalid username") {
  //       sessionStorage.removeItem("username");
  //     }
  //   });

  //   socket.on("connect", () => {});

  //   const initReactiveProperties = (user) => {
  //     user.hasNewMessages = false;
  //   };

  //   socket.on("users", (users) => {
  //     console.log(users);

  //     users.forEach((user) => {
  //       user.self = user.userID === socket.id;
  //       initReactiveProperties(user);
  //       console.log(user);
  //       setUsersArr([...usersArr, user]);
  //     });
  //     // users.map((user) => {

  //     // });
  //   });

  socket.on("users", (users) => {
    //returns all currently connected users
    setUsersArr(...usersArr, users);
  });

  //adding new user that connect after you login
  socket.on("new user connected", (user) => {
    console.log(user);
    setUsersArr([...usersArr, user]);
  });

  socket.on("updated users on disconnect", (users) => {
    console.log("is this working");
    setUsersArr(users);
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setMsg(value);
    console.log(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const homeHandle = () => {
    socket.disconnect();
    props.history.push("/username");
    sessionStorage.removeItem("username");
  };

  console.log(usersArr);
  console.log(currentSelectedUserId);
  console.log(props.match.params.chatId);

  return (
    <div>
      <Link onClick={homeHandle}>
        <h1>Home</h1>
      </Link>
      <div>
        <h2>Users:</h2>
        {usersArr.map((user) => {
          return (
            <>
              <p
                onClick={() => {
                  setCurrentSelectedUserId(user.userID);
                  props.history.push(`/chat/${user.userID}`);
                }}
              >
                {user.username}
              </p>
            </>
          );
        })}
      </div>
      <h1>Chat box</h1>
      <div style={{ width: "70vw", height: "40vh", backgroundColor: "blue" }}>
        {msg}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="msg" onChange={handleChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
