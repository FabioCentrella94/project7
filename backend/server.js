// DEVELOPMENT ENVIRONMENT
/*
const http = require("http");
const app = require("./app");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const httpServer = http.createServer(app);

httpServer.on("error", errorHandler);
httpServer.on("listening", () => {
  const address = httpServer.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

httpServer.listen(port);
*/

// PRODUCTION ENVIRONMENT
const https = require("https");
var fs = require("fs");
const app = require("./app");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

var options = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/project7-backend.myportfolio.training/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/project7-backend.myportfolio.training/fullchain.pem"
  ),
};

const httpsServer = https.createServer(options, app);

httpsServer.on("error", errorHandler);
httpsServer.on("listening", () => {
  const address = httpsServer.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

httpsServer.listen(port);
