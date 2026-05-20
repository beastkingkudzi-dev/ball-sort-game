import type { GameState, LevelDef, Snapshot, Tube } from './types';
import { applyMove, canMove, cloneTubes, isWin } from './rules';

export function createGameState(level: LevelDef): GameState {
  return {
    tubes: cloneTubes(level.tubes),
    capacity: level.capacity,
    moves: 0,
    selectedTube: null,
    levelId: level.id,
    levelName: level.name,
    undoStack: [],
  };
}

export function resetState(state: GameState, tubes: Tube[]): GameState {
  return {
    ...state,
    tubes: cloneTubes(tubes),
    moves: 0,
    selectedTube: null,
    undoStack: [],
  };
}

export function selectTube(state: GameState, index: number): GameState {
  if (state.tubes[index].length === 0) {
    return { ...state, selectedTube: null };
  }
  if (state.selectedTube === index) {
    return { ...state, selectedTube: null };
  }
  return { ...state, selectedTube: index };
}

export interface MoveResult {
  state: GameState;
  moved: boolean;
  won: boolean;
}

export function tryMove(state: GameState, toIndex: number): MoveResult {
  const from = state.selectedTube;
  if (from === null) {
    return { state: selectTube(state, toIndex), moved: false, won: false };
  }

  if (from === toIndex) {
    return { state: { ...state, selectedTube: null }, moved: false, won: false };
  }

  if (!canMove(state.tubes, from, toIndex, state.capacity)) {
    return { state, moved: false, won: false };
  }

  const snapshot: Snapshot = {
    tubes: cloneTubes(state.tubes),
    moves: state.moves,
  };

  const tubes = applyMove(state.tubes, from, toIndex);
  const moves = state.moves + 1;
  const next: GameState = {
    ...state,
    tubes,
    moves,
    selectedTube: null,
    undoStack: [...state.undoStack, snapshot],
  };

  return { state: next, moved: true, won: isWin(tubes, state.capacity) };
}

export function undo(state: GameState): GameState {
  if (state.undoStack.length === 0) return state;
  const prev = state.undoStack[state.undoStack.length - 1];
  return {
    ...state,
    tubes: cloneTubes(prev.tubes),
    moves: prev.moves,
    selectedTube: null,
    undoStack: state.undoStack.slice(0, -1),
  };
}
