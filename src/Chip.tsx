import React from "react";

var classNames = require("classnames");

let Chip = function (props: { currentItemChips: any; currentItem: any; leftMin: number | undefined; leftMax: number | undefined; topMin: number | undefined; topMax: number | undefined; }) : JSX.Element  {
  var currentItemChips = props.currentItemChips;
  var currentItem = props.currentItem;
  function randomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  //console.log(chipsData);
  function getChipClasses(chip: number) {
    var cellClass = classNames({
      "chip-100-placed": chip === 100,
      "chip-20-placed": chip === 20,
      "chip-10-placed": chip === 10,
      "chip-5-placed": chip === 5,
      chipValueImage: true
    });

    return cellClass;
  }


  if (currentItemChips !== undefined) {
    var total = 0;
    var chipData = currentItemChips;
    const chipsImgs = [];
    var currentChipPlaced = 0;
    while (total < chipData.sum) {
      var currentChip = 100;
      var totalSum = chipData.sum - total
      if (totalSum >= 100) {
        currentChip = 100;
        var calc = totalSum - (totalSum % currentChip);
        total += calc;
        currentChipPlaced = calc / currentChip;
      } else if (totalSum >= 20) {
        currentChip = 20;
        var calc = totalSum - (totalSum % currentChip);
        total += calc;
        currentChipPlaced = calc / currentChip;
      } else if (totalSum >= 10) {
        currentChip = 10;
        var calc = totalSum - (totalSum % currentChip);
        total += calc;
        currentChipPlaced = calc / currentChip;
      } else {
        currentChip = 5;
        var calc = totalSum - (totalSum % currentChip);
        total += calc;
        currentChipPlaced = calc / currentChip;
      }
      var leftMin = -10;
      if (props.leftMin !== undefined) {
        leftMin = props.leftMin;
      }
      var leftMax = 10;
      if (props.leftMax !== undefined) {
        leftMax = props.leftMax;
      }
      var topMin = -30;
      if (props.topMin !== undefined) {
        topMin = props.topMin;
      }
      var topMax = 0;
      if (props.topMax !== undefined) {
        topMax = props.topMax;
      }

      for (let i = 0; i < currentChipPlaced; i++) {
        var key =
          currentItem.type +
          "_" +
          currentItem.value +
          "_" +
          currentChip +
          "_" +
          i;
        //console.log(key);
        let style = {
          top: "0px",
          left: "0px"
        };
        style.left = randomNumber(leftMin, leftMax)+"px";
        style.top = randomNumber(topMin, topMax)+"px";
        chipsImgs.push(
          <div
            key={key}
            style={style}
            className={getChipClasses(currentChip)}
          ></div>
        );
      }
    }
    return <div className={"chipValue"}>{chipsImgs}</div>;
  } else {
    return <></>;
  }
};

export default Chip;
