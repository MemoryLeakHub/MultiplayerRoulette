export enum ValueType {
  NUMBER,
  NUMBERS_1_12,
  NUMBERS_2_12,
  NUMBERS_3_12,
  NUMBERS_1_18,
  NUMBERS_19_36,
  EVEN,
  ODD,
  RED,
  BLACK,
  DOUBLE_SPLIT,
  QUAD_SPLIT,
  TRIPLE_SPLIT,
  EMPTY
}
export interface Item {
  type: ValueType;
  value: number;
  valueSplit: number[];
}
export interface PlacedChip {
  item: Item;
  sum: number;
}
export type rouletteData = {
  numbers: number[];
};
export type RouletteWrapperState = {
  rouletteData: rouletteData;
  number: WheelNumber;
  chipsData: ChipsData;
};
export type ChipsData = {
  selectedChip: any;
  placedChips: any;
};

export type WheelNumber = {
  next: any;
};

export enum GameStages {
  PLACE_BET,
  ROUND_START,
  WINNERS
}
export type GameData = {
  stage: GameStages,
  time_remaining: number;
  value: number;
  wins: Map<string, number>
}