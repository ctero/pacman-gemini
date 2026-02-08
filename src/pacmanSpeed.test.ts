import { describe, it, expect, beforeEach } from 'vitest';
import { PacMan } from './pacman';
import { Direction } from './types';
import { TILE_SIZE } from './constants';
import { MazeTile } from './mazeData';

describe('PacMan Speed and Eating Penalty', () => {
    let pacman: PacMan;
    let maze: MazeTile[][];

    beforeEach(() => {
        pacman = new PacMan(14 * TILE_SIZE, 23 * TILE_SIZE);
        maze = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
    });

    it('should use base speed when not eating', () => {
        pacman.setBaseSpeed(1.0);
        pacman.setDirection(Direction.RIGHT);
        const initialX = pacman.x;
        pacman.update(1, maze);
        expect(pacman.x).toBe(initialX + 1.0);
    });

    it('should apply eating penalty when consuming a dot', () => {
        pacman.setBaseSpeed(1.0);
        pacman.setEatingSpeed(0.5);
        pacman.setDirection(Direction.RIGHT);
        
        // Put a dot at the NEXT position (one step away)
        // Current position: 14 * 8 = 112. Next position: 113.
        // TILE_SIZE is 8. Tile (14, 23) is at x=112.
        // If we move 1.0, we reach x=113.
        // Pac-Man eats when he is within 'speed' tolerance of tile center.
        
        maze[23][14] = MazeTile.DOT;
        
        const initialX = pacman.x;
        pacman.update(1, maze);
        
        // Since he is at tile center (14, 23) and there is a dot,
        // he should move at eating speed.
        expect(pacman.x).toBe(initialX + 0.5);
    });
});
