import React from "react";
import Wheel from "./Wheel";
import Board from "./Board";
import { List, Button, Progress } from '@mantine/core';
import { Item, PlacedChip, RouletteWrapperState, GameData, GameStages } from "./Global";
import { Timer } from "easytimer.js";
var classNames = require("classnames");
import { io } from "socket.io-client";
import LinearWithValueLabel from "./ProgressBar";
import { height } from "@mui/system";
class RouletteWrapper extends React.Component<any, any> {
  rouletteWheelNumbers = [
    0,
    32,
    15,
    19,
    4,
    21,
    2,
    25,
    17,
    34,
    6,
    27,
    13,
    36,
    11,
    30,
    8,
    23,
    10,
    5,
    24,
    16,
    33,
    1,
    20,
    14,
    31,
    9,
    22,
    18,
    29,
    7,
    28,
    12,
    35,
    3,
    26
  ];
  timer = new Timer();
  numberRef = React.createRef<HTMLInputElement>();
  state: RouletteWrapperState = {
    rouletteData: {
      numbers: this.rouletteWheelNumbers
    },
    chipsData: {
      selectedChip: null,
      placedChips: new Map()
    },
    number: {
      next: null
    },
    winners: new Map(),
    gameData: {
      time_remaining: null,
      stage: GameStages.NONE
    },
    username: ""
  };
  socketServer: any;

  constructor(props: { username: string }) {
    super(props);

    this.onSpinClick = this.onSpinClick.bind(this);
    this.onChipClick = this.onChipClick.bind(this);
    this.getChipClasses = this.getChipClasses.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.placeBet = this.placeBet.bind(this);
    this.clearBet = this.clearBet.bind(this);


    this.socketServer = io("http://localhost:8000");
  }

  componentDidMount() {
    this.socketServer.open();
    this.socketServer.on('stage-change', (data: string) => {
      var gameData = JSON.parse(data) as GameData
      console.log("stage-change stage-change stage-change")
      console.log(gameData)

      this.setGameData(gameData)      
    });
    this.socketServer.on("connect", (socket: { on: (arg0: string, arg1: (data: string) => void) => void; }) => {
      console.log("hereee2");
      this.setState({username: this.props.username}, () => {
        this.socketServer.emit("enter", this.state.username);
      }); 
    });
  }
  componentWillUnmount() {
    this.socketServer.close();
  }
  setGameData(gameData: GameData) { 
    if (gameData.stage === GameStages.ROUND_START) {
      var nextNumber = gameData.value
      this.setState({ number: { next: nextNumber }, gameData: {stage: gameData.stage, timeRemaining: gameData.time_remaining}}, () => {
        console.log(this.state)
        console.log("setGameData setGameData setGameData setGameData")
      }); 
    } else if (gameData.stage === GameStages.WINNERS) {
      if (gameData.wins.size > 0) {
        this.setState({ winners: gameData.wins, gameData: {stage: gameData.stage, timeRemaining: gameData.time_remaining} }, () => {
          console.log(this.state)
          console.log("setGameData setGameData setGameData setGameData")
        }); 
      }
    } else {
      this.setState({gameData: {stage: gameData.stage, timeRemaining: gameData.time_remaining }}, () => {
        console.log(this.state)
        console.log("setGameData setGameData setGameData setGameData")
      }); 
    }
  }

  onCellClick(item: Item) {
    //console.log("----");
    var currentChips = this.state.chipsData.placedChips;

    var chipValue = this.state.chipsData.selectedChip;
    if (chipValue === 0 || chipValue === null) {
      return;
    }
    let currentChip = {} as PlacedChip;
    currentChip.item = item;
    currentChip.sum = chipValue;

    console.log(this.state.chipsData.placedChips);
    console.log(item);
    if (currentChips.get(item) !== undefined) {
      currentChip.sum += currentChips.get(item).sum;
    }

    //console.log(currentChips[item]);
    currentChips.set(item, currentChip);
    this.setState({
      chipsData: {
        selectedChip: this.state.chipsData.selectedChip,
        placedChips: currentChips
      }
    });
  }
  onChipClick(chip: number | null) {
    if (chip != null) {
      this.setState({
        chipsData: {
          selectedChip: chip,
          placedChips: this.state.chipsData.placedChips
        }
      });
    }
    //console.log(chip);
    //console.log(this.state);
  }
  getChipClasses(chip: number) {
    var cellClass = classNames({
      chip_selected: chip === this.state.chipsData.selectedChip,
      "chip-100": chip === 100,
      "chip-20": chip === 20,
      "chip-10": chip === 10,
      "chip-5": chip === 5
    });

    return cellClass;
  }
  onSpinClick() {
    var nextNumber = this.numberRef!.current!.value;
    if (nextNumber != null) {
      this.setState({ number: { next: nextNumber } });
    }
  }
  placeBet() { 
    var placedChipsMap = this.state.chipsData.placedChips
    var chips: PlacedChip[] = new Array()
    for(let key of Array.from( placedChipsMap.keys()) ) {

      var chipsPlaced = placedChipsMap.get(key) as PlacedChip
      console.log("place chips");
      console.log(chips);
      console.log(chipsPlaced);
      console.log(chips.length);
      chips.push(chipsPlaced);
     
   }
    this.socketServer.emit("place-bet", JSON.stringify(chips));
  }

  clearBet() { 
    this.setState({
      chipsData: {
        placedChips: new Map()
      }
    });
  }
  render() {
    return (
      <div>
        <div>
          <div className={"winnersBoard"}>
          <List>
            { 
              Array.from(this.state.winners.entries()).map((entry) => {
               
                  const [username, sum] = entry;
                  return (<List.Item>{username} won {sum}$</List.Item>);
              })
            }
          </List>
          </div>
          <Wheel rouletteData={this.state.rouletteData} number={this.state.number} />
          <Board
            onCellClick={this.onCellClick}
            chipsData={this.state.chipsData}
            rouletteData={this.state.rouletteData}
          />
        </div>
        <div className={"progressBar"}>
            <LinearWithValueLabel currentTime={this.state.gameData.time_remaining} endTime={25} />
        </div>
        <h2>Updated: {this.state.number.next}</h2>
        <input className={"number"} ref={this.numberRef} />
        <button className={"spin"} onClick={this.onSpinClick}>
          Spin
        </button>
        <div className="roulette-actions">
          <ul>
            <li>
            <Button  variant="gradient" gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }} size="xl" onClick={() => this.clearBet()} >Clear Bet</Button>
            </li>
            <li className={"board-chip"}>
              <div
                key={"chip_100"}
                className={this.getChipClasses(100)}
                onClick={() => this.onChipClick(100)}
              >
                100
              </div>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_20"}>
                <div
                  className={this.getChipClasses(20)}
                  onClick={() => this.onChipClick(20)}
                >
                  20
                </div>
              </span>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_10"}>
                <div
                  className={this.getChipClasses(10)}
                  onClick={() => this.onChipClick(10)}
                >
                  10
                </div>
              </span>
            </li>
            <li className={"board-chip"}>
              <span key={"chip_5"}>
                <div
                  className={this.getChipClasses(5)}
                  onClick={() => this.onChipClick(5)}
                >
                  5
                </div>
              </span>
            </li>
            <li>
            <Button disabled={this.state.gameData.stage === GameStages.PLACE_BET ? false : true}
            variant="gradient" gradient={{ from: 'orange', to: 'red' }} size="xl" onClick={() => this.placeBet()} >Place Bet</Button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default RouletteWrapper;
