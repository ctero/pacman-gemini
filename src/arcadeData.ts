export interface ArcadeLevelData {
    pacmanSpeed: number;
    pacmanEatingSpeed: number;
    ghostSpeed: number;
    ghostFrightenedSpeed: number;
    ghostTunnelSpeed: number;
    frightenedDuration: number;
    frightenedFlashes: number;
    elroy1Dots: number;
    elroy1Speed: number;
    elroy2Dots: number;
    elroy2Speed: number;
}

const ARCADE_LEVEL_TABLE: Record<number, ArcadeLevelData> = {
    1: {
        pacmanSpeed: 0.80,
        pacmanEatingSpeed: 0.71,
        ghostSpeed: 0.75,
        ghostFrightenedSpeed: 0.50,
        ghostTunnelSpeed: 0.40,
        frightenedDuration: 6,
        frightenedFlashes: 5,
        elroy1Dots: 20,
        elroy1Speed: 0.80,
        elroy2Dots: 10,
        elroy2Speed: 0.85
    },
    2: {
        pacmanSpeed: 0.90,
        pacmanEatingSpeed: 0.79,
        ghostSpeed: 0.85,
        ghostFrightenedSpeed: 0.55,
        ghostTunnelSpeed: 0.45,
        frightenedDuration: 5,
        frightenedFlashes: 5,
        elroy1Dots: 30,
        elroy1Speed: 0.90,
        elroy2Dots: 15,
        elroy2Speed: 0.95
    },
    5: {
        pacmanSpeed: 1.00,
        pacmanEatingSpeed: 0.87,
        ghostSpeed: 0.95,
        ghostFrightenedSpeed: 0.60,
        ghostTunnelSpeed: 0.50,
        frightenedDuration: 2,
        frightenedFlashes: 5,
        elroy1Dots: 40,
        elroy1Speed: 1.00,
        elroy2Dots: 20,
        elroy2Speed: 1.05
    },
    21: {
        pacmanSpeed: 0.90,
        pacmanEatingSpeed: 0.79,
        ghostSpeed: 0.95,
        ghostFrightenedSpeed: 0.60,
        ghostTunnelSpeed: 0.50,
        frightenedDuration: 0,
        frightenedFlashes: 0,
        elroy1Dots: 60,
        elroy1Speed: 1.00,
        elroy2Dots: 30,
        elroy2Speed: 1.05
    }
};

export function getArcadeLevelData(level: number): ArcadeLevelData {
    if (level >= 21) return ARCADE_LEVEL_TABLE[21];
    if (level >= 5) return ARCADE_LEVEL_TABLE[5];
    if (level >= 2) return ARCADE_LEVEL_TABLE[2];
    return ARCADE_LEVEL_TABLE[1];
}

export const SCATTER_CHASE_TABLE = [
    { mode: 'SCATTER', duration: 7 },
    { mode: 'CHASE', duration: 20 },
    { mode: 'SCATTER', duration: 7 },
    { mode: 'CHASE', duration: 20 },
    { mode: 'SCATTER', duration: 5 },
    { mode: 'CHASE', duration: 20 },
    { mode: 'SCATTER', duration: 5 },
    { mode: 'CHASE', duration: Infinity }
];
