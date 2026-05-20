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
  ball.classList.remove('settle');
  void ball.offsetWidth;
  ball.classList.add('settle');
  ball.addEventListener(
    'animationend',
    () => ball.classList.remove('settle'),
    { once: true },
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

  ball.style.transition = 'none';
  ball.style.transform = `translate(${dx}px, ${dy}px)`;
  ball.style.zIndex = '50';

  void ball.offsetHeight;

  ball.style.transition =
    'transform 0.34s cubic-bezier(0.45, 0.05, 0.55, 0.95)';
  ball.style.transform = '';

  const onEnd = (event: TransitionEvent) => {
    if (event.propertyName !== 'transform') return;
    ball.style.transition = '';
    ball.style.zIndex = '';
    ball.removeEventListener('transitionend', onEnd);
    settleBall(ball);
  };
  ball.addEventListener('transitionend', onEnd);
}
