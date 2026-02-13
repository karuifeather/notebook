import React, { useCallback, useState, useRef } from 'react';
import { Cell } from '@/state/index.ts';
import { useActions } from '@/hooks/use-actions.ts';
import {
  parseBlockContent,
  defaultTasksContent,
} from '@/utils/block-content.ts';
import type { TasksContent, TaskItem } from '@/state/types/block-content.ts';
import { randomId } from '@/utils/randomId.ts';
import './styles/tasks-block.scss';

interface TasksBlockProps {
  cell: Cell;
  noteId: string;
}

const TasksBlock: React.FC<TasksBlockProps> = ({ cell, noteId }) => {
  const { updateCell } = useActions();
  const data = parseBlockContent<TasksContent>(
    cell.content,
    defaultTasksContent()
  );
  const [newTaskText, setNewTaskText] = useState('');
  const newTaskRef = useRef<HTMLInputElement>(null);

  const persist = useCallback(
    (next: TasksContent) => {
      updateCell(noteId, cell.id, JSON.stringify(next));
    },
    [noteId, cell.id, updateCell]
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<TaskItem>) => {
      persist({
        ...data,
        items: data.items.map((it) =>
          it.id === id ? { ...it, ...patch } : it
        ),
      });
    },
    [data, persist]
  );

  const addItem = useCallback(
    (text?: string) => {
      const id = randomId();
      const value = (text ?? newTaskText).trim();
      persist({
        ...data,
        items: [...data.items, { id, text: value, checked: false }],
      });
      setNewTaskText('');
      setTimeout(() => {
        const el = document.querySelector(
          `[data-task-id="${id}"]`
        ) as HTMLInputElement | null;
        el?.focus();
      }, 0);
    },
    [data, persist, newTaskText]
  );

  const removeItem = useCallback(
    (id: string) => {
      const next = data.items.filter((it) => it.id !== id);
      if (next.length === 0) {
        next.push({ id: randomId(), text: '', checked: false });
      }
      persist({ ...data, items: next });
    },
    [data, persist]
  );

  const handleItemKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    item: TaskItem,
    index: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (item.text.trim() === '') return;
      const id = randomId();
      persist({
        ...data,
        items: [
          ...data.items.slice(0, index + 1),
          { id, text: '', checked: false },
          ...data.items.slice(index + 1),
        ],
      });
      setTimeout(() => {
        const el = document.querySelector(
          `[data-task-id="${id}"]`
        ) as HTMLInputElement | null;
        el?.focus();
      }, 0);
    }
    if (e.key === 'Backspace' && item.text === '') {
      e.preventDefault();
      removeItem(item.id);
    }
  };

  const handleToggle = (item: TaskItem) => {
    updateItem(item.id, { checked: !item.checked });
  };

  const handleToggleKeyDown = (e: React.KeyboardEvent, item: TaskItem) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle(item);
    }
  };

  const checkedCount = data.items.filter((i) => i.checked).length;
  const totalCount = data.items.length;

  return (
    <div className="tasks-block" data-block="tasks">
      {(totalCount > 0 || checkedCount > 0) && (
        <div className="tasks-block__progress" aria-live="polite">
          {checkedCount}/{totalCount}
        </div>
      )}
      <ul className="tasks-block__list" role="list">
        {data.items.map((item, index) => (
          <li key={item.id} className="tasks-block__item">
            <span className="tasks-block__checkbox-wrap">
              <input
                type="checkbox"
                id={`task-${cell.id}-${item.id}`}
                className="tasks-block__checkbox"
                checked={item.checked}
                onChange={() => handleToggle(item)}
                onKeyDown={(e) => handleToggleKeyDown(e, item)}
                aria-label={item.text || 'Toggle task'}
              />
            </span>
            <input
              type="text"
              data-task-id={item.id}
              className={`tasks-block__input ${item.checked ? 'tasks-block__input--done' : ''}`}
              value={item.text}
              onChange={(e) => updateItem(item.id, { text: e.target.value })}
              onKeyDown={(e) => handleItemKeyDown(e, item, index)}
              placeholder="New task…"
              aria-label="Task text"
            />
          </li>
        ))}
      </ul>
      <div className="tasks-block__new">
        <input
          ref={newTaskRef}
          type="text"
          className="tasks-block__new-input"
          placeholder="New task…"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
          aria-label="Add new task"
        />
      </div>
    </div>
  );
};

export default TasksBlock;
