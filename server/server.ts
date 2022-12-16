import { createServer } from "http";
import { Server } from "socket.io";
import { GameData, GameStages, PlacedChip, ValueType, Winner} from "../src/Global";
import { Timer } from "easytimer.js";

/** Server Handling */
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});
var timer = new Timer();
var users = new Map<string, string>()
let gameData = {} as GameData;
let usersData = {} as Map<string, PlacedChip[]>;
let wins = [] as Winner[];
timer.addEventListener('secondsUpdated', function (e: any) {
  var currentSeconds = timer.getTimeValues().seconds;
  gameData.time_remaining = currentSeconds
  if (currentSeconds == 1) {
    console.log("Place bet");
    usersData = new Map()
    gameData.stage = GameStages.PLACE_BET
    wins = []
    sendStageEvent(gameData)
  } else if (currentSeconds == 25) {
    gameData.stage = GameStages.NO_MORE_BETS
    gameData.value = getRandomNumberInt(0, 36);
    console.log("Roulette starts")
    sendStageEvent(gameData)

    for(let key of Array.from( usersData.keys()) ) {
       var username = users.get(key);
       if (username != undefined) {
        var chipsPlaced = usersData.get(key) as PlacedChip[]
        var sumWon = calculateWinnings(gameData.value, chipsPlaced)
        wins.push({
            username: username,
            sum: sumWon
        });
      }
    }

  } else if (currentSeconds == 35) {
    gameData.stage = GameStages.WINNERS
    // sort winners desc
    if (gameData.history == undefined) {
      gameData.history = []
    } 
    gameData.history.push(gameData.value)

    if (gameData.history.length > 10) {
      gameData.history.shift();
    }
    console.log("wins2")
    console.log(wins)
    console.log("wins2")
    gameData.wins = wins.sort((a,b) => b.sum - a.sum);
    console.log("wins")
    console.log(gameData)
    console.log("Show results")
    sendStageEvent(gameData)
  }

});

io.on("connection", (socket) => {
  console.log("connection : " + socket)
  
  socket.on('enter', (data: string) => {
    console.log("users : " + users.size)
    users.set(socket.id, data);
    console.log("username server: " + data)
    sendStageEvent(gameData);
  });

  socket.on('place-bet', (data: string) => {
    var gameData = JSON.parse(data) as PlacedChip[]
    usersData.set(socket.id, gameData)
    console.log("username server: " + data)
  });
  socket.on("disconnect", (reason) => {
    users.delete(socket.id);
    usersData.delete(socket.id);
  });
});

httpServer.listen(8000, () =>{

  console.log(`Server is running on port 8000`);
  
  timer.start({precision: 'seconds'});
});
function getRandomNumberInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sendStageEvent(_gameData: GameData) { 
  var json = JSON.stringify(_gameData)
  console.log(json)
  io.emit('stage-change', json);
}

var blackNumbers = [ 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35 ];
var redNumbers = [ 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36 ];
var row1Numbers = [ 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36 ];
var row2Numbers = [ 2, 5, 8, 11, 14, 17, 20, 23, 26, 229, 32, 35 ];
var row3Numbers = [ 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34 ];

function calculateWinnings(winningNumber: number, placedChips: PlacedChip[]) { 
  var win = 0;
  var arrayLength = placedChips.length;
  for (var i = 0; i < arrayLength; i++) {
     
      var placedChip = placedChips[i]
      var placedChipType = placedChip.item.type
      var placedChipValue = placedChip.item.value
      var placedChipSum = placedChip.sum
      
      if (placedChipType === ValueType.NUMBER &&  placedChipValue === winningNumber)
      {
          win += placedChipSum * 36;
      }
      else if (placedChipType === ValueType.BLACK && blackNumbers.includes(winningNumber))
      { // if bet on black and win
          win += placedChipSum * 2;
      }
      else if (placedChipType === ValueType.RED && redNumbers.includes(winningNumber))
      { // if bet on red and win
          win += placedChipSum * 2;
      }
      else if (placedChipType === ValueType.NUMBERS_1_18 && (winningNumber >= 1 && winningNumber <= 18))
      { // if number is 1 to 18
          win += placedChipSum * 2;
      }
      else if (placedChipType === ValueType.NUMBERS_19_36 && (winningNumber >= 19 && winningNumber <= 36))
      { // if number is 19 to 36
          win += placedChipSum * 2;
      }
      else if (placedChipType === ValueType.NUMBERS_1_12 && row1Numbers.includes(winningNumber))
      { // if number is within range of row1
          win += placedChipSum * 3;
      }
      else if (placedChipType === ValueType.NUMBERS_2_12 && row2Numbers.includes(winningNumber))
      { // if number is within range of row2
          win += placedChipSum * 3;
      }
      else if (placedChipType === ValueType.NUMBERS_3_12 && row3Numbers.includes(winningNumber))
      { // if number is within range of row3
          win += placedChipSum * 3;
      }
      else if (placedChipType === ValueType.EVEN || placedChipType === ValueType.ODD)
      { 
        if ( winningNumber % 2 == 0) {
             // if number even
            win += placedChipSum * 2;
        } else {
            // if number is odd
            win += placedChipSum * 2;
        }
      }
  }

  return win;
}