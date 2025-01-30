export type CellTypes =
  | 'code'
  | 'markdown'
  | 'text'
  | 'todo'
  | 'callout'
  | 'image'
  | 'table'
  | 'tasks'
  | 'embed';

export interface Cell {
  id: string;
  type: CellTypes;
  /** For code/markdown: raw string. For callout/image/table/tasks/embed: JSON string of block content. */
  content: string;
}
