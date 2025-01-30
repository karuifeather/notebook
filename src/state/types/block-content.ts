/**
 * Structured content for rich block types.
 * Stored as JSON string in Cell.content for types: callout, image, table, tasks, embed.
 */

export type CalloutVariant = 'info' | 'tip' | 'warning' | 'danger';

export interface CalloutContent {
  variant: CalloutVariant;
  emoji?: string;
  title?: string;
  text: string;
}

export interface ImageContent {
  src: string;
  alt?: string;
  caption?: string;
}

export type TableColumnType = 'text' | 'number' | 'date';

export interface TableColumn {
  id: string;
  name: string;
  type?: TableColumnType;
}

export interface TableRow {
  id: string;
  cells: Record<string, string>;
}

export interface TableContent {
  columns: TableColumn[];
  rows: TableRow[];
}

export interface TaskItem {
  id: string;
  text: string;
  checked: boolean;
  due?: string;
  tag?: string;
}

export interface TasksContent {
  items: TaskItem[];
}

export interface EmbedContent {
  url: string;
  title?: string;
  description?: string;
  siteName?: string;
  image?: string;
  favicon?: string;
}

export type BlockContent =
  | CalloutContent
  | ImageContent
  | TableContent
  | TasksContent
  | EmbedContent;
