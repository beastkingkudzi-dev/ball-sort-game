const CONFETTI_PALETTE = [
  '#ffffff',
  '#c8e0ff',
  '#a4c2ee',
  '#7fa5dc',
  '#dbe9ff',
  '#b5d1ee',
  '#5a86c3',
  '#e8f1fa',
];

export function shakeTube(element: HTMLElement): void {
  element.classList.remove('shake');
  void element.offsetWidth;
  element.classList.add('shake');
  element.addEventListener(
    'animationend',
    () => element.classList.remove('shake'),
    { once: true },
  );
}

function settleBall(ball: HTMLElement): void {
  ball.animate(
    [
      { transform: 'scale(1.16, 0.82)' },
      { transform: 'scale(0.88, 1.12)', offset: 0.32 },
      { transform: 'scale(1.07, 0.95)', offset: 0.55 },
      { transform: 'scale(0.97, 1.03)', offset: 0.78 },
      { transform: 'scale(1, 1)' },
    ],
    {
      duration: 420,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  );
}

/**
 * Animate a ball moving between two tubes by cloning the source ball into a
 * `position: fixed` overlay and animating the clone. The actual destination
 * ball is hidden until the clone arrives. This avoids any one-frame flash
 * at the destination's natural drop position and guarantees that no other
 * balls in the DOM move during the animation.
 */
export function animateBallMove(
  fromRect: DOMRect,
  destBall: HTMLElement,
  tubeTopY: number,
): void {
  const toRect = destBall.getBoundingClientRect();
  const dx = toRect.left - fromRect.left;
  const dy = toRect.top - fromRect.top;

  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
    settleBall(destBall);
    return;
  }

  // Apex must clear the highest tube rim.
  const clearance = 60;
  const naturalMidAbsY = (toRect.top + fromRect.top) / 2;
  let arcHeight = naturalMidAbsY - (tubeTopY - clearance);
  arcHeight = Math.max(arcHeight + 35, 110);

  destBall.style.opacity = '0';

  const clone = destBall.cloneNode(true) as HTMLElement;
  clone.classList.remove('lifted');
  clone.style.opacity = '1';
  clone.style.position = 'fixed';
  clone.style.left = `${fromRect.left}px`;
  clone.style.top = `${fromRect.top}px`;
  clone.style.width = `${fromRect.width}px`;
  clone.style.height = `${fromRect.height}px`;
  clone.style.margin = '0';
  clone.style.pointerEvents = 'none';
  clone.style.zIndex = '210';
  clone.style.transformOrigin = 'center';
  clone.style.transform = 'scale(1.04)';
  clone.style.filter = 'drop-shadow(0 14px 18px rgba(0, 0, 0, 0.65))';
  document.body.appendChild(clone);

  // Parametric parabolic trajectory in screen-pixel space.
  //   x(t) = dx*t
  //   y(t) = dy*t - arcHeight*sin(πt)
  const steps = 18;
  const keyframes: Keyframe[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = dx * t;
    const y = dy * t - arcHeight * Math.sin(Math.PI * t);
    const scale = 1 + 0.08 * Math.sin(Math.PI * t);
    keyframes.push({
      transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(3)})`,
      offset: t,
    });
  }

  const duration = Math.max(540, Math.min(880, 420 + arcHeight * 1.1));

  const travel = clone.animate(keyframes, {
    duration,
    easing: 'cubic-bezier(0.36, 0.04, 0.42, 1)',
    fill: 'forwards',
  });

  travel.onfinish = () => {
    destBall.style.opacity = '';
    clone.remove();
    settleBall(destBall);
  };
}

export function spawnConfetti(count = 100): void {
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  document.body.appendChild(layer);

  const w = window.innerWidth;
  const h = window.innerHeight;
  const cx = w / 2;
  const cy = h * 0.3;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = CONFETTI_PALETTE[i % CONFETTI_PALETTE.length];
    piece.style.backgroundColor = color;
    piece.style.left = `${cx}px`;
    piece.style.top = `${cy}px`;

    if (Math.random() > 0.55) piece.classList.add('confetti-round');

    const angle = Math.random() * Math.PI * 2;
    const speed = 220 + Math.random() * 340;
    const kx = Math.cos(angle) * speed;
    const kyKick = Math.sin(angle) * speed - 160;
    const fyFall = h * 0.7 + Math.random() * 260;
    const rotZ = (Math.random() - 0.5) * 1080;
    const rotY = (Math.random() - 0.5) * 720;
    const startScale = 0.5 + Math.random() * 0.7;
    const duration = 1700 + Math.random() * 1200;

    const anim = piece.animate(
      [
        {
          transform: `translate(0, 0) rotate3d(1, 0.5, 0, 0deg) rotate(0deg) scale(${startScale})`,
          opacity: 1,
        },
        {
          transform: `translate(${kx * 0.55}px, ${kyKick}px) rotate3d(1, 0.5, 0, ${rotY * 0.4}deg) rotate(${rotZ * 0.45}deg) scale(${startScale})`,
          opacity: 1,
          offset: 0.4,
        },
        {
          transform: `translate(${kx}px, ${fyFall}px) rotate3d(1, 0.5, 0, ${rotY}deg) rotate(${rotZ}deg) scale(${startScale * 0.9})`,
          opacity: 0,
        },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.22, 0.6, 0.4, 1)',
        fill: 'forwards',
      },
    );
    anim.onfinish = () => piece.remove();
    layer.appendChild(piece);
  }

  window.setTimeout(() => layer.remove(), 3800);
}

// ----- Minecraft-style background grid ---------------------------------

const MAT_MAP: Record<string, string> = {
  a: 'air',
  g: 'grass',
  d: 'dirt',
  s: 'stone',
  w: 'wood',
  l: 'leaves',
  '~': 'water',
  n: 'sand',
  D: 'diamond',
  G: 'gold',
  R: 'redstone',
  o: 'obsidian',
  c: 'cobble',
  L: 'lava',
};

function parseScene(text: string): string[] {
  const rows = text
    .split('\n')
    .map((r) => r.trim())
    .filter((r) => r.length > 0);
  const maxW = Math.max(...rows.map((r) => r.length));
  return rows.map((r) => r.padEnd(maxW, 'a'));
}

// Each scene is exactly 14 wide × 8 tall.
const SCENES: string[][] = [
  // 1) Day landscape: tree on grass, mountain rising on the right
  parseScene(`
    aaaaaaaaaaaaaa
    aaaaaaaaaaaass
    aaaaaalllaasss
    aaaaalllllssss
    aaaaawllssssss
    ggggggwgggssss
    ddddddwdddssss
    ssssssssssssss
  `),
  // 2) Underground cave with ores and cobblestone clumps
  parseScene(`
    ssssssssssssss
    ssDsssssGssRss
    ssssscccssssss
    sscsccsssDssss
    ssssRsssssooss
    sscssssssoosss
    sssGsssssoosss
    sssssDsssssRss
  `),
  // 3) Beach: ocean on the left, sand on the right
  parseScene(`
    aaaaaaaaaaaaaa
    aaaaaaaaaaaaaa
    aaaaaaaaaaaaaa
    ~~~~~~~nnnnnnn
    ~~~~~~~nnnnnnn
    ~~~~~~~~nnnnnn
    nnnnnnnnnnnnnn
    dddddddddddddd
  `),
  // 4) Sunset over mountains with lava at the base
  parseScene(`
    aaaaaaaaGGaaaa
    aaaaaaGGGGGaaa
    aaaaaaGGGGGaaa
    aaassaaGGaassa
    aassssaaaassss
    ssssssssssssss
    ddddddddddssss
    LLLLLLddddddss
  `),
  // 5) Pixel heart floating in the night sky
  parseScene(`
    aaaaaaaaaaaaaa
    aaaRRaaaRRaaaa
    aaRRRRRRRRRaaa
    aaRRRRRRRRRaaa
    aaaRRRRRRRaaaa
    aaaaRRRRRaaaaa
    aaaaaRRRaaaaaa
    aaaaaaRaaaaaaa
  `),
  // 6) Deep mine with a diamond + gold mosaic
  parseScene(`
    ssssDssssDssss
    ssssssssssssss
    ssDssssDssssDs
    ssssGssssGssss
    ssDssssDssssDs
    ssssssssssssss
    ssDssGssDsGsss
    ssssDsssssDsss
  `),
];

const GRID_COLS = 14;
const GRID_ROWS = 8;

function applyScene(blocks: HTMLElement[], scene: string[]): void {
  for (let row = 0; row < GRID_ROWS; row++) {
    const rowStr = scene[row] ?? '';
    for (let col = 0; col < GRID_COLS; col++) {
      const idx = row * GRID_COLS + col;
      const block = blocks[idx];
      if (!block) continue;
      const ch = rowStr[col] ?? 'a';
      const mat = MAT_MAP[ch] ?? 'air';
      // Stagger the transitions so the scene "warps" into place over ~1.5s
      const delayMs = Math.random() * 900;
      block.style.transitionDelay = `${delayMs}ms`;
      block.className = `mc-block mat-${mat}`;
    }
  }
}

export function initBackgroundFX(): void {
  if (document.querySelector('.mc-grid')) return;

  const grid = document.createElement('div');
  grid.className = 'mc-grid';
  document.body.appendChild(grid);

  const blocks: HTMLElement[] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const b = document.createElement('div');
      b.className = 'mc-block mat-air';
      grid.appendChild(b);
      blocks.push(b);
    }
  }

  // Soft aurora overlay (kept for atmosphere on top of the grid)
  const aurora = document.createElement('div');
  aurora.className = 'bg-aurora';
  aurora.innerHTML = `
    <div class="aurora-blob blob-a"></div>
    <div class="aurora-blob blob-b"></div>
    <div class="aurora-blob blob-c"></div>
    <div class="aurora-blob blob-d"></div>
  `;
  document.body.appendChild(aurora);

  // Twinkling star dust above the grid
  const dust = document.createElement('div');
  dust.className = 'bg-dust';
  document.body.appendChild(dust);

  const dustCount = 110;
  for (let i = 0; i < dustCount; i++) {
    const p = document.createElement('div');
    p.className = 'dust-mote';
    const roll = Math.random();
    const isStar = roll > 0.85;
    const isLargeStar = roll > 0.97;
    let size: number;
    if (isLargeStar) {
      size = 3 + Math.random() * 2;
      p.classList.add('star', 'star-big');
    } else if (isStar) {
      size = 2 + Math.random() * 1.2;
      p.classList.add('star');
    } else {
      size = 1 + Math.random() * 1.5;
    }
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${100 + Math.random() * 30}%`;
    p.style.opacity = String(0.35 + Math.random() * 0.55);
    const dur = 18 + Math.random() * 22;
    p.style.animationDuration = `${dur}s, ${(2 + Math.random() * 4).toFixed(2)}s`;
    p.style.animationDelay = `${-Math.random() * dur}s, ${-Math.random() * 4}s`;
    const tint =
      Math.random() < 0.6
        ? 'rgba(255, 255, 255, 0.95)'
        : 'rgba(220, 235, 255, 0.92)';
    p.style.background = tint;
    p.style.boxShadow = `0 0 ${size * 2.5}px ${tint}`;
    dust.appendChild(p);
  }

  // Apply first scene then cycle every 11s
  applyScene(blocks, SCENES[0]);
  let sceneIdx = 0;
  window.setInterval(() => {
    sceneIdx = (sceneIdx + 1) % SCENES.length;
    applyScene(blocks, SCENES[sceneIdx]);
  }, 11000);
}
