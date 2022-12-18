import React from "react";
import { ValueType, Item } from "./Global";
import Chip from "./Chip";
import ChipComponent from "./ChipComponent";
var classNames = require("classnames");

class Board extends React.Component<any, any> {
  numbers: Item[][];
  other_1_12 = { type: ValueType.NUMBERS_1_12 } as Item;
  other_2_12 = { type: ValueType.NUMBERS_2_12 } as Item;
  other_3_12 = { type: ValueType.NUMBERS_3_12 } as Item;
  other_1_18 = { type: ValueType.NUMBERS_1_18 } as Item;
  other_19_36 = { type: ValueType.NUMBERS_19_36 } as Item;
  other_even = { type: ValueType.EVEN } as Item;
  other_odd = { type: ValueType.ODD } as Item;
  other_red = { type: ValueType.RED } as Item;
  other_black = { type: ValueType.BLACK } as Item;
  totalNumbers = 37;
  rouletteWheenNumbers: number[];

  constructor(props: { rouletteData: { numbers: number[]; }; }) {
    super(props);
    this.onCellClick = this.onCellClick.bind(this);

    this.numbers = this.getNumbersList();
    this.rouletteWheenNumbers = props.rouletteData.numbers;
  }

  getRouletteColor = (number: number) => {
    var index = this.rouletteWheenNumbers.indexOf(number);
    const i =
      index >= 0
        ? index % this.totalNumbers
        : this.totalNumbers - Math.abs(index % this.totalNumbers);
    return i == 0 || number == null ? "none" : i % 2 == 0 ? "black" : "red";
  };

  getCellItemFromCellItemType(type: any) {}
  getClassNamesFromCellItemType(type: ValueType, number: number | null) {
    var isEvenOdd = 0;
    if (number != null && type === ValueType.NUMBER && number !== 0) {
      if (number % 2 === 0) {
        isEvenOdd = 1;
      } else {
        isEvenOdd = 2;
      }
    }
    let numberValue = "value-" + number;
    var cellClass = classNames({
      //[`${numberValue}`]: true,
      "board-cell-number": type === ValueType.NUMBER,
      "board-cell-double-split": type === ValueType.DOUBLE_SPLIT,
      "board-cell-quad-split": type === ValueType.QUAD_SPLIT,
      "board-cell-triple-split": type === ValueType.TRIPLE_SPLIT,
      "board-cell-empty": type === ValueType.EMPTY,
      "board-cell-even": type === ValueType.EVEN || isEvenOdd === 1,
      "board-cell-odd": type === ValueType.ODD || isEvenOdd === 2,
      "board-cell-number-1-18":
        type === ValueType.NUMBERS_1_18 ||
        (number !== null && number >= 1 && number <= 18 && type === ValueType.NUMBER),
      "board-cell-number-19-36":
        type === ValueType.NUMBERS_19_36 ||
        (number !== null && number >= 19 && number <= 36 && type === ValueType.NUMBER),
      "board-cell-number-1-12":
        type === ValueType.NUMBERS_1_12 ||
        (number !== null && number % 3 === 0 && type === ValueType.NUMBER && number !== 0),
      "board-cell-number-2-12":
        type === ValueType.NUMBERS_2_12 ||
        (number !== null && number % 3 === 2 && type === ValueType.NUMBER),
      "board-cell-number-3-12":
        type === ValueType.NUMBERS_3_12 ||
        (number !== null && number % 3 === 1 && type === ValueType.NUMBER),
      "board-cell-red":
        type === ValueType.RED ||
        (number !== null && this.getRouletteColor(number) === "red" && type === ValueType.NUMBER),
      "board-cell-black":
        type === ValueType.BLACK ||
        (number !== null && this.getRouletteColor(number) === "black" && type === ValueType.NUMBER)
    });

    return cellClass;
  }
  
