import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import socket from "../../socket";
import { v4 as uuidv4 } from "uuid";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [usersArr, setUsersArr] = useState([]);
  const [currentSelectedUserId, setCurrentSelectedUserId] = useState("");
  const [displayMessages, setDisplayMessages] = useState(null);

  socket.connect();

  socket.on("users", (users) => {
    //returns all currently connected users
    setUsersArr(...usersArr, users);
  });

  //adding new user that connect after you login
  socket.on("new user connected", (user) => {
    // console.log(user);
    setUsersArr([...usersArr, user]);
  });

  socket.on("updated users on disconnect", (users) => {
    // console.log("is this working");
    setUsersArr(users);
  });

  socket.on("private message", (message) => {
    console.log(message);
    setMessages([...messages, message]);
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    // console.log(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("this is the handleSubmit");
    // console.log(e.target.text.value);
    console.log("this is the socket:", socket);
    const existingConversation = messages.find((element) => {
      return (
        (element.from === socket.auth.username &&
          element.to === props.match.params.username) ||
        (element.from === props.match.params.username &&
          element.to === socket.auth.username)
      );
    });

    // console.log(existingConversation);
    const message = {
      from: socket.auth.username,
      to: props.match.params.username,
      conversationId: existingConversation
        ? existingConversation.conversationId
        : uuidv4(),
      text: e.target.text.value,
      time: new Date(),
      fromSocketId: socket.id,
      toSocketId: props.match.params.chatId,
    };
    setMessages([...messages, message]);
    console.log(message);
    console.log(messages);
    socket.emit("private message", message);
  };

  const homeHandle = () => {
    socket.disconnect();
    sessionStorage.removeItem("username");
  };

  useEffect(() => {
    console.log(messages);

    //filtering messages to only contain what belongs in the chat
    const chatMessages = messages.filter((element) => {
      console.log("this is chatMessages");
      console.log(element.from);
      console.log(socket.auth.username);
      console.log(element.to);
      console.log(props.match.params.username);
      return (
        (element.from === socket.auth.username &&
          element.to === props.match.params.username) ||
        (element.from === props.match.params.username &&
          element.to === socket.auth.username)
      );
    });
    console.log(chatMessages);

    setDisplayMessages(
      chatMessages.map((message) => {
        console.log("this displayMessages");
        return (
          <div key={uuidv4()}>
            <p>{message.from}</p>
            <p>{message.text}</p>
          </div>
        );
      })
    );
    console.log(displayMessages);
  }, [messages, props.match.params.username]);

  //   console.log(usersArr);
  //   console.log(currentSelectedUserId);
  console.log(messages);
  console.log(displayMessages);

  return (
    <div>
      <Link to="/username" onClick={homeHandle}>
        <h1>Home</h1>
      </Link>
      <div>
        <h2>Users:</h2>
        {usersArr.map((user) => {
          return (
            <>
              <p
                key={user.userID}
                onClick={() => {
                  setCurrentSelectedUserId(user.userID);
                  props.history.push(`/chat/${user.username}/${user.userID}`);
                }}
              >
                {user.username}
              </p>
            </>
          );
        })}
      </div>
      <h1>
        Chat box{" "}
        {props.match.params.username ? props.match.params.username : null}
      </h1>
      <ScrollToBottom>
        <div
          style={{
            width: "70vw",
            height: "40vh",
            backgroundColor: "lightgrey",
          }}
        >
          {/* insert messages here (probably need to use username or socket id from params)*/}
          {displayMessages}
        </div>
      </ScrollToBottom>

      <form onSubmit={handleSubmit}>
        <input type="text" name="text" onChange={handleChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
