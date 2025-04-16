const express = require("express");

const app = express();

const PORT = process.env.PORT || 5500;
app.get("/", (req, res) => {
  console.log("root route");
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port: PORT`);
});
