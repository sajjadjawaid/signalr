// var createError = require("http-errors");
// var express = require("express");

// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
const signalr = require("node-signalr");

// var app = express();

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

//signalr
const client = new signalr.Client(
  "https://echoespre.flexeducation.org/signalr",
  ["messagingHub", "screenShareHub"]
);

client.callTimeout = 10000; // 10s timeout for sending messages
client.reconnectDelayTime = 2000; // 2s delay for reconnecting
client.requestTimeout = 2000; // 2s timeout for connecting

// Bind client events
client.on("connected", () => {
  console.log("SignalR client connected.");
});

client.on("reconnecting", (retryCount) => {
  console.log(`SignalR client reconnecting(${retryCount}).`);
});

client.on("disconnected", (reason) => {
  console.log(`SignalR client disconnected(${reason}).`);
});

client.on("error", (error) => {
  console.log(`SignalR client connect error: ${error.code}.`);
});

// Bind to receive message from the hub
client.connection.hub.on("messagingHub", "getMessage", (message) => {
  console.log("Received message:", message);
});

// Call the hub method
const message = { user: "user1", message: "Hello from client!" };

client.connection.hub
  .call("messagingHub", "groupName", message)
  .then((result) => {
    console.log("Message sent successfully:", result);
  })
  .catch((error) => {
    console.log("Error sending message:", error);
  });

// app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });
client.start();

// module.exports = app;
