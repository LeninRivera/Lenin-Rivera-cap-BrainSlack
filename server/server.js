require("dotenv").config();
require("./db/config");
const app = require("express")();
const httpServer = require("http").createServer(app);
const PORT = 8080;
const io = require("socket.io")(httpServer, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});
const router = require("./routes/messages");
const cors = require("cors");
const Message = require("./db/models/message");

app.use(cors());

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

const messages = [];

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

  socket.broadcast.emit("new user connected", users);

  socket.on("disconnect", () => {
    console.log("User has left", socket.username, socket.id);

    const disconnectedUserIndex = users
      .map((user) => {
        return user.userID;
      })
      .indexOf(socket.id);

    const updatedUsers = users.filter(
      (user) => users[disconnectedUserIndex].userID !== user.userID
    );

    users.splice(0, users.length, ...updatedUsers);

    socket.broadcast.emit("updated users on disconnect", users);
  });

  socket.on("send private message", async (message) => {
    messages.push(message);

    const newMessage = new Message({
      messageId: message.messageId,
      from: message.from,
      to: message.to,
      text: message.text,
      time: message.time,
      conversationId: message.conversationId,
      unreadMessage: message.unreadMessage,
    });
    await newMessage.save();

    socket.to(message.toSocketId).emit("pushed private message", message);
  });

  socket.on("updated unread message", async (unreadMessageInfo) => {
    try {
      const queryMessages = await Message.updateMany(
        {
          from: `${unreadMessageInfo.from}`,
          to: `${unreadMessageInfo.to}`,
          unreadMessage: true,
        },
        { unreadMessage: false }
      );
    } catch (err) {
      console.log(err.message);
    }
  });
});

app.use(router);

httpServer.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
