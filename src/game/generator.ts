import type { Difficulty, GeneratorOptions, LevelDef, Tube } from './types';
import { allValidMoves, applyMove, cloneTubes, isWin } from './rules';

const SCRAMBLE_DEPTH: Record<Difficulty, [number, number]> = {
  easy: [20, 35],
  medium: [35, 55],
  hard: [55, 85],
};

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function solvedTubes(colors: number, emptyTubes: number, capacity: number): Tube[] {
  const tubes: Tube[] = [];
  for (let c = 0; c < colors; c++) {
    tubes.push(Array.from({ length: capacity }, () => c));
  }
  for (let i = 0; i < emptyTubes; i++) {
    tubes.push([]);
  }
  return tubes;
}

function scramble(
  tubes: Tube[],
  capacity: number,
  moves: number,
  rand: () => number,
): Tube[] {
  let current = cloneTubes(tubes);
  let applied = 0;
  let attempts = 0;
  const maxAttempts = moves * 20;

  while (applied < moves && attempts < maxAttempts) {
    attempts++;
    const legal = allValidMoves(current, capacity);
    if (legal.length === 0) break;
    const [from, to] = legal[Math.floor(rand() * legal.length)];
    current = applyMove(current, from, to);
    applied++;
  }

  return current;
}

export function generateLevel(options: GeneratorOptions): LevelDef {
  const { colors, emptyTubes, difficulty } = options;
  const capacity = 4;
  const seed =
    options.seed ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const rand = mulberry32(hashSeed(seed));
  const [minMoves, maxMoves] = SCRAMBLE_DEPTH[difficulty];
  const scrambleCount =
    minMoves + Math.floor(rand() * (maxMoves - minMoves + 1));

  let tubes = solvedTubes(colors, emptyTubes, capacity);
  tubes = scramble(tubes, capacity, scrambleCount, rand);

  if (isWin(tubes, capacity)) {
    tubes = scramble(solvedTubes(colors, emptyTubes, capacity), capacity, scrambleCount + 10, rand);
  }

  const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return {
    id: `random-${seed}`,
    name: `Random (${colors} colors, ${diffLabel})`,
    tubes,
    capacity,
  };
}
