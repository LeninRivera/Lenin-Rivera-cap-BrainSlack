import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import socket from "../../socket";
import { v4 as uuidv4 } from "uuid";
import ScrollToBottom from "react-scroll-to-bottom";
import Navbar from "../Navbar/Navbar";
import "./Chat.scss";
import jwt from "jsonwebtoken";
import Userfront from "@userfront/react";
import axios from "axios";
import moment from "moment";

function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [usersArr, setUsersArr] = useState([]);
  const [currentSelectedUser, setCurrentSelectedUser] = useState("");
  const [displayMessages, setDisplayMessages] = useState(null);
  const [displayUsers, setDisplayUsers] = useState(null);
  const [user, setUser] = useState("");

  const allUserInfo = jwt.decode(Userfront.idToken());

  const username = allUserInfo.name;

  socket.auth = { username };
  socket.connect();

  useEffect(() => {
    setCurrentSelectedUser(props.match.params.username);
    setUser(username);
    axios
      .get("http://localhost:8080/messages")
      .then((res) => {
        console.log(res.data);
        setMessages(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  socket.on("users", (users) => {
    //returns all currently connected users
    users.sort((a, b) => {
      return a.username - b.username;
    });
    setUsersArr(users);
    // setUsersArr(...usersArr, users);
  });

  //adding new user that connect after you login
  socket.on("new user connected", (user) => {
    setUsersArr(user);
  });

  socket.on("updated users on disconnect", (users) => {
    setUsersArr(users);
  });

  //receiving a new message
  socket.on("private message", (message) => {
    setMessages([...messages, message]);
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingConversation = messages.find((element) => {
      return (
        (element.from === socket.auth.username &&
          element.to === props.match.params.username) ||
        (element.from === props.match.params.username &&
          element.to === socket.auth.username)
      );
    });

    const time = moment().format("MMMM Do YYYY, h:mm a");

    //finds the user we are sending a DM to from our usersArr
    const toSocket = usersArr.find(
      (element) => element.username === props.match.params.username
    );

    const message = {
      messageId: uuidv4(),
      from: socket.auth.username,
      to: props.match.params.username,
      conversationId: existingConversation
        ? existingConversation.conversationId
        : uuidv4(),
      text: e.target.text.value,
      time: time,
      fromSocketId: socket.id,
      toSocketId: toSocket.userID,
    };
    setMessages([...messages, message]);
    socket.emit("private message", message);
  };

  const logout = () => {
    document.cookie =
      "refresh.8nwpw7bw=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "id.8nwpw7bw=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "access.8nwpw7bw=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    socket.disconnect();
    props.history.push("/login");
  };

  useEffect(() => {
    const newUsersArr = usersArr.sort((a, b) => {
      const usernameA = a.username.toUpperCase();
      const usernameB = b.username.toUpperCase();

      if (usernameA < usernameB) {
        return -1;
      }
      if (usernameA > usernameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    setDisplayUsers(
      newUsersArr.map((user) => {
        return (
          <li
            className={
              "chat__users__list--user " +
              (currentSelectedUser === user.username ? "currentUser" : "")
            }
            key={user.userID}
            onClick={() => {
              setCurrentSelectedUser(user.username);
              props.history.push(`/chat/${user.username}`);
            }}
          >
            {user.username}
          </li>
        );
      })
    );
  }, [usersArr, props.match.params.username]);

  useEffect(() => {
    //filtering messages to only contain what belongs in the chat
    const chatMessages = messages.filter((element) => {
      return (
        (element.from === socket.auth.username &&
          element.to === props.match.params.username) ||
        (element.from === props.match.params.username &&
          element.to === socket.auth.username)
      );
    });

    console.log("this is setDisplayMessages");
    setDisplayMessages(
      chatMessages.map((message) => {
        return (
          <div className="chat__msg__messages--message" key={uuidv4()}>
            <p className="chat__msg__messages--message--from">
              {message.from}{" "}
              {/* <span className="time">
                {message.time.toLocaleString("en-us")}
              </span> */}
            </p>
            <p className="chat__msg__messages--message--text">{message.text}</p>
          </div>
        );
      })
    );
  }, [messages, props.match.params.username]);

  return (
    <>
      <Navbar username={username} logout={logout} />
      <main className="chat">
        <section className="chat__users">
          <h2 className="chat__users--title">Users</h2>
          <ul className="chat__users__list">{displayUsers}</ul>
        </section>
        <section className="chat__msg">
          <h1 className="chat__msg--title">
            {props.match.params.username ? (
              props.match.params.username
            ) : (
              <>Chat</>
            )}
          </h1>
          <ScrollToBottom>
            <div className="chat__msg__messages">
              {/* insert messages here (probably need to use username or socket id from params)*/}
              {displayMessages}
            </div>
          </ScrollToBottom>

          <form className="chat__msg__form" onSubmit={handleSubmit}>
            <input
              className="chat__msg__form--input"
              type="text"
              name="text"
              onChange={handleChange}
            />
            <button className="chat__msg__form--send" type="submit">
              Send
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default Chat;