  getNumbersList() {

    let colList: Array<Array<Item>> = [];
    var difference = 3;

    for (let i = 1; i <= 5; i++) {
      let rowList: Array<Item> = [];
      var startNumberSub = 0;
      if (i === 3) {
        startNumberSub = 1;
      } else if (i == 5) {
        startNumberSub = 2;
      }

      var nextStartNumberSub = 0;
      if (i + 1 === 3) {
        nextStartNumberSub = 1;
      } else if (i + 1 === 5) {
        nextStartNumberSub = 2;
      }
      var prevStartNumberSub = 0;
      if (i - 1 === 3) {
        prevStartNumberSub = 1;
      } else if (i - 1 === 5) {
        prevStartNumberSub = 2;
      }
      if (i === 1) {
        let cell = {} as Item;
        cell.type = ValueType.NUMBER;
        cell.value = 0;

        rowList.push(cell);
      }
      for (let j = 1; j <= 26; j++) {
        let cell = {} as Item;

        if (j > 24) {
          cell.type = ValueType.EMPTY;
          rowList.push(cell);
          continue;
        }
        // 2, 4 mid splits
        if (i % 2 === 0) {
          if (j === 1) {
            var leftNumber = 0;
            var topNumber = difference - prevStartNumberSub;
            var bottomNumber = difference - nextStartNumberSub;

            cell.type = ValueType.TRIPLE_SPLIT;
            cell.valueSplit = [leftNumber, topNumber, bottomNumber];
            rowList.push(cell);
          } else {
            if (j % 2 === 0) {
              var topNumber =
                ((j - 2) / 2) * difference + difference - prevStartNumberSub;
              var bottomNumber =
                ((j - 2) / 2) * difference + difference - nextStartNumberSub;
              cell.type = ValueType.DOUBLE_SPLIT;
              cell.valueSplit = [topNumber, bottomNumber];
              rowList.push(cell);
            } else {
              var leftNumber = ((j - 1) / 2) * difference - prevStartNumberSub;
              var rightNumber = leftNumber + difference;
              var bottomLeftNumber =
                ((j - 1) / 2) * difference - nextStartNumberSub;
              var bottomRightNumber = bottomLeftNumber + difference;
              cell.type = ValueType.QUAD_SPLIT;
              cell.valueSplit = [
                leftNumber,
                rightNumber,
                bottomLeftNumber,
                bottomRightNumber
              ];
              rowList.push(cell);
            }
          }
        } else {
          // 1, 3, 5 normal rows
          if (j === 1) {
            var leftNumber = 0;
            var rightNumber = leftNumber + difference;
            cell.type = ValueType.DOUBLE_SPLIT;
            cell.valueSplit = [leftNumber, rightNumber];
            rowList.push(cell);
          } else {
            if (j % 2 === 0) {
              var currentNumber =
                ((j - 2) / 2) * difference + difference - startNumberSub;
              cell.type = ValueType.NUMBER;
              cell.value = currentNumber;
              rowList.push(cell);
            } else {
              var leftNumber = ((j - 1) / 2) * difference - startNumberSub;
              var rightNumber = leftNumber + difference;
              cell.type = ValueType.DOUBLE_SPLIT;
              cell.valueSplit = [leftNumber, rightNumber];
              rowList.push(cell);
            }
          }
        }
      }
      colList.push(rowList);
    }
    console.log(colList);
    return colList;
  }

  onCellClick = (item: any) => {
    this.props.onCellClick(item);
  };

