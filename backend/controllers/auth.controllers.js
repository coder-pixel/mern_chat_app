export const SignUp = (req, res) => {
  console.log("SignUp");
  const { fullName, username, password, confirmPassword, gender } = res?.body;
  res.send("SignUp");
};

export const Login = (req, res) => {
  console.log("Login");
  res.send("Login");
};

export const Logout = (req, res) => {
  console.log("Logout");
  res.send("Logout");
};
