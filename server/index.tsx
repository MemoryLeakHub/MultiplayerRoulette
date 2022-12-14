const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  io.to(socket.id).emit("socket_id", socket.id);

  socket.on("send_message", (messageData) => {
    socket.broadcast.emit("receive_message", messageData);
  });
});

server.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
