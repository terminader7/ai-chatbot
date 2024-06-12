"use strict";

require("dotenv").config();
const express = require("express");
const { v4: uuidv4 } = require("uuid"); // Import uuidv4
const app = express();

app.use(express.static(__dirname + "/views")); //html
app.use(express.static(__dirname + "/public")); //js, css, images

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    server.address().port,
    app.settings.env
  );
});

const io = require("socket.io")(server);
io.on("connection", function (socket) {
  console.log("a user connected");

  const sessionId = uuidv4();

  const apiai = require("apiai")(process.env.APIAI_TOKEN);

  socket.on("chat message", (text) => {
    let apiaiReq = apiai.textRequest(text, {
      sessionId: sessionId,
    });

    apiaiReq.on("response", (response) => {
      let aiText = response.result.fulfillment.speech;
      socket.emit("bot reply", aiText);
    });

    apiaiReq.on("error", (error) => {
      console.log(error);
    });

    apiaiReq.end();
  });
});
