const CONFETTI_PALETTE = [
  '#4fc3f7',
  '#ffb74d',
  '#ce93d8',
  '#4db6ac',
  '#fff176',
  '#f48fb1',
  '#a5d6a7',
  '#ff8a65',
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
      { transform: 'scale(1.12, 0.86)' },
      { transform: 'scale(0.92, 1.08)', offset: 0.35 },
      { transform: 'scale(1.05, 0.96)', offset: 0.6 },
      { transform: 'scale(0.99, 1.01)', offset: 0.82 },
      { transform: 'scale(1, 1)' },
    ],
    {
      duration: 380,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  );
}

export function animateBallMove(
  fromRect: DOMRect,
  ball: HTMLElement,
): void {
  const toRect = ball.getBoundingClientRect();
  const dx = fromRect.left - toRect.left;
  const dy = fromRect.top - toRect.top;

  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
    settleBall(ball);
    return;
  }

  const arcHeight = Math.min(120, Math.max(60, Math.abs(dx) * 0.32 + 50));
  ball.style.zIndex = '50';
  ball.style.filter = 'drop-shadow(0 8px 10px rgba(0, 0, 0, 0.45))';

  const travel = ball.animate(
    [
      {
        transform: `translate(${dx}px, ${dy}px) scale(1.04)`,
        offset: 0,
      },
      {
        transform: `translate(${dx * 0.72}px, ${dy * 0.72 - arcHeight * 0.85}px) scale(1.07)`,
        offset: 0.28,
      },
      {
        transform: `translate(${dx * 0.5}px, ${dy * 0.5 - arcHeight}px) scale(1.09)`,
        offset: 0.5,
      },
      {
        transform: `translate(${dx * 0.25}px, ${dy * 0.25 - arcHeight * 0.65}px) scale(1.06)`,
        offset: 0.72,
      },
      {
        transform: 'translate(0, 0) scale(1)',
        offset: 1,
      },
    ],
    {
      duration: 480,
      easing: 'cubic-bezier(0.32, 0.04, 0.34, 0.99)',
    },
  );

  travel.onfinish = () => {
    ball.style.zIndex = '';
    ball.style.filter = '';
    settleBall(ball);
  };
}

export function spawnConfetti(count = 70): void {
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  document.body.appendChild(layer);

  const w = window.innerWidth;
  const h = window.innerHeight;
  const cx = w / 2;
  const cy = h * 0.32;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = CONFETTI_PALETTE[i % CONFETTI_PALETTE.length];
    piece.style.backgroundColor = color;
    piece.style.left = `${cx}px`;
    piece.style.top = `${cy}px`;

    const shape = Math.random() > 0.6 ? 'round' : 'rect';
    if (shape === 'round') piece.classList.add('confetti-round');

    const angle = Math.random() * Math.PI * 2;
    const speed = 180 + Math.random() * 280;
    const dx = Math.cos(angle) * speed;
    const dyKick = Math.sin(angle) * speed - 120;
    const dyFall = h * 0.7 + Math.random() * 220;
    const rotZ = (Math.random() - 0.5) * 1080;
    const rotY = (Math.random() - 0.5) * 720;
    const startScale = 0.55 + Math.random() * 0.55;
    const duration = 1500 + Math.random() * 1000;

    const anim = piece.animate(
      [
        {
          transform: `translate(0, 0) rotate3d(1, 0.5, 0, 0deg) rotate(0deg) scale(${startScale})`,
          opacity: 1,
        },
        {
          transform: `translate(${dx * 0.55}px, ${dyKick}px) rotate3d(1, 0.5, 0, ${rotY * 0.4}deg) rotate(${rotZ * 0.45}deg) scale(${startScale})`,
          opacity: 1,
          offset: 0.4,
        },
        {
          transform: `translate(${dx}px, ${dyFall}px) rotate3d(1, 0.5, 0, ${rotY}deg) rotate(${rotZ}deg) scale(${startScale * 0.9})`,
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

  window.setTimeout(() => layer.remove(), 3500);
}
