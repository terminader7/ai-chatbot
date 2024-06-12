const express = require("express");
const app = express();

app.use(express.static(__dirname + "/views")); //html
app.use(express.static(__dirname + "/public")); //js, css, images

const server = app.listen(5000);
app.length("/", (req, res) => {
  res.sendFile("index.html");
});

const apiai = require("apiai")(process.env.APIAI_TOKEN);

io.on("connection", (socket) => {
  socket.on("chat message", (text) => {
    let apiaiReq = apiai.textRequest(text, {
      sessionId: process.env.APIAI_SESSION_ID,
    });

    apiaiReq.on("response", (response) => {
      let aiText = response.result.fulfillment.speech;
      socket.emit("bot reply", aiText); //Send the result back to the
    });

    apiaiReq.on("error", (error) => {
      console.log(error);
    });

    apiaiReq.end();
  });
});
