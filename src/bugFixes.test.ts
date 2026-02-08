import { describe, it, expect, beforeEach } from 'vitest';
import { PacMan } from './pacman';
import { Ghost } from './ghost';
import { Direction } from './types';
import { TILE_SIZE } from './constants';
import { MazeTile } from './mazeData';

describe('Tunnel and House Exit Bugs', () => {
    let maze: MazeTile[][];

    beforeEach(() => {
        maze = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
    });

    it('should prevent Pac-Man from moving vertically in warp tunnels', () => {
        const pacman = new PacMan(-2 * TILE_SIZE, 17 * TILE_SIZE);
        pacman.setDirection(Direction.LEFT);
        
        // Try to move UP
        pacman.setNextDirection(Direction.UP);
        pacman.update(1, maze);
        
        // Direction should NOT change to UP because canMove should return false for UP in tunnel
        expect(pacman.direction).not.toBe(Direction.UP);
    });

    it('should prevent Ghost from moving vertically in warp tunnels', () => {
        const ghost = new Ghost(-2 * TILE_SIZE, 17 * TILE_SIZE, 0xff0000);
        ghost.forceExitHouse();
        ghost.setDirection(Direction.LEFT);
        
        // Since Ghost chooses direction at tile center, we need to be careful with positioning.
        // But canMove is checked by chooseNextDirection.
        // Actually Ghost.update calls chooseNextDirection which calls canMove.
        
        // We'll check canMove directly via a protected method or just observe behavior.
        // Since Ghost.canMove is private, we'll check it via chooseRandomDirection or similar if possible.
        // For now, let's assume if we set target UP, it won't go UP.
        ghost.setTarget({ x: -2 * TILE_SIZE, y: 0 });
        ghost.update(maze);
        
        expect(ghost.direction).not.toBe(Direction.UP);
    });

    it('should follow exit path for ghosts leaving the house', () => {
        // Clyde starts at 15.5
        const ghost = new Ghost(15.5 * TILE_SIZE, 17 * TILE_SIZE, 0xffb852);
        ghost.forceExitHouse();
        
        // Step 0: Move to center (13.5)
        ghost.update(maze); 
        expect(ghost.x).toBeLessThan(15.5 * TILE_SIZE);
        expect(ghost.direction).toBe(Direction.LEFT);
        
        // Fast forward to center
        while (ghost.x > 13.5 * TILE_SIZE) {
            ghost.update(maze);
        }
        expect(ghost.x).toBe(13.5 * TILE_SIZE);
        
        // Step 1: Move to exit (y=14)
        ghost.update(maze);
        expect(ghost.direction).toBe(Direction.UP);
        expect(ghost.y).toBeLessThan(17 * TILE_SIZE);
        
        while (ghost.y > 14 * TILE_SIZE) {
            ghost.update(maze);
        }
        expect(ghost.y).toBe(14 * TILE_SIZE);
        
        // Step 2: Normal AI starts
        ghost.update(maze);
        // Normal AI should have taken over. Default first move in handleExit was LEFT.
        expect(ghost.direction).toBe(Direction.LEFT);
    });
});
