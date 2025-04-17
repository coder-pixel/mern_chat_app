import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const SignUp = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req?.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    if (!username || !fullName) {
      return res
        .status(400)
        .json({ error: "Fullname or Username not provided" });
    }

    const user = await User.findOne({ username }); // looking if you user already with given usernamme

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // https://avatar-placeholder.iran.liara.run/  -- For profile pic
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // creating a new 'User' object
    const newUser = new User({
      username,
      fullName,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      // Generate JWT token here
      const userTokenData = {
        _id: newUser._id,
        username: newUser?.username,
        fullName: newUser?.fullName,
        profilePic: newUser?.profilePic,
        gender: newUser?.gender,
      };
      generateTokenAndSetCookie(userTokenData, res);
      await newUser?.save();

      res.status(201).json({
        _id: newUser?._id,
        fullName: newUser?.fullName,
        username: newUser?.username,
        profilePic: newUser?.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Login = (req, res) => {
  console.log("Login");
  res.send("Login");
};

export const Logout = (req, res) => {
  console.log("Logout");
  res.send("Logout");
};
