export enum FruitType {
    CHERRY = 'CHERRY',
    STRAWBERRY = 'STRAWBERRY',
    PEACH = 'PEACH',
    APPLE = 'APPLE',
    GRAPES = 'GRAPES',
    GALAXIAN = 'GALAXIAN',
    BELL = 'BELL',
    KEY = 'KEY'
}

export interface FruitData {
    type: FruitType;
    points: number;
}

export const LEVEL_FRUIT_DATA: Record<number, FruitData> = {
    1: { type: FruitType.CHERRY, points: 100 },
    2: { type: FruitType.STRAWBERRY, points: 300 },
    3: { type: FruitType.PEACH, points: 500 },
    4: { type: FruitType.PEACH, points: 500 },
    5: { type: FruitType.APPLE, points: 700 },
    6: { type: FruitType.APPLE, points: 700 },
    7: { type: FruitType.GRAPES, points: 1000 },
    8: { type: FruitType.GRAPES, points: 1000 },
    9: { type: FruitType.GALAXIAN, points: 2000 },
    10: { type: FruitType.GALAXIAN, points: 2000 },
    11: { type: FruitType.BELL, points: 3000 },
    12: { type: FruitType.BELL, points: 3000 },
};

export const DEFAULT_FRUIT_DATA: FruitData = { type: FruitType.KEY, points: 5000 };

export function getFruitDataForLevel(level: number): FruitData {
    return LEVEL_FRUIT_DATA[level] || DEFAULT_FRUIT_DATA;
}
