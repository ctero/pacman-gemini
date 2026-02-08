export enum MazeTile {
    EMPTY = 0,
    WALL = 1,
    DOT = 2,
    POWER_PELLET = 3,
    GHOST_HOUSE_DOOR = 4,
    GHOST_HOUSE = 5,
}

const W = MazeTile.WALL;
const d = MazeTile.DOT;
const P = MazeTile.POWER_PELLET;
const E = MazeTile.EMPTY;
const G = MazeTile.GHOST_HOUSE;
const D = MazeTile.GHOST_HOUSE_DOOR;

export const MAZE_DATA: MazeTile[][] = [
    // 0-2: Header
    [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
    // 3: Top border
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    [W, d, d, d, d, d, d, d, d, d, d, d, d, W, W, d, d, d, d, d, d, d, d, d, d, d, d, W],
    [W, d, W, W, W, W, d, W, W, W, W, W, d, W, W, d, W, W, W, W, W, d, W, W, W, W, d, W],
    [W, P, W, W, W, W, d, W, W, W, W, W, d, W, W, d, W, W, W, W, W, d, W, W, W, W, P, W],
    [W, d, W, W, W, W, d, W, W, W, W, W, d, W, W, d, W, W, W, W, W, d, W, W, W, W, d, W],
    [W, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, W],
    [W, d, W, W, W, W, d, W, W, d, W, W, W, W, W, W, W, W, d, W, W, d, W, W, W, W, d, W],
    [W, d, W, W, W, W, d, W, W, d, W, W, W, W, W, W, W, W, d, W, W, d, W, W, W, W, d, W],
    [W, d, d, d, d, d, d, W, W, d, d, d, d, W, W, d, d, d, d, W, W, d, d, d, d, d, d, W],
    [W, W, W, W, W, W, d, W, W, W, W, W, E, W, W, E, W, W, W, W, W, d, W, W, W, W, W, W],
    [E, E, E, E, E, W, d, W, W, W, W, W, E, W, W, E, W, W, W, W, W, d, W, E, E, E, E, E],
    [E, E, E, E, E, W, d, W, W, E, E, E, E, E, E, E, E, E, E, W, W, d, W, E, E, E, E, E],
    [E, E, E, E, E, W, d, W, W, E, W, W, W, D, D, W, W, W, E, W, W, d, W, E, E, E, E, E],
    [W, W, W, W, W, W, d, W, W, E, W, E, E, E, E, E, E, W, E, W, W, d, W, W, W, W, W, W],
    [E, E, E, E, E, E, d, E, E, E, W, E, E, E, E, E, E, W, E, E, E, d, E, E, E, E, E, E],
    [W, W, W, W, W, W, d, W, W, E, W, E, E, E, E, E, E, W, E, W, W, d, W, W, W, W, W, W],
    [E, E, E, E, E, W, d, W, W, E, W, W, W, W, W, W, W, W, E, W, W, d, W, E, E, E, E, E],
    [E, E, E, E, E, W, d, W, W, E, E, E, E, E, E, E, E, E, E, W, W, d, W, E, E, E, E, E],
    [E, E, E, E, E, W, d, W, W, E, W, W, W, W, W, W, W, W, E, W, W, d, W, E, E, E, E, E],
    [W, W, W, W, W, W, d, W, W, E, W, W, W, W, W, W, W, W, E, W, W, d, W, W, W, W, W, W],
    [W, d, d, d, d, d, d, d, d, d, d, d, d, W, W, d, d, d, d, d, d, d, d, d, d, d, d, W],
    [W, d, W, W, W, W, d, W, W, W, W, W, d, W, W, d, W, W, W, W, W, d, W, W, W, W, d, W],
    [W, d, W, W, W, W, d, W, W, W, W, W, d, W, W, d, W, W, W, W, W, d, W, W, W, W, d, W],
    [W, P, d, d, W, W, d, d, d, d, d, d, d, E, E, d, d, d, d, d, d, d, W, W, d, d, P, W],
    [W, W, W, d, W, W, d, W, W, d, W, W, W, W, W, W, W, W, d, W, W, d, W, W, d, W, W, W],
    [W, W, W, d, W, W, d, W, W, d, W, W, W, W, W, W, W, W, d, W, W, d, W, W, d, W, W, W],
    [W, d, d, d, d, d, d, W, W, d, d, d, d, W, W, d, d, d, d, W, W, d, d, d, d, d, d, W],
    [W, d, W, W, W, W, W, W, W, W, W, W, d, W, W, d, W, W, W, W, W, W, W, W, W, W, d, W],
    [W, d, W, W, W, W, W, W, W, W, W, W, d, W, W, d, W, W, W, W, W, W, W, W, W, W, d, W],
    [W, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, d, W],
    [W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W, W],
    // 34-35: Footer
    [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
];
