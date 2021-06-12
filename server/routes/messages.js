const express = require("express");
const router = express.Router();
const Message = require("../db/models/message");

router.get("/user/:username", async (req, res) => {
  try {
    const messagesFrom = await Message.find({
      from: req.params.username,
    });
    const messagesTo = await Message.find({
      to: req.params.username,
    });
    const allMessages = [...messagesFrom, ...messagesTo];
    res.json(allMessages);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
