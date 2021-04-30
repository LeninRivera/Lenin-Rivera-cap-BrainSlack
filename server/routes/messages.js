const express = require("express");
const router = express.Router();
const Message = require("../db/models/message");

router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
