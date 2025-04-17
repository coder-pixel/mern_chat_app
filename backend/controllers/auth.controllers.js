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
    console.log("Error in signup controller", error?.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { username, password } = req?.body; // get the username and password from the request body

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both username and password." }); // return an error if either of them is missing
    }

    // check for valid username and password
    const user = await User.findOne({ username });

    if (!user) {
      return res?.status(400)?.json({ error: "Username not found" }); // return an error if the user is not found
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    ); // compare the provided password with the stored password
    if (!isPasswordCorrect) {
      return res?.status(400)?.json({ error: "Invalid password" }); // return an error if the password is incorrect
    }

    generateTokenAndSetCookie(user, res);
    return res.status(200).json({
      _id: user?._id,
      fullName: user?.fullName,
      username: user?.username,
      profilePic: user?.profilePic,
      gender: user?.gender,
    });
  } catch (error) {
    console.log("Error in login controller", error?.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const Logout = (req, res) => {
  try {
    res?.cookie("jwtToken", "", { maxAge: 0 }); // delete the cookie
    res?.status(200).json({ message: "Logged out successfully" }); // return a success message
  } catch (err) {
    console.log("Error in logout controller", err?.message);
    res.status(500).json({ error: "Internal Server Error" }); // return an error if there is an issue
  }
};
