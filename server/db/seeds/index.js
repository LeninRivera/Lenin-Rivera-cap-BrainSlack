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
    time: "April 29th 2021, 11:45 pm",
    conversationId: 1,
    unreadMessage: false,
  },
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Andy",
    to: "Stephanie",
    text: "Hey?",
    time: "April 29th 2021, 11:47 pm",
    conversationId: 1,
    unreadMessage: false,
  },
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Stephanie",
    to: "Andy",
    text: "I can't sleep",
    time: "April 29th 2021, 11:50 pm",
    conversationId: 1,
    unreadMessage: false,
  },
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Andy",
    to: "Stephanie",
    text: "I can. Goodnight",
    time: "April 29th 2021,11:56 pm",
    conversationId: 1,
    unreadMessage: false,
  },
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Andy",
    to: "Andy",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    time: "April 29th 2021,11:56 pm",
    conversationId: 2,
    unreadMessage: false,
  },
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Andy",
    to: "Andy",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    time: "April 29th 2021,11:55 pm",
    conversationId: 2,
    unreadMessage: false,
  },
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Andy",
    to: "Andy",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    time: "April 29th 2021,11:56 pm",
    conversationId: 2,
    unreadMessage: false,
  },
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Andy",
    to: "Andy",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    time: "April 29th 2021,11:56 pm",
    conversationId: 2,
    unreadMessage: false,
  },
  {
    messageId: Math.floor(Math.random() * 1000).toString(),
    from: "Andy",
    to: "Stephanie",
    text: "HOW You doin?",
    time: "April 29th 2021,11:56 pm",
    conversationId: 1,
    unreadMessage: true,
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
