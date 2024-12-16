export type CellTypes = 'code' | 'markdown';

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}
