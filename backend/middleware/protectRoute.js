import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req?.cookies?.jwtToken; // get the token from the cookies

    if (!token) {
      return res
        ?.status(401)
        ?.json({ error: "Unauthorized - No Token Provided" });
    }

    // decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verifying our token using the jwt secret

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" }); // if the token is invalid, return an error
    }

    const user = await User?.findById(decoded?.userData?._id)?.select(
      "-password" // exclude the password from the user data
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // add the user to the request object

    next(); // if everything is fine, call the next middleware
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
