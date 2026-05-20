import type { LevelDef } from '../game/types';

export const PRESET_LEVELS: LevelDef[] = [
  {
    id: 'preset-1',
    name: 'First Steps',
    capacity: 4,
    tubes: [
      [0, 1, 0, 1],
      [1, 0, 1, 0],
      [],
    ],
  },
  {
    id: 'preset-2',
    name: 'Warm Up',
    capacity: 4,
    tubes: [
      [0, 1, 2, 0],
      [1, 2, 0, 1],
      [2, 0, 1, 2],
      [],
    ],
  },
  {
    id: 'preset-3',
    name: 'Three Tubes',
    capacity: 4,
    tubes: [
      [0, 1, 0, 1],
      [1, 0, 1, 0],
      [2, 2, 2, 2],
      [],
    ],
  },
  {
    id: 'preset-4',
    name: 'Split Stack',
    capacity: 4,
    tubes: [
      [0, 0, 1, 1],
      [1, 1, 0, 0],
      [2, 2, 2, 2],
      [],
      [],
    ],
  },
  {
    id: 'preset-5',
    name: 'Rainbow Mix',
    capacity: 4,
    tubes: [
      [0, 1, 2, 3],
      [1, 2, 3, 0],
      [2, 3, 0, 1],
      [3, 0, 1, 2],
      [],
      [],
    ],
  },
  {
    id: 'preset-6',
    name: 'Tight Squeeze',
    capacity: 4,
    tubes: [
      [0, 1, 2, 3],
      [3, 2, 1, 0],
      [0, 3, 2, 1],
      [1, 0, 3, 2],
      [2, 1, 0, 3],
      [],
    ],
  },
  {
    id: 'preset-7',
    name: 'Double Empty',
    capacity: 4,
    tubes: [
      [0, 1, 2, 3],
      [2, 0, 3, 1],
      [3, 2, 1, 0],
      [1, 3, 0, 2],
      [],
      [],
    ],
  },
  {
    id: 'preset-8',
    name: 'Five Colors',
    capacity: 4,
    tubes: [
      [0, 1, 2, 3],
      [4, 0, 1, 2],
      [3, 4, 0, 1],
      [2, 3, 4, 0],
      [1, 2, 3, 4],
      [],
      [],
    ],
  },
  {
    id: 'preset-9',
    name: 'Layer Cake',
    capacity: 4,
    tubes: [
      [0, 1, 0, 1],
      [2, 3, 2, 3],
      [0, 2, 0, 2],
      [1, 3, 1, 3],
      [],
      [],
    ],
  },
  {
    id: 'preset-10',
    name: 'Mirror',
    capacity: 4,
    tubes: [
      [0, 1, 2, 3],
      [3, 2, 1, 0],
      [0, 2, 1, 3],
      [3, 1, 2, 0],
      [],
      [],
    ],
  },
  {
    id: 'preset-11',
    name: 'Crowded',
    capacity: 4,
    tubes: [
      [0, 1, 2, 3],
      [1, 2, 3, 4],
      [2, 3, 4, 0],
      [3, 4, 0, 1],
      [4, 0, 1, 2],
      [0, 4, 3, 1],
      [],
    ],
  },
  {
    id: 'preset-12',
    name: 'Six Pack',
    capacity: 4,
    tubes: [
      [0, 1, 2, 3],
      [4, 5, 0, 1],
      [2, 3, 4, 5],
      [5, 4, 3, 2],
      [1, 0, 5, 4],
      [3, 2, 1, 0],
      [],
      [],
    ],
  },
  {
    id: 'preset-13',
    name: 'Deep Shuffle',
    capacity: 4,
    tubes: [
      [0, 2, 4, 1],
      [1, 3, 5, 0],
      [2, 4, 0, 3],
      [3, 5, 1, 2],
      [4, 0, 2, 5],
      [5, 1, 3, 4],
      [],
      [],
    ],
  },
  {
    id: 'preset-14',
    name: 'Expert I',
    capacity: 4,
    tubes: [
      [0, 1, 2, 3],
      [4, 5, 0, 1],
      [2, 3, 4, 5],
      [5, 0, 3, 2],
      [1, 4, 5, 0],
      [3, 2, 1, 4],
      [],
    ],
  },
  {
    id: 'preset-15',
    name: 'Expert II',
    capacity: 4,
    tubes: [
      [0, 3, 5, 1],
      [1, 4, 0, 2],
      [2, 5, 1, 3],
      [3, 0, 2, 4],
      [4, 1, 3, 5],
      [5, 2, 4, 0],
      [],
      [],
    ],
  },
];

export function getPresetById(id: string): LevelDef | undefined {
  return PRESET_LEVELS.find((l) => l.id === id);
}

export function getNextPresetId(currentId: string): string | null {
  const idx = PRESET_LEVELS.findIndex((l) => l.id === currentId);
  if (idx < 0 || idx >= PRESET_LEVELS.length - 1) return null;
  return PRESET_LEVELS[idx + 1].id;
}
