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
import { pulseBall, shakeTube } from './ui/animations';
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

function loadLevel(level: LevelDef): void {
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

function handleTubeClick(index: number): void {
  const prevSelected = state.selectedTube;
  const result = tryMove(state, index);

  if (!result.moved && prevSelected !== null && state.selectedTube === prevSelected) {
    const tubeEl = getTubeElement(ui, index);
    if (tubeEl) shakeTube(tubeEl);
    return;
  }

  state = result.state;
  refresh();

  if (result.moved) {
    const destTube = getTubeElement(ui, index);
    const balls = destTube?.querySelectorAll('.ball');
    const ballEl = balls?.[balls.length - 1];
    if (ballEl instanceof HTMLElement) pulseBall(ballEl);
  }

  if (result.won) {
    const isNewBest = saveScoreIfBest(state.levelId, state.moves);
    const best = getBestMoves(state.levelId);
    const nextId = getNextPresetId(state.levelId);
    showWinModal(ui, state.moves, best, isNewBest, nextId !== null);
  }
}

function handleUndo(): void {
  state = undo(state);
  refresh();
}

function handleReset(): void {
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
