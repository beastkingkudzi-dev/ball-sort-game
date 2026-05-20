export type ColorId = number;

export type Tube = ColorId[];

export interface LevelDef {
  id: string;
  name: string;
  tubes: Tube[];
  capacity: number;
}

export interface GameState {
  tubes: Tube[];
  capacity: number;
  moves: number;
  selectedTube: number | null;
  levelId: string;
  levelName: string;
  undoStack: Snapshot[];
}

export interface Snapshot {
  tubes: Tube[];
  moves: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GeneratorOptions {
  colors: number;
  emptyTubes: number;
  difficulty: Difficulty;
  seed?: string;
}
