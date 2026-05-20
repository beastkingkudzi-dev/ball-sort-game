const STORAGE_KEY = 'ball-sort-high-scores';

export interface ScoreRecord {
  bestMoves: number;
  achievedAt: string;
}

export type ScoreMap = Record<string, ScoreRecord>;

function loadAll(): ScoreMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ScoreMap;
  } catch {
    return {};
  }
}

function saveAll(map: ScoreMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getBestMoves(levelId: string): number | null {
  const record = loadAll()[levelId];
  return record?.bestMoves ?? null;
}

export function saveScoreIfBest(levelId: string, moves: number): boolean {
  const all = loadAll();
  const current = all[levelId];
  if (current && moves >= current.bestMoves) return false;
  all[levelId] = {
    bestMoves: moves,
    achievedAt: new Date().toISOString(),
  };
  saveAll(all);
  return true;
}
