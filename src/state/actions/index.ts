import { ActionType } from '../action-types/index.ts';
import { CellTypes } from '../types/cell.ts';

export type Direction = 'up' | 'down';

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: Direction;
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}

export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: string | null;
    type: CellTypes;
    content?: string;
  };
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  };
}

export interface UpdateCellOrder {
  type: ActionType.UPDATE_CELL_ORDER;
  payload: string[];
}

export interface BundleCreatedAction {
  type: ActionType.BUNDLE_CREATED;
  payload: {
    cellId: string;
    bundle: {
      code: string;
      error: string;
    };
  };
}

export interface BundleCreatingAction {
  type: ActionType.BUNDLE_CREATING;
  payload: {
    cellId: string;
  };
}

export interface BundleItAction {
  type: ActionType.BUNDLE_IT;
  payload: {
    cellId: string;
    rawCode: string;
  };
}

export type Action =
  | MoveCellAction
  | DeleteCellAction
  | UpdateCellAction
  | UpdateCellOrder
  | InsertCellAfterAction
  | BundleItAction
  | BundleCreatingAction
  | BundleCreatedAction;
