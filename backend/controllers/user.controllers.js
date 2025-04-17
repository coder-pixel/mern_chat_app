import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req?.user?._id; // currently authenticated user id

    // get all users list except the currently authenticated user (as we don't want to show that user himself in the sidebar)
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    })?.select("-password");

    res?.status(200)?.json({
      data: filteredUsers,
      totalCount: filteredUsers?.length,
    });
  } catch (error) {
    console.error("Error in get users: ", error.message);
    res?.status(500)?.json({ error: "Internal server error" });
  }
};
