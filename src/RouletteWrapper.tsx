import React from "react";
import Wheel from "./Wheel";
import Board from "./Board";
import { List, Button, Progress } from '@mantine/core';
import { Item, PlacedChip, RouletteWrapperState, GameData, GameStages } from "./Global";
import { Timer } from "easytimer.js";
var classNames = require("classnames");
import { io } from "socket.io-client";
import { height } from "@mui/system";
import anime from "animejs";
import ProgressBarRound from "./ProgressBar";

// var singleRotation = 0

// var r1 = singleRotation * 0 // 0
// var r2 = singleRotation * 2 // 19.45..

class RouletteWrapper extends React.Component<any, any> {
  
  rouletteWheelNumbers = [ 
    0, 32, 15, 19, 4, 21, 2, 25,
    17, 34, 6, 27, 13, 36, 11,
    30, 8, 23,10, 5, 24, 16, 33,
    1, 20, 14, 31, 9, 22, 18, 29,
    7, 28, 12, 35, 3, 26
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
    winners: [],
    history: [],
    stage: GameStages.NONE,
    username: "",
    endTime: 0,
    progressCountdown: 0,
    time_remaining: 0,
  };
  socketServer: any;
  animateProgress: any;

  blackNumbers = [ 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 29, 28, 31, 33, 35 ];
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
    if (gameData.stage === GameStages.NO_MORE_BETS) { // PLACE BET from 25 to 35
      var endTime = 35;
      var nextNumber = gameData.value
      this.setState({ endTime: endTime, progressCountdown: endTime - gameData.time_remaining, number: { next: nextNumber }, stage: gameData.stage, time_remaining: gameData.time_remaining}); 
    } else if (gameData.stage === GameStages.WINNERS) { // PLACE BET from 35 to 59
      var endTime = 59;
      if (gameData.wins.length > 0) {
        this.setState({ endTime: endTime, progressCountdown: endTime - gameData.time_remaining,winners: gameData.wins,stage: gameData.stage, time_remaining: gameData.time_remaining, history: gameData.history }); 
      } else {
        this.setState({ endTime: endTime, progressCountdown: endTime - gameData.time_remaining, stage: gameData.stage, time_remaining: gameData.time_remaining, history: gameData.history }); 
     }
    } else { // PLACE BET from 0 to 25
      var endTime = 25;
      this.setState({endTime: endTime, progressCountdown: endTime - gameData.time_remaining, stage: gameData.stage , time_remaining: gameData.time_remaining}); 
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
          <table className={"rouletteWheelWrapper"}>
            <tr>
            <td className={"winnersBoard"}>
            <div className={"winnerItemHeader hideElementsTest"} >WINNERS</div>
              { 
                this.state.winners.map((entry, index) => {
                    return (<div className="winnerItem">{index+1}. {entry.username} won {entry.sum}$</div>);
                })
              }
            </td>
            <td><Wheel rouletteData={this.state.rouletteData} number={this.state.number} /></td>
            <td>
              <div className={"winnerHistory hideElementsTest"}>
              { 
                this.state.history.map((entry, index) => {
                  if (entry === 0) {
                    return (<div className="green">{entry}</div>);
                  } else if (this.blackNumbers.includes(entry)) {
                    return (<div className="black">{entry}</div>);
                  } else {
                    return (<div className="red">{entry}</div>);
                  }
                })
              }
              </div>
            </td>
              
            </tr>
          </table>
          <Board
            onCellClick={this.onCellClick}
            chipsData={this.state.chipsData}
            rouletteData={this.state.rouletteData}
          />
        </div>
        <div className={"progressBar hideElementsTest"}>
          <ProgressBarRound stage={this.state.stage} maxDuration={this.state.endTime} currentDuration={this.state.time_remaining} />
        </div>
        {/* <div>
        <h2>Updated: {this.state.number.next}</h2>
          <input className={"number"} ref={this.numberRef} />
          <button className={"spin"} onClick={this.onSpinClick}>
            Spin
          </button>
        </div> */}
        <div className="roulette-actions hideElementsTest">
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
            <Button disabled={this.state.stage === GameStages.PLACE_BET ? false : true}
            variant="gradient" gradient={{ from: 'orange', to: 'red' }} size="xl" onClick={() => this.placeBet()} >Place Bet</Button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default RouletteWrapper;
