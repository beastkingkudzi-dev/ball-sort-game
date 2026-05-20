import './styles/game.css';
import { generateLevel } from './game/generator';
import { createGameState, resetState, tryMove, undo } from './game/state';
import type { Difficulty, GameState, LevelDef } from './game/types';
import {
  getNextPresetId,
  getPresetById,
  PRESET_LEVELS,
} from './levels/presets';
import { getBestMoves, saveScoreIfBest } from './storage/scores';
import { animateBallMove, shakeTube } from './ui/animations';
import {
  buildUI,
  hideWinModal,
  renderBoard,
  showWinModal,
  getTubeElement,
  type GameUI,
} from './ui/render';
import { cloneTubes } from './game/rules';

let state: GameState;
let initialTubes: ReturnType<typeof cloneTubes>;
let ui: GameUI;
let pendingWinTimer: number | null = null;

function cancelPendingWin(): void {
  if (pendingWinTimer !== null) {
    window.clearTimeout(pendingWinTimer);
    pendingWinTimer = null;
  }
}

function loadLevel(level: LevelDef): void {
  cancelPendingWin();
  state = createGameState(level);
  initialTubes = cloneTubes(level.tubes);
  hideWinModal(ui);
  if (!level.id.startsWith('random-')) {
    ui.levelSelect.value = level.id;
  }
  refresh();
}

function refresh(): void {
  renderBoard(ui, state, handleTubeClick);
}

function getTopBall(tubeIndex: number): HTMLElement | null {
  const tubeEl = getTubeElement(ui, tubeIndex);
  if (!tubeEl) return null;
  const balls = tubeEl.querySelectorAll<HTMLElement>('.ball');
  return balls[balls.length - 1] ?? null;
}

function handleTubeClick(index: number): void {
  const prevSelected = state.selectedTube;

  let sourceRect: DOMRect | null = null;
  if (prevSelected !== null && prevSelected !== index) {
    const sourceBall = getTopBall(prevSelected);
    if (sourceBall) sourceRect = sourceBall.getBoundingClientRect();
  }

  const result = tryMove(state, index);
  const triedDifferentTube =
    prevSelected !== null && prevSelected !== index;
  const wasInvalidMove = triedDifferentTube && !result.moved;

  state = result.state;
  refresh();

  if (wasInvalidMove) {
    const tubeEl = getTubeElement(ui, index);
    if (tubeEl) shakeTube(tubeEl);
    return;
  }

  if (result.moved && sourceRect) {
    const destBall = getTopBall(index);
    if (destBall) animateBallMove(sourceRect, destBall);
  }

  if (result.won) {
    const wonLevelId = state.levelId;
    const wonMoves = state.moves;
    const isNewBest = saveScoreIfBest(wonLevelId, wonMoves);
    const best = getBestMoves(wonLevelId);
    const nextId = getNextPresetId(wonLevelId);
    cancelPendingWin();
    pendingWinTimer = window.setTimeout(() => {
      pendingWinTimer = null;
      if (state.levelId !== wonLevelId) return;
      showWinModal(ui, wonMoves, best, isNewBest, nextId !== null);
    }, 420);
  }
}

function handleUndo(): void {
  state = undo(state);
  refresh();
}

function handleReset(): void {
  cancelPendingWin();
  state = resetState(state, initialTubes);
  hideWinModal(ui);
  refresh();
}

function handleLevelChange(): void {
  const id = ui.levelSelect.value;
  const preset = getPresetById(id);
  if (preset) loadLevel(preset);
}

function handleRandom(): void {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const difficulty =
    difficulties[Math.floor(Math.random() * difficulties.length)];
  const colors = 3 + Math.floor(Math.random() * 3);
  const emptyTubes = Math.random() > 0.5 ? 2 : 1;
  const level = generateLevel({ colors, emptyTubes, difficulty });
  loadLevel(level);
}

function handleModalNext(): void {
  const nextId = getNextPresetId(state.levelId);
  if (nextId) {
    const preset = getPresetById(nextId);
    if (preset) loadLevel(preset);
  }
  hideWinModal(ui);
}

function handleModalReplay(): void {
  handleReset();
}

function init(): void {
  const app = document.querySelector<HTMLElement>('#app')!;
  ui = buildUI(app);

  ui.undoBtn.addEventListener('click', handleUndo);
  ui.resetBtn.addEventListener('click', handleReset);
  ui.randomBtn.addEventListener('click', handleRandom);
  ui.levelSelect.addEventListener('change', handleLevelChange);
  ui.modalNext.addEventListener('click', handleModalNext);
  ui.modalReplay.addEventListener('click', handleModalReplay);
  ui.modal.addEventListener('click', (e) => {
    if (e.target === ui.modal) hideWinModal(ui);
  });

  loadLevel(PRESET_LEVELS[0]);
}

init();
