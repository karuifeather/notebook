import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Cell } from '@/state/index.ts';
import { useActions } from '@/hooks/use-actions.ts';
import {
  parseBlockContent,
  defaultTableContent,
} from '@/utils/block-content.ts';
import type {
  TableContent,
  TableColumn,
  TableRow,
} from '@/state/types/block-content.ts';
import { randomId } from '@/utils/randomId.ts';
import './styles/table-block.scss';

interface TableBlockProps {
  cell: Cell;
  noteId: string;
}

const TableBlock: React.FC<TableBlockProps> = ({ cell, noteId }) => {
  const { updateCell } = useActions();
  const data = parseBlockContent<TableContent>(
    cell.content,
    defaultTableContent()
  );
  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    colId: string;
  } | null>(null);
  const [focusedCell, setFocusedCell] = useState<{
    rowId: string;
    colId: string;
  } | null>(null);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [headerValue, setHeaderValue] = useState('');
  const [colMenuOpen, setColMenuOpen] = useState<string | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);
  const editingInputRef = useRef<HTMLInputElement>(null);

  const persist = useCallback(
    (next: TableContent) => {
      updateCell(noteId, cell.id, JSON.stringify(next));
    },
    [noteId, cell.id, updateCell]
  );

  const addRow = useCallback((): string => {
    const id = randomId();
    const newRow: TableRow = {
      id,
      cells: Object.fromEntries(data.columns.map((c) => [c.id, ''])),
    };
    persist({ ...data, rows: [...data.rows, newRow] });
    return id;
  }, [data, persist]);

  const addColumn = useCallback(() => {
    const id = randomId();
    const newCol: TableColumn = {
      id,
      name: `Column ${data.columns.length + 1}`,
      type: 'text',
    };
    const rows = data.rows.map((r) => ({
      ...r,
      cells: { ...r.cells, [id]: '' },
    }));
    persist({ ...data, columns: [...data.columns, newCol], rows });
    setColMenuOpen(null);
  }, [data, persist]);

  const deleteRow = useCallback(
    (rowId: string) => {
      persist({
        ...data,
        rows: data.rows.filter((r) => r.id !== rowId),
      });
      setEditingCell(null);
      setFocusedCell(null);
    },
    [data, persist]
  );

  const deleteColumn = useCallback(
    (colId: string) => {
      const columns = data.columns.filter((c) => c.id !== colId);
      const rows = data.rows.map((r) => {
        const cells = { ...r.cells };
        delete cells[colId];
        return { ...r, cells };
      });
      persist({ ...data, columns, rows });
      setEditingCell(null);
      setFocusedCell(null);
      setColMenuOpen(null);
    },
    [data, persist]
  );

  const renameColumn = useCallback(
    (colId: string, name: string) => {
      persist({
        ...data,
        columns: data.columns.map((c) => (c.id === colId ? { ...c, name } : c)),
      });
    },
    [data, persist]
  );

  const setCellValue = useCallback(
    (rowId: string, colId: string, value: string) => {
      const rows = data.rows.map((r) =>
        r.id === rowId ? { ...r, cells: { ...r.cells, [colId]: value } } : r
      );
      persist({ ...data, rows });
    },
    [data, persist]
  );

  const startRenameHeader = (col: TableColumn) => {
    setEditingHeader(col.id);
    setHeaderValue(col.name);
    setColMenuOpen(null);
  };

  const commitRenameHeader = () => {
    if (editingHeader) {
      renameColumn(editingHeader, headerValue.trim() || 'Column');
      setEditingHeader(null);
    }
  };

  // Focus input when entering edit mode
  useEffect(() => {
    if (editingCell) {
      editingInputRef.current?.focus();
    }
  }, [editingCell]);

  // Close column menu on outside click
  useEffect(() => {
    if (!colMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const el = e.target as Node;
      if (tableRef.current?.contains(el)) return;
      setColMenuOpen(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [colMenuOpen]);

  const handleCellKeyDown = (
    e: React.KeyboardEvent,
    rowIndex: number,
    colIndex: number
  ) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const col = data.columns[colIndex];
      if (rowIndex < data.rows.length - 1) {
        const nextRow = data.rows[rowIndex + 1];
        setEditingCell({ rowId: nextRow.id, colId: col.id });
      } else {
        const newRowId = addRow();
        setTimeout(() => setEditingCell({ rowId: newRowId, colId: col.id }), 0);
      }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const nextColIndex = e.shiftKey ? colIndex - 1 : colIndex + 1;
      if (nextColIndex >= 0 && nextColIndex < data.columns.length) {
        const row = data.rows[rowIndex];
        const col = data.columns[nextColIndex];
        setEditingCell({ rowId: row.id, colId: col.id });
      }
    }
  };

  const handleTableKeyDown = (e: React.KeyboardEvent) => {
    if (editingCell) {
      if (e.key === 'Escape') {
        setEditingCell(null);
        setFocusedCell(null);
        e.preventDefault();
      }
      return;
    }

    const rowIndex = data.rows.findIndex((r) => r.id === focusedCell?.rowId);
    const colIndex = data.columns.findIndex((c) => c.id === focusedCell?.colId);
    if (rowIndex < 0 || colIndex < 0) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      setEditingCell(focusedCell!);
      return;
    }

    if (
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown'
    ) {
      e.preventDefault();
      let nextRow = rowIndex;
      let nextCol = colIndex;
      if (e.key === 'ArrowLeft') nextCol = colIndex - 1;
      else if (e.key === 'ArrowRight') nextCol = colIndex + 1;
      else if (e.key === 'ArrowUp') nextRow = rowIndex - 1;
      else if (e.key === 'ArrowDown') nextRow = rowIndex + 1;

      if (
        nextRow >= 0 &&
        nextRow < data.rows.length &&
        nextCol >= 0 &&
        nextCol < data.columns.length
      ) {
        setFocusedCell({
          rowId: data.rows[nextRow].id,
          colId: data.columns[nextCol].id,
        });
      }
    }
  };

  const handlePaste = useCallback(
    (e: React.ClipboardEvent, startRowId: string, startColId: string) => {
      const text = e.clipboardData.getData('text');
      if (!text) return;
      const lines = text.split(/\r?\n/).filter(Boolean);
      const colIndex = data.columns.findIndex((c) => c.id === startColId);
      const rowIndex = data.rows.findIndex((r) => r.id === startRowId);
      if (colIndex < 0 || rowIndex < 0) return;
      e.preventDefault();
      const newRows = data.rows.slice(0, rowIndex);
      const cols = data.columns.map((c) => c.id);
      lines.forEach((line) => {
        const cells = line.split(/\t|,/).map((s) => s.trim());
        const row: TableRow = {
          id: randomId(),
          cells: Object.fromEntries(
            cols.map((cid, ci) => [cid, cells[ci] ?? ''])
          ),
        };
        newRows.push(row);
      });
      const restRows = data.rows.slice(rowIndex + lines.length);
      persist({ ...data, rows: [...newRows, ...restRows] });
    },
    [data, persist]
  );

  return (
    <div
      className="table-block"
      data-block="table"
      ref={tableRef}
      tabIndex={0}
      onKeyDown={handleTableKeyDown}
    >
      <div className="table-block__scroll">
        <table className="table-block__table">
          <thead className="table-block__thead">
            <tr className="table-block__tr">
              {data.columns.map((col) => (
                <th key={col.id} className="table-block__th">
                  <div className="table-block__th__inner">
                    <div className="table-block__th__label">
                      {editingHeader === col.id ? (
                        <input
                          type="text"
                          className="table-block__input table-block__input--header"
                          value={headerValue}
                          onChange={(e) => setHeaderValue(e.target.value)}
                          onBlur={commitRenameHeader}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitRenameHeader();
                            if (e.key === 'Escape') setEditingHeader(null);
                          }}
                          autoFocus
                          aria-label="Rename column"
                        />
                      ) : (
                        <button
                          type="button"
                          className="table-block__header-btn"
                          onClick={() => startRenameHeader(col)}
                          aria-label={`Rename column ${col.name}`}
                        >
                          {col.name}
                        </button>
                      )}
                    </div>
                    <div className="table-block__col-actions table-block__col-menu-wrap">
                      <button
                        type="button"
                        className="table-block__icon-btn table-block__icon-btn--ghost"
                        onClick={() =>
                          setColMenuOpen((v) => (v === col.id ? null : col.id))
                        }
                        aria-label={`Column ${col.name} actions`}
                        aria-expanded={colMenuOpen === col.id}
                      >
                        <i className="fas fa-ellipsis-v" aria-hidden />
                      </button>
                      {colMenuOpen === col.id && (
                        <div className="table-block__col-menu" role="menu">
                          <button
                            type="button"
                            role="menuitem"
                            className="table-block__col-menu-item"
                            onClick={() => startRenameHeader(col)}
                          >
                            Rename
                          </button>
                          {data.columns.length > 1 && (
                            <button
                              type="button"
                              role="menuitem"
                              className="table-block__col-menu-item table-block__col-menu-item--danger"
                              onClick={() => deleteColumn(col.id)}
                            >
                              <i className="fas fa-trash-alt" aria-hidden />
                              Delete column
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </th>
              ))}
              <th className="table-block__th table-block__th--actions table-block__add-col-cell">
                <button
                  type="button"
                  className="table-block__add-col-btn"
                  onClick={addColumn}
                  aria-label="Add column"
                >
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="table-block__tbody">
            {data.rows.map((row, rowIndex) => (
              <tr key={row.id} className="table-block__tr">
                {data.columns.map((col, colIndex) => {
                  const isEditing =
                    editingCell?.rowId === row.id &&
                    editingCell?.colId === col.id;
                  const isFocused =
                    !isEditing &&
                    focusedCell?.rowId === row.id &&
                    focusedCell?.colId === col.id;
                  const cellValue = row.cells[col.id] ?? '';
                  return (
                    <td
                      key={col.id}
                      className={`table-block__td ${isFocused ? 'table-block__td--focused' : ''} ${isEditing ? 'table-block__td--editing' : ''}`}
                    >
                      {isEditing ? (
                        <input
                          ref={
                            editingCell?.rowId === row.id &&
                            editingCell?.colId === col.id
                              ? editingInputRef
                              : undefined
                          }
                          type="text"
                          className="table-block__input table-block__input--multiline"
                          value={cellValue}
                          onChange={(e) =>
                            setCellValue(row.id, col.id, e.target.value)
                          }
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={(e) =>
                            handleCellKeyDown(e, rowIndex, colIndex)
                          }
                          onPaste={(e) => handlePaste(e, row.id, col.id)}
                          aria-label={`Cell ${col.name}`}
                          placeholder=" "
                        />
                      ) : (
                        <div className="table-block__cell-wrap">
                          <button
                            type="button"
                            className="table-block__cell-btn"
                            onClick={() => {
                              setFocusedCell({ rowId: row.id, colId: col.id });
                              tableRef.current?.focus();
                            }}
                            onDoubleClick={() =>
                              setEditingCell({ rowId: row.id, colId: col.id })
                            }
                            aria-label={`Edit cell ${col.name}`}
                          >
                            {cellValue ? (
                              cellValue
                            ) : (
                              <span className="table-block__cell-placeholder">
                                {' '}
                              </span>
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="table-block__td table-block__td--actions">
                  <div className="table-block__row-actions">
                    <button
                      type="button"
                      className="table-block__icon-btn"
                      onClick={() => deleteRow(row.id)}
                      aria-label="Delete row"
                    >
                      <i className="fas fa-trash-alt" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="table-block__tr table-block__add-row">
              <td colSpan={data.columns.length + 1}>
                <button
                  type="button"
                  className="table-block__add-row-btn"
                  onClick={addRow}
                  aria-label="Add row"
                >
                  + New row
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="table-block__toolbar">
        <button
          type="button"
          className="table-block__toolbar-btn"
          onClick={addRow}
          aria-label="Add row"
        >
          + Row
        </button>
        <button
          type="button"
          className="table-block__toolbar-btn"
          onClick={addColumn}
          aria-label="Add column"
        >
          + Column
        </button>
      </div>
    </div>
  );
};

export default TableBlock;
