import { describe, it, expect, beforeEach } from 'vitest';
import { MazeState } from './mazeState';
import { MazeTile } from './mazeData';

describe('MazeState', () => {
    let mazeState: MazeState;
    const mockMaze: MazeTile[][] = [
        [MazeTile.WALL, MazeTile.DOT],
        [MazeTile.POWER_PELLET, MazeTile.EMPTY]
    ];

    beforeEach(() => {
        mazeState = new MazeState(mockMaze);
    });

    it('should initialize with the provided maze data', () => {
        expect(mazeState.getTile(0, 0)).toBe(MazeTile.WALL);
        expect(mazeState.getTile(1, 0)).toBe(MazeTile.DOT);
    });

    it('should allow removing items (setting to EMPTY)', () => {
        mazeState.removeLevelItem(1, 0);
        expect(mazeState.getTile(1, 0)).toBe(MazeTile.EMPTY);
    });

    it('should track the remaining dots and pellets', () => {
        expect(mazeState.getRemainingItemsCount()).toBe(2);
        mazeState.removeLevelItem(1, 0);
        expect(mazeState.getRemainingItemsCount()).toBe(1);
    });
});
