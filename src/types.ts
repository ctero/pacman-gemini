export enum Direction {
    NONE = 0,
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4,
}

export enum GhostMode {
    SCATTER = 0,
    CHASE = 1,
    FRIGHTENED = 2,
    EATEN = 3
}

export enum GhostState {
    NORMAL = 0,
    FRIGHTENED = 1,
    EATEN = 2,
    ENTERING_HOUSE = 3,
    REGENERATING = 4
}

export enum GameStatus {
    READY = 0,
    PLAYING = 1,
    LEVEL_COMPLETE = 2,
    GAME_OVER = 3
}

export interface Point {
    x: number;
    y: number;
}
