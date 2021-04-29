const Message = require("../models/message");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") require("dotenv").config();
require("../config/");

const dbReset = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  console.log(collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
  await Message.countDocuments({}, (err, count) => {
    console.log(`number of messages: ${count}`);
  });
};

let data = [
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Stephanie",
    to: "Andy",
    text: "Hi",
    time: 1619707025,
    conversationId: 1,
  },
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Andy",
    to: "Stephanie",
    text: "Hey?",
    time: 1619707030,
    conversationId: 1,
  },
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Stephanie",
    to: "Andy",
    text: "I can't sleep",
    time: 1619707035,
    conversationId: 1,
  },
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Andy",
    to: "Stephanie",
    text: "I can. Goodnight",
    time: 1619707045,
    conversationId: 1,
  },
];

const seedDataBase = async () => {
  dbReset();
  for (let i = 0; i < data.length; i++) {
    const message = new Message(data[i]);
    try {
      await message.save();
    } catch (err) {
      console.log(err.message);
    }
  }
  let count = await Message.countDocuments({});
  console.log(`number of messages seeded ${count}`);
};

seedDataBase();
