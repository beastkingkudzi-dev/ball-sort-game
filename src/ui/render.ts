import { colorCss } from '../game/colors';
import type { GameState } from '../game/types';
import { getBestMoves } from '../storage/scores';
import { PRESET_LEVELS } from '../levels/presets';

export interface GameUI {
  root: HTMLElement;
  levelLabel: HTMLElement;
  movesLabel: HTMLElement;
  bestLabel: HTMLElement;
  board: HTMLElement;
  levelSelect: HTMLSelectElement;
  diffSelect: HTMLSelectElement;
  undoBtn: HTMLButtonElement;
  resetBtn: HTMLButtonElement;
  randomBtn: HTMLButtonElement;
  modal: HTMLElement;
  modalTitle: HTMLElement;
  modalBody: HTMLElement;
  modalNext: HTMLButtonElement;
  modalReplay: HTMLButtonElement;
}

export function buildUI(container: HTMLElement): GameUI {
  container.innerHTML = `
    <div class="game">
      <header class="header">
        <h1>Ball Sort Puzzle</h1>
        <p class="subtitle">Sort each color into its own tube</p>
      </header>
      <div class="toolbar">
        <div class="stats">
          <span id="level-label" class="stat"></span>
          <span id="moves-label" class="stat"></span>
          <span id="best-label" class="stat stat-best"></span>
        </div>
        <div class="controls">
          <div class="control-group" data-section="classical">
            <span class="group-label">Classical</span>
            <select id="level-select" aria-label="Classical level"></select>
          </div>
          <div class="control-group" data-section="random">
            <span class="group-label">Random</span>
            <div class="control-row">
              <select id="diff-select" aria-label="Difficulty">
                <option value="easy">Easy</option>
                <option value="medium" selected>Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button type="button" id="btn-random" class="btn btn-primary">New</button>
            </div>
          </div>
          <div class="control-group" data-section="actions">
            <span class="group-label">Actions</span>
            <div class="control-row">
              <button type="button" id="btn-undo" class="btn">Undo</button>
              <button type="button" id="btn-reset" class="btn">Reset</button>
            </div>
          </div>
        </div>
      </div>
      <div id="board" class="board" role="group" aria-label="Game tubes"></div>
      <div id="win-modal" class="modal hidden" role="dialog" aria-modal="true">
        <div class="modal-card">
          <h2 id="modal-title">You Win!</h2>
          <p id="modal-body"></p>
          <div class="modal-actions">
            <button type="button" id="modal-next" class="btn btn-primary">Next Level</button>
            <button type="button" id="modal-replay" class="btn">Play Again</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const levelSelect = container.querySelector<HTMLSelectElement>('#level-select')!;
  for (const level of PRESET_LEVELS) {
    const opt = document.createElement('option');
    opt.value = level.id;
    opt.textContent = level.name;
    levelSelect.appendChild(opt);
  }

  return {
    root: container.querySelector('.game')!,
    levelLabel: container.querySelector('#level-label')!,
    movesLabel: container.querySelector('#moves-label')!,
    bestLabel: container.querySelector('#best-label')!,
    board: container.querySelector('#board')!,
    levelSelect,
    diffSelect: container.querySelector('#diff-select')!,
    undoBtn: container.querySelector('#btn-undo')!,
    resetBtn: container.querySelector('#btn-reset')!,
    randomBtn: container.querySelector('#btn-random')!,
    modal: container.querySelector('#win-modal')!,
    modalTitle: container.querySelector('#modal-title')!,
    modalBody: container.querySelector('#modal-body')!,
    modalNext: container.querySelector('#modal-next')!,
    modalReplay: container.querySelector('#modal-replay')!,
  };
}

export function renderBoard(
  ui: GameUI,
  state: GameState,
  onTubeClick: (index: number) => void,
): void {
  ui.levelLabel.textContent = state.levelName;
  ui.movesLabel.textContent = `Moves: ${state.moves}`;
  const best = getBestMoves(state.levelId);
  ui.bestLabel.textContent =
    best !== null ? `Best: ${best} moves` : 'Best: —';
  ui.undoBtn.disabled = state.undoStack.length === 0;

  ui.board.innerHTML = '';
  state.tubes.forEach((tube, tubeIndex) => {
    const tubeEl = document.createElement('button');
    tubeEl.type = 'button';
    tubeEl.className = 'tube';
    tubeEl.dataset.index = String(tubeIndex);
    if (state.selectedTube === tubeIndex) {
      tubeEl.classList.add('selected');
    }
    tubeEl.setAttribute('aria-label', `Tube ${tubeIndex + 1}`);

    const stack = document.createElement('div');
    stack.className = 'tube-stack';

    const slots: (number | null)[] = Array.from(
      { length: state.capacity },
      (_, i) => tube[i] ?? null,
    );

    for (let slot = state.capacity - 1; slot >= 0; slot--) {
      const ballId = slots[slot];
      const ballEl = document.createElement('div');
      ballEl.className = 'ball-slot';
      if (ballId !== null) {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.backgroundColor = colorCss(ballId);
        ball.dataset.color = String(ballId);
        if (
          state.selectedTube === tubeIndex &&
          slot === tube.length - 1
        ) {
          ball.classList.add('lifted');
        }
        ballEl.appendChild(ball);
      }
      stack.appendChild(ballEl);
    }

    tubeEl.appendChild(stack);
    tubeEl.addEventListener('click', () => onTubeClick(tubeIndex));
    ui.board.appendChild(tubeEl);
  });
}

export function showWinModal(
  ui: GameUI,
  moves: number,
  best: number | null,
  isNewBest: boolean,
  hasNext: boolean,
): void {
  ui.modalTitle.textContent = 'You Win!';
  const bestText =
    best !== null ? `Best for this level: ${best} moves` : '';
  ui.modalBody.textContent = `Completed in ${moves} moves.${isNewBest ? ' New personal best!' : ''} ${bestText}`.trim();
  ui.modalNext.style.display = hasNext ? 'inline-block' : 'none';
  ui.modal.classList.remove('hidden');
}

export function hideWinModal(ui: GameUI): void {
  ui.modal.classList.add('hidden');
}

export function getTubeElement(ui: GameUI, index: number): HTMLElement | null {
  return ui.board.querySelector(`[data-index="${index}"]`);
}
