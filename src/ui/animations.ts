const CONFETTI_PALETTE = [
  '#ffd1dc',
  '#ffe1a8',
  '#d4f0e0',
  '#c8e0ff',
  '#e6d0ff',
  '#ffc8a8',
  '#a8e8d8',
  '#ffb3c1',
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
      { transform: 'scale(1.14, 0.84)' },
      { transform: 'scale(0.9, 1.1)', offset: 0.32 },
      { transform: 'scale(1.06, 0.96)', offset: 0.58 },
      { transform: 'scale(0.98, 1.02)', offset: 0.8 },
      { transform: 'scale(1, 1)' },
    ],
    {
      duration: 400,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  );
}

export function animateBallMove(
  fromRect: DOMRect,
  ball: HTMLElement,
  tubeTopY: number,
): void {
  const toRect = ball.getBoundingClientRect();
  const dx = fromRect.left - toRect.left;
  const dy = fromRect.top - toRect.top;

  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
    settleBall(ball);
    return;
  }

  // Compute arc height so the apex clears the highest tube rim by 'clearance'.
  // Ball top at apex (absolute) = (toRect.top + fromRect.top)/2 - arcHeight
  // We want apex <= tubeTopY - clearance.
  const clearance = 52;
  const naturalMidAbsY = (toRect.top + fromRect.top) / 2;
  let arcHeight = naturalMidAbsY - (tubeTopY - clearance);
  arcHeight = Math.max(arcHeight + 28, 90);

  ball.style.zIndex = '50';
  ball.style.filter =
    'drop-shadow(0 12px 14px rgba(0, 0, 0, 0.55))';

  // Parametric parabola: x linear, y via sine envelope.
  //   xT(t) = dx*(1-t)
  //   yT(t) = dy*(1-t) - arcHeight*sin(πt)
  // Built as 9 keyframes (8 sub-steps) for smooth interpolation.
  const steps = 8;
  const keyframes: Keyframe[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = dx * (1 - t);
    const y = dy * (1 - t) - arcHeight * Math.sin(Math.PI * t);
    const scale = 1 + 0.08 * Math.sin(Math.PI * t);
    keyframes.push({
      transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(3)})`,
      offset: t,
    });
  }

  // Duration scales gently with arc height (longer flights = longer hang time).
  const duration = Math.max(460, Math.min(720, 360 + arcHeight * 1.05));

  const travel = ball.animate(keyframes, {
    duration,
    easing: 'cubic-bezier(0.38, 0.05, 0.4, 1)',
  });

  travel.onfinish = () => {
    ball.style.zIndex = '';
    ball.style.filter = '';
    settleBall(ball);
  };
}

export function spawnConfetti(count = 80): void {
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

    if (Math.random() > 0.6) piece.classList.add('confetti-round');

    const angle = Math.random() * Math.PI * 2;
    const speed = 200 + Math.random() * 300;
    const kx = Math.cos(angle) * speed;
    const kyKick = Math.sin(angle) * speed - 140;
    const fyFall = h * 0.7 + Math.random() * 240;
    const rotZ = (Math.random() - 0.5) * 1080;
    const rotY = (Math.random() - 0.5) * 720;
    const startScale = 0.55 + Math.random() * 0.55;
    const duration = 1600 + Math.random() * 1100;

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

  window.setTimeout(() => layer.remove(), 3600);
}

export function initBackgroundFX(): void {
  if (document.querySelector('.bg-aurora')) return;

  const aurora = document.createElement('div');
  aurora.className = 'bg-aurora';
  aurora.innerHTML = `
    <div class="aurora-blob blob-a"></div>
    <div class="aurora-blob blob-b"></div>
    <div class="aurora-blob blob-c"></div>
    <div class="aurora-blob blob-d"></div>
  `;
  document.body.appendChild(aurora);

  const dust = document.createElement('div');
  dust.className = 'bg-dust';
  document.body.appendChild(dust);

  const count = 55;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'dust-mote';
    const size = 1.2 + Math.random() * 2.4;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${100 + Math.random() * 20}%`;
    p.style.opacity = String(0.25 + Math.random() * 0.55);
    const dur = 14 + Math.random() * 22;
    p.style.animationDuration = `${dur}s`;
    p.style.animationDelay = `${-Math.random() * dur}s`;
    const hue =
      Math.random() > 0.5
        ? 'rgba(255, 220, 240, 0.9)'
        : 'rgba(210, 230, 255, 0.85)';
    p.style.background = hue;
    p.style.boxShadow = `0 0 6px ${hue}`;
    dust.appendChild(p);
  }
}
