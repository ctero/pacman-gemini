import { describe, it, expect, beforeEach } from 'vitest';
import { PacMan } from './pacman';
import { Direction } from './types';
import { TILE_SIZE } from './constants';
import { MAZE_DATA, MazeTile } from './mazeData';

describe('PacMan Collision and Environment', () => {
    let pacman: PacMan;

    beforeEach(() => {
        // Typical starting position
        pacman = new PacMan(14 * TILE_SIZE, 23 * TILE_SIZE);
    });

    it('should stop at walls', () => {
        // Put a wall in front of Pac-Man
        const maze: MazeTile[][] = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
        maze[23][13] = MazeTile.WALL; // Wall to the left
        
        pacman.setDirection(Direction.LEFT);
        pacman.update(1, maze);
        
        expect(pacman.x).toBe(14 * TILE_SIZE);
    });

    it('should wrap around tunnels', () => {
        // Left tunnel exit is at row 17, col 0. 
        // Position it just before the threshold (-TILE_SIZE/2 = -4)
        pacman.x = -3;
        pacman.y = 17 * TILE_SIZE;
        pacman.setDirection(Direction.LEFT);
        
        const maze: MazeTile[][] = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
        
        pacman.update(1, maze);
        expect(pacman.x).toBeGreaterThan(27 * TILE_SIZE);
    });

    it('should buffer direction (pre-turn)', () => {
        pacman.setNextDirection(Direction.UP);
        expect(pacman.nextDirection).toBe(Direction.UP);
    });
});