let express = require("express");
let path = require("path");

let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);

let port = 8080;

app.use("/", express.static(path.join(__dirname, "dist/chatApp")));

let pollObj = require("./models/poll");

io.on("connection", socket => {
  console.log("new connection made from client with ID="+socket.id);
  socket.emit("poll", pollObj);

  socket.on("newVote", data => {
    for(let i = 0; i < pollObj.options.length; i++){
      if(pollObj.options[i].value === data){
        pollObj.options[i].count++;
      }
    };
    io.sockets.emit("poll", pollObj);
    socket.broadcast.emit("poll", pollObj);
  })
});

server.listen(port, () => {
  console.log("Listening on port " + port);
});