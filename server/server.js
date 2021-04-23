const app = require("express")();
const httpServer = require("http").createServer(app);
const PORT = 8080;
const io = require("socket.io")(httpServer, {
  cors: {
    origin: true, //why is it true and not http://localhost:8080/?
    methods: ["GET", "POST"],
  },
});
const router = require("./routes/routes");

// //adds username to socket.handshake and can be retrieved by socket.username
// io.use((socket, next) => {
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   socket.username = username;
//   console.log(socket.username);
//   next();
// });

// //upon connection we console.log the new user's id and send all existing users to the client
// io.on("connection", (socket) => {
//   console.log("new user connected with id:", socket.id);

//   //when you log in this sends the client all existing users
//   const users = [];
//   for (let [id, socket] of io.of("/").sockets) {
//     users.push({
//       userID: id,
//       username: socket.username,
//     });
//   }
//   socket.emit("users", users);

//   //this notifies all existing users about a/you new users
//   socket.broadcast.emit("new user connected", {
//     userID: socket.id,
//     username: socket.username,
//   });
// });

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  console.log(socket.username);
  next();
});

//runs when a connection is made
io.on("connection", (socket) => {
  //when a connection is made log below
  console.log("we have a new connection", socket.username, socket.id);

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }

  socket.emit("users", users);

  socket.broadcast.emit("new user connected", {
    userID: socket.id,
    username: socket.username,
  });

  socket.on("disconnect", () => {
    console.log("User has left", socket.username, socket.id);
    console.log("user array:", users);
    const disconnectedUserIndex = users
      .map((user) => {
        return user.userID;
      })
      .indexOf(socket.id);
    console.log("index of disconnected", disconnectedUserIndex);
    const updatedUsers = users.filter(
      (user) => users[disconnectedUserIndex].userID !== user.userID
    );
    console.log("updated users array", updatedUsers);
    users.splice(0, users.length, ...updatedUsers);
    console.log(users);

    socket.broadcast.emit("updated users on disconnect", users);
  });
});

app.use(router);

httpServer.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
