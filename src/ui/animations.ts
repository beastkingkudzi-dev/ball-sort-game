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

export function pulseBall(element: HTMLElement): void {
  element.classList.add('ball-move');
  element.addEventListener(
    'animationend',
    () => element.classList.remove('ball-move'),
    { once: true },
  );
}
