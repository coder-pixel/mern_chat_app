import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userData, res) => {
  // create the token
  const token = jwt.sign({ userData }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwtToken", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // in milliseconds
    httpOnly: true, // prevents XSS (cross-site scripting) attacks
    sameSite: "strict", // prevents CSRF (cross-site request forgery) attacks
    secure: process.env.NODE_ENV !== "development", // only send cookie over HTTPS, not HTTP => true in production
  });
};

export default generateTokenAndSetCookie;
