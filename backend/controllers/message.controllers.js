import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req?.body; // get message from request body
    const { id: receiverId } = req?.params; // get the id of the receiver from the params
    const senderId = req?.user?._id; // currently authenticated user

    // first we need to find the conversation between these 2 users
    let conversation = await Conversation?.findOne({
      participants: { $all: [senderId, receiverId] }, // find conversation where both sender and receiver are participants
    });

    // if no conversation is found, create a new one
    if (!conversation) {
      conversation = await Conversation?.create({
        participants: [senderId, receiverId],
        // messages: [] // default is empty array
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation?.messages?.push(newMessage?._id);
    }

    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel -- OPTIMIZATION
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req?.params;
    const senderId = req?.user?._id; // coming from protectRoute middleware

    const conversation = await Conversation?.findOne({
      participants: { $all: [senderId, userToChatId] }, // find conversation where both sender and receiver are participants
    })?.populate({
      path: "messages",
      populate: [
        { path: "senderId", select: "fullName username gender profilePic" },
        { path: "receiverId", select: "fullName username gender profilePic" },
      ],
    }); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res?.status(200)?.json([]);

    const messages = conversation?.messages || [];

    res?.status(200)?.json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
