const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    unique: true,
    trim: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    require: true,
  },
  conversationId: {
    type: String,
    require: true,
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
