

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
  winners: Winner[],
  username: string;
  endTime: number;
  progressCountdown: number;
  time_remaining: number;
  stage: GameStages;
  history: number[]
};
export type Winner = {
  username: string;
  sum: number;
}
export type ChipsData = {
  selectedChip: any;
  placedChips: any;
};

export type WheelNumber = {
  next: any;
};

export enum GameStages {
  PLACE_BET,
  NO_MORE_BETS,
  WINNERS,
  NONE
}
export type GameData = {
  stage: GameStages,
  time_remaining: number;
  value: number;
  wins: Winner[],
  history: number[]
}
