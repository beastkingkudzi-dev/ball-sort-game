/** Colorblind-friendly palette (CSS custom property values) */
export const COLOR_PALETTE: string[] = [
  '#4fc3f7', // blue
  '#ffb74d', // orange
  '#ce93d8', // purple
  '#4db6ac', // teal
  '#fff176', // yellow
  '#f48fb1', // pink
  '#a5d6a7', // green
  '#ff8a65', // coral
];

export function colorCss(id: number): string {
  return COLOR_PALETTE[id % COLOR_PALETTE.length];
}
