import type { Tube } from './types';

export function cloneTubes(tubes: Tube[]): Tube[] {
  return tubes.map((t) => [...t]);
}

export function topBall(tube: Tube): number | null {
  return tube.length > 0 ? tube[tube.length - 1] : null;
}

export function canMove(
  tubes: Tube[],
  from: number,
  to: number,
  capacity: number,
): boolean {
  if (from === to) return false;
  const source = tubes[from];
  const dest = tubes[to];
  if (source.length === 0) return false;
  if (dest.length >= capacity) return false;
  const ball = source[source.length - 1];
  if (dest.length === 0) return true;
  return dest[dest.length - 1] === ball;
}

export function applyMove(tubes: Tube[], from: number, to: number): Tube[] {
  const next = cloneTubes(tubes);
  const ball = next[from].pop()!;
  next[to].push(ball);
  return next;
}

export function isWin(tubes: Tube[], capacity: number): boolean {
  return tubes.every((tube) => {
    if (tube.length === 0) return true;
    if (tube.length !== capacity) return false;
    return tube.every((c) => c === tube[0]);
  });
}

export function allValidMoves(
  tubes: Tube[],
  capacity: number,
): [number, number][] {
  const moves: [number, number][] = [];
  for (let from = 0; from < tubes.length; from++) {
    for (let to = 0; to < tubes.length; to++) {
      if (canMove(tubes, from, to, capacity)) {
        moves.push([from, to]);
      }
    }
  }
  return moves;
}