  render() {
    var currentItemChips_1_12 = this.props.chipsData.placedChips.get(
      this.other_1_12
    );
    var currentItemChips_2_12 = this.props.chipsData.placedChips.get(
      this.other_2_12
    );
    var currentItemChips_3_12 = this.props.chipsData.placedChips.get(
      this.other_3_12
    );
    var currentItemChips_1_18 = this.props.chipsData.placedChips.get(
      this.other_1_18
    );
    var currentItemChips_even = this.props.chipsData.placedChips.get(
      this.other_even
    );
    var currentItemChips_red = this.props.chipsData.placedChips.get(
      this.other_red
    );
    var currentItemChips_black = this.props.chipsData.placedChips.get(
      this.other_black
    );
    var currentItemChips_odd = this.props.chipsData.placedChips.get(
      this.other_odd
    );
    var currentItemChips_19_36 = this.props.chipsData.placedChips.get(
      this.other_19_36
    );

    return (
      <div className="roulette-board-wrapper hideElementsTest">
        <div className="roulette-board">
          <div className="roulette-board-grid-numbers">
            <table>
              <tbody>
                {this.numbers.map((item, index) => {
                  console.log(this.numbers);
                  var keyId = 0;
                  return (
                    <tr key={"tr_board_" + index}>
                      {item.map((cell, cellIndex) => {
                        var cellClass = this.getClassNamesFromCellItemType(
                          cell.type,
                          cell.value
                        );
                        if (
                          cell.type === ValueType.NUMBER &&
                          cell.value === 0
                        ) {
                          var tdKey = "td_" + cell.type + "_" + cell.value;
                          var chipKey = "chip_" + cell.type + "_" + cell.value;

                          var currentItemChips = this.props.chipsData.placedChips.get(
                            cell
                          );
                          return (
                            <ChipComponent
                              currentItemChips={currentItemChips}
                              tdKey={tdKey}
                              chipKey={chipKey}
                              cell={cell}
                              cellClass={cellClass}
                              rowSpan={5}
                              colSpan={1}
                              onCellClick={this.onCellClick} 
                              leftMin={undefined} 
                              leftMax={undefined} 
                              topMin={undefined} topMax={undefined}                            />
                          );
                        } else {
                          var chipKeyValue = cell.value + "";
                          if (cell.value === undefined) {
                            var split = cell.valueSplit + "";
                            chipKeyValue = "split_" + split;
                          }
                          var tdKey = "td_" + cell.type + "_" + chipKeyValue;
                          var chipKey =
                            "chip_" + cell.type + "_" + chipKeyValue;

                          if (cell.type === ValueType.EMPTY) {
                            keyId++;
                            return (
                              <td
                                key={"empty_" + keyId}
                                className={cellClass}
                              ></td>
                            );
                          } else {
                            var currentItemChips = this.props.chipsData.placedChips.get(
                              cell
                            );

                            return (
                              <ChipComponent
                                currentItemChips={currentItemChips}
                                tdKey={tdKey}
                                chipKey={chipKey}
                                cell={cell}
                                rowSpan={1}
                                colSpan={1}
                                cellClass={cellClass}
                                onCellClick={this.onCellClick} leftMin={undefined} leftMax={undefined} topMin={undefined} topMax={undefined}                              />
                            );
                          }
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="roulette-board-grid-other">
            <table>
              <tbody>
                <tr>
                  <td colSpan={2}></td>


                  <ChipComponent
                    currentItemChips={currentItemChips_1_12}
                    tdKey={"td_other_1_12"}
                    chipKey={"chip_other_1_12"}
                    cell={this.other_1_12}
                    rowSpan={1}
                    colSpan={7}
                    cellClass={this.getClassNamesFromCellItemType(
                      ValueType.NUMBERS_1_12,
                      null
                    )}
                    leftMin={70}
                    leftMax={140}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />


                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_2_12}
                    tdKey={"td_other_2_12"}
                    chipKey={"chip_other_2_12"}
                    cell={this.other_2_12}
                    rowSpan={1}
                    colSpan={7}
                    leftMin={70}
                    leftMax={140}
                    cellClass={this.getClassNamesFromCellItemType(
                      ValueType.NUMBERS_2_12,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_3_12}
                    tdKey={"td_other_3_12"}
                    chipKey={"chip_other_3_12"}
                    cell={this.other_3_12}
                    rowSpan={1}
                    colSpan={7}
                    leftMin={70}
                    leftMax={140}
                    cellClass={this.getClassNamesFromCellItemType(
                      ValueType.NUMBERS_3_12,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_1_18}
                    tdKey={"td_other_1_18"}
                    chipKey={"chip_other_1_18"}
                    cell={this.other_1_18}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      ValueType.NUMBERS_1_18,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_even}
                    tdKey={"td_other_even"}
                    chipKey={"chip_other_even"}
                    cell={this.other_even}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      ValueType.EVEN,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_red}
                    tdKey={"td_other_red"}
                    chipKey={"chip_other_red"}
                    cell={this.other_red}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      ValueType.RED,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_black}
                    tdKey={"td_other_black"}
                    chipKey={"chip_other_black"}
                    cell={this.other_black}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      ValueType.BLACK,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_odd}
                    tdKey={"td_other_odd"}
                    chipKey={"chip_other_odd"}
                    cell={this.other_odd}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      ValueType.ODD,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_19_36}
                    tdKey={"td_other_19_36"}
                    chipKey={"chip_other_19_36"}
                    cell={this.other_19_36}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      ValueType.NUMBERS_19_36,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Board;
