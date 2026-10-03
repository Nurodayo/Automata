export type CurveType = {
  id: string;
  name: string;
  start: string;
  end: string;
  symbol: string[];
};

export type StateType = {
  id: string;
  name: string;
  x: number;
  y: number;
  isSelected: boolean;
  isFinal: boolean;
};
