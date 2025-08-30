const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectToDB = require("./config/connectToDB");
const xss = require("xss-clean");
const rateLimiting = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const { errorHandler, notFound } = require("./middlewares/error");
connectToDB();
app.use(express.json());

// Security Headers (helmet)
app.use(helmet())

// Prevent HTTP Param Pollution
app.use(hpp());

// Prevent XSS ( Cross Site Scripting ) Attacks
app.use(xss());

// Rate Limiting
app.use(
  rateLimiting({
    windowMs: 10 * 60 * 1000, // 10 Minutes
    max: 200,
  })
);

const port = 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(cors({ origin: "*" }));

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/users.route"));
app.use("/api/posts", require("./routes/posts.route"));
app.use("/api/comments", require("./routes/comments.route"));
app.use("/api/categories", require("./routes/categories.route"));
app.use("/api/password", require("./routes/password.route"));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
