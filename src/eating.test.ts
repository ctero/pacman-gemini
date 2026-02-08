import { describe, it, expect, beforeEach } from 'vitest';
import { PacMan } from './pacman';
import { MazeState } from './mazeState';
import { MazeTile } from './mazeData';
import { TILE_SIZE } from './constants';

describe('Eating Logic', () => {
    let pacman: PacMan;
    let mazeState: MazeState;

    beforeEach(() => {
        const mockMaze: MazeTile[][] = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
        mockMaze[26][14] = MazeTile.DOT;
        mockMaze[26][15] = MazeTile.POWER_PELLET;
        mazeState = new MazeState(mockMaze);
        pacman = new PacMan(14 * TILE_SIZE, 26 * TILE_SIZE);
    });

    it('should eat a dot when passing over its center', () => {
        // Pacman at (14, 26) - exactly on the dot
        const eaten = pacman.eat(mazeState);
        expect(eaten).toBe(MazeTile.DOT);
        expect(mazeState.getTile(14, 26)).toBe(MazeTile.EMPTY);
    });

    it('should eat a power pellet when passing over its center', () => {
        pacman.x = 15 * TILE_SIZE;
        const eaten = pacman.eat(mazeState);
        expect(eaten).toBe(MazeTile.POWER_PELLET);
        expect(mazeState.getTile(15, 26)).toBe(MazeTile.EMPTY);
    });

    it('should return EMPTY if no dot or pellet is at the current tile', () => {
        pacman.x = 0;
        const eaten = pacman.eat(mazeState);
        expect(eaten).toBe(MazeTile.EMPTY);
    });
});
