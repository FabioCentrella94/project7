// PRODUCTION ENVIRONMENT
/*
const express = require("express");
const bodyParser = require("body-parser");

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

const app = express();

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://project7.myportfolio.training"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.use("/api/post", postsRoutes);
app.use("/api/auth", usersRoutes);

app.get("/", function (req, res) {
  res.json({
    message: "Server is running",
  });
});

module.exports = app;
*/

// DEVELOPMENT ENVIRONMENT
const express = require("express");
const bodyParser = require("body-parser");

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

const app = express();

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://localhost:8080"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.use("/api/post", postsRoutes);
app.use("/api/auth", usersRoutes);

app.get("/", function (req, res) {
  res.json({
    message: "Server is running",
  });
});

module.exports = app;
