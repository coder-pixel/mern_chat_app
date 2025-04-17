import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("connection to MongoDB successfull");
  } catch (err) {
    console.log({ err });
    console.log("Error connecting MongoDB");
  }
};

export default connectToMongoDB;
