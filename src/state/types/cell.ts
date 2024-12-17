export type CellTypes = 'code' | 'markdown' | 'text' | 'todo';

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}
