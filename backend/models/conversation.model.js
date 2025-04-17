import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    // array of user IDs
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // refer to message model id
      default: [],
    },
  ],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
