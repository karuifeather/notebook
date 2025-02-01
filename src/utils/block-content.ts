import type {
  CalloutContent,
  CalloutVariant,
  ImageContent,
  TableContent,
  TasksContent,
  EmbedContent,
} from '@/state/types/block-content.ts';
import { randomId } from '@/utils/randomId.ts';

export function parseBlockContent<T>(content: string, defaultValue: T): T {
  if (!content || typeof content !== 'string') return defaultValue;
  try {
    const parsed = JSON.parse(content) as T;
    return parsed ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

export function defaultCalloutContent(
  variant: CalloutVariant = 'info'
): CalloutContent {
  return {
    variant,
    emoji:
      variant === 'info'
        ? 'ℹ️'
        : variant === 'tip'
          ? '💡'
          : variant === 'warning'
            ? '⚠️'
            : '🔴',
    title: '',
    text: '',
  };
}

export function defaultImageContent(): ImageContent {
  return { src: '', alt: '', caption: '' };
}

export function defaultTableContent(): TableContent {
  const col1 = randomId();
  const col2 = randomId();
  return {
    columns: [
      { id: col1, name: 'Column 1', type: 'text' },
      { id: col2, name: 'Column 2', type: 'text' },
    ],
    rows: [
      { id: randomId(), cells: { [col1]: '', [col2]: '' } },
      { id: randomId(), cells: { [col1]: '', [col2]: '' } },
    ],
  };
}

export function defaultTasksContent(): TasksContent {
  return { items: [] };
}

export function defaultEmbedContent(url?: string): EmbedContent {
  return {
    url: url || '',
    title: '',
    description: '',
    siteName: '',
    image: '',
    favicon: '',
  };
}
