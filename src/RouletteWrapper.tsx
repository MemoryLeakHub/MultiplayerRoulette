import React from "react";
import Wheel from "./Wheel";
import Board from "./Board";
import { Item, PlacedChip, RouletteWrapperState, GameData, GameStages } from "./Global";
var classNames = require("classnames");
import { io } from "socket.io-client";
class RouletteWrapper extends React.Component {
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
    }
  };
  socket: any;

  constructor(props: {} | Readonly<{}>) {
    super(props);
    console.log(4444);
    this.onSpinClick = this.onSpinClick.bind(this);
    this.onChipClick = this.onChipClick.bind(this);
    this.getChipClasses = this.getChipClasses.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.socket = io("http://localhost:8000");
    this.socket.on("connect", () => {
      console.log(this.socket.connected); // true
    });
    
    this.socket.on("disconnect", () => {
      console.log(this.socket.connected); // false
    });
    this.socket.on('stage-change', (data: string) => {
      
      var gameData = JSON.parse(data) as GameData
      console.log(gameData)

      if (gameData.stage == GameStages.ROUND_START) {
        var nextNumber = gameData.value
        this.setState({ number: { next: nextNumber } })
      }
    });
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
  render() {
    return (
      <div>
        <div>
          <Wheel rouletteData={this.state.rouletteData} number={this.state.number} />
          <Board
            onCellClick={this.onCellClick}
            chipsData={this.state.chipsData}
            rouletteData={this.state.rouletteData}
          />
        </div>
        <h2>Updated: {this.state.number.next}</h2>
        <input className={"number"} ref={this.numberRef} />
        <button className={"spin"} onClick={this.onSpinClick}>
          Spin
        </button>
        <div className="roulette-actions">
          <ul>
            <li>
              <div
                key={"chip_100"}
                className={this.getChipClasses(100)}
                onClick={() => this.onChipClick(100)}
              >
                100
              </div>
            </li>
            <li>
              <span key={"chip_20"}>
                <div
                  className={this.getChipClasses(20)}
                  onClick={() => this.onChipClick(20)}
                >
                  20
                </div>
              </span>
            </li>
            <li>
              <span key={"chip_10"}>
                <div
                  className={this.getChipClasses(10)}
                  onClick={() => this.onChipClick(10)}
                >
                  10
                </div>
              </span>
            </li>
            <li>
              <span key={"chip_5"}>
                <div
                  className={this.getChipClasses(5)}
                  onClick={() => this.onChipClick(5)}
                >
                  5
                </div>
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default RouletteWrapper;
