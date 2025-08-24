const express = require("express");
const app = express();
require("dotenv").config();
const connectToDB = require("./config/connectToDB");
connectToDB();
app.use(express.json());


const port = 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/users.route"));
app.use("/api/posts", require("./routes/posts.route"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
