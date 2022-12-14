import { createServer } from "http";
import { Server } from "socket.io";
import { GameData, GameStages } from "../src/Global";
import { Timer } from "easytimer.js";

/** Server Handling */
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});
var timer = new Timer();
let gameData = {} as GameData;
timer.addEventListener('secondsUpdated', function (e: any) {
  var currentSeconds = timer.getTimeValues().seconds;
  if (currentSeconds == 1) {
    console.log("Place bet");
    gameData.stage = GameStages.PLACE_BET
    sendStageEvent(gameData)
  } else if (currentSeconds == 15) {
    gameData.stage = GameStages.ROUND_START
    gameData.value = getRandomNumberForSpin(0, 36);
    console.log("Roulette starts")
    sendStageEvent(gameData)
  } else if (currentSeconds == 40) {
    gameData.stage = GameStages.WINNERS
    console.log("Show results")
    sendStageEvent(gameData)
  }
  gameData.time_remaining = currentSeconds

});

httpServer.listen(8000, () =>{

  console.log(`Server is running on port 8000`);
  
  timer.start({precision: 'seconds'});
});

function getRandomNumberForSpin(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendStageEvent(_gameData: GameData) { 
  io.emit('stage-change', JSON.stringify(_gameData));
}

// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");
// var { Timer } = require("easytimer.js");

// const app = express();
// const server = http.createServer(app);

// enum GameStages {
//   PLACE_BET,
//   ROUND_START,
//   WINNERS
// }
// type GameData = {
//   stage: GameStages,
//   time_remaining: number;
//   value: number;
//   wins: Map<string, number>
// }
// app.use(cors());

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// io.on("connection", (socket: { id: any; on: (arg0: string, arg1: (messageData: any) => void) => void; broadcast: { emit: (arg0: string, arg1: any) => void; }; }) => {
//   io.to(socket.id).emit("socket_id", socket.id);

//   socket.on("send_message", (messageData: any) => {
//     socket.broadcast.emit("receive_message", messageData);
//   });
// });


// function sendStageEvent(_gameData: GameData) { 
//   server.emit('stage-change', JSON.stringify(_gameData));
// }

// server.listen(8000, () => {
//   console.log(`Server is running on port 8000`);
  
//   timer.start({precision: 'seconds'});
// });


// function getRandomNumberForSpin(min: number, max: number) {
//   return Math.random() * (max - min) + min;
// }