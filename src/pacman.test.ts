import { describe, it, expect, beforeEach } from 'vitest';
import { PacMan } from './pacman';
import { Direction } from './types';
import { TILE_SIZE } from './constants';

describe('PacMan Movement', () => {
    let pacman: PacMan;

    beforeEach(() => {
        pacman = new PacMan(14 * TILE_SIZE, 23 * TILE_SIZE);
    });

    it('should initialize at the correct position', () => {
        expect(pacman.x).toBe(14 * TILE_SIZE);
        expect(pacman.y).toBe(23 * TILE_SIZE);
    });

    it('should move in the current direction', () => {
        pacman.setDirection(Direction.LEFT);
        pacman.update(1); // 1 frame
        expect(pacman.x).toBeLessThan(14 * TILE_SIZE);
    });

    it('should stay aligned with tiles on the axis opposite to movement', () => {
        pacman.setDirection(Direction.UP);
        pacman.update(10);
        expect(pacman.x).toBe(14 * TILE_SIZE);
    });
});
