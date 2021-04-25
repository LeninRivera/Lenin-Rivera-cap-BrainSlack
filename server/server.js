const app = require("express")();
const httpServer = require("http").createServer(app);
const PORT = 8080;
const io = require("socket.io")(httpServer, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});
const router = require("./routes/routes");

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  // console.log(socket.username);
  next();
});

//runs when a connection is made
io.on("connection", (socket) => {
  //when a connection is made log below
  console.log("we have a new connection", socket.username, socket.id);

  const users = [];
  const messages = [];

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
    // console.log("user array:", users);
    const disconnectedUserIndex = users
      .map((user) => {
        return user.userID;
      })
      .indexOf(socket.id);
    // console.log("index of disconnected", disconnectedUserIndex);
    const updatedUsers = users.filter(
      (user) => users[disconnectedUserIndex].userID !== user.userID
    );
    // console.log("updated users array", updatedUsers);
    users.splice(0, users.length, ...updatedUsers);
    // console.log(users);

    socket.broadcast.emit("updated users on disconnect", users);
  });

  socket.on("private message", (message) => {
    console.log(message);
    messages.push(message);
    socket.to(message.toSocketId).emit("private message", message);
  });
});

app.use(router);

httpServer.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
