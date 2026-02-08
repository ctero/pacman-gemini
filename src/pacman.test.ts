import { describe, it, expect, beforeEach } from 'vitest';
import { PacMan } from './pacman';
import { Direction } from './types';
import { TILE_SIZE } from './constants';
import { MazeTile } from './mazeData';

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
        
        // Should snap to 14 * TILE_SIZE because the move was blocked
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

    it('should have the correct rotation for each direction', () => {
        pacman.setDirection(Direction.RIGHT);
        expect(pacman.getRotation()).toBe(0);

        pacman.setDirection(Direction.DOWN);
        expect(pacman.getRotation()).toBe(Math.PI / 2);

        pacman.setDirection(Direction.LEFT);
        expect(pacman.getRotation()).toBe(Math.PI);

        pacman.setDirection(Direction.UP);
        expect(pacman.getRotation()).toBe(-Math.PI / 2);
    });

    it('should reverse immediately without waiting for tile alignment', () => {
        const maze: MazeTile[][] = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
        pacman.x = 10 * TILE_SIZE + 4; // Middle of tile 10
        pacman.y = 10 * TILE_SIZE;
        pacman.setDirection(Direction.RIGHT);
        pacman.setNextDirection(Direction.LEFT);
        
        pacman.update(1, maze);
        
        expect(pacman.direction).toBe(Direction.LEFT);
        expect(pacman.x).toBeLessThan(10 * TILE_SIZE + 4);
    });

    it('should turn as soon as the path is clear (buffering)', () => {
        const maze: MazeTile[][] = Array(36).fill(null).map(() => Array(28).fill(MazeTile.WALL));
        // Corridor: (5,10) to (15,10). Turn UP at (10,10).
        for (let x = 5; x <= 15; x++) maze[10][x] = MazeTile.EMPTY;
        maze[9][10] = MazeTile.EMPTY;
        
        pacman.x = 8 * TILE_SIZE;
        pacman.y = 10 * TILE_SIZE;
        pacman.setDirection(Direction.RIGHT);
        pacman.setNextDirection(Direction.UP);
        
        // Move towards intersection
        let turned = false;
        for (let i = 0; i < 30; i++) {
            pacman.update(1, maze);
            if (pacman.direction === Direction.UP) {
                turned = true;
                break;
            }
        }
        
        expect(turned).toBe(true);
        // Should be at or near x=80 (10*8)
        expect(pacman.x).toBe(10 * TILE_SIZE);
    });

    it('should turn immediately when hitting a wall if a valid nextDirection is buffered', () => {
        const maze: MazeTile[][] = Array(36).fill(null).map(() => Array(28).fill(MazeTile.WALL));
        // Corridor: (10,10) to (11,10). Wall at (12,10). Turn UP at (11,10).
        maze[10][10] = MazeTile.EMPTY;
        maze[10][11] = MazeTile.EMPTY;
        maze[9][11] = MazeTile.EMPTY;
        
        pacman.x = 10 * TILE_SIZE + 4;
        pacman.y = 10 * TILE_SIZE;
        pacman.setDirection(Direction.RIGHT);
        pacman.setNextDirection(Direction.UP);
        
        // Move until he hits the wall or turns
        for (let i = 0; i < 15; i++) {
            pacman.update(1, maze);
        }
        
        expect(pacman.direction).toBe(Direction.UP);
        expect(pacman.y).toBeLessThan(10 * TILE_SIZE);
    });

    it('REPRO: should not stop before a turn when buffering', () => {
        // Corridor from (5, 10) to (10, 10). Turn UP at (10, 10). Wall at (11, 10).
        const maze: MazeTile[][] = Array(36).fill(null).map(() => Array(28).fill(MazeTile.WALL));
        for (let x = 5; x <= 10; x++) maze[10][x] = MazeTile.EMPTY;
        maze[9][10] = MazeTile.EMPTY; // The turn UP
        
        pacman.x = 8 * TILE_SIZE;
        pacman.y = 10 * TILE_SIZE;
        pacman.setDirection(Direction.RIGHT);
        pacman.setNextDirection(Direction.UP);
        
        let lastX = pacman.x;
        let turned = false;
        for (let i = 0; i < 30; i++) {
            pacman.update(1, maze);
            if (pacman.direction === Direction.UP) {
                turned = true;
                break;
            }
            // If he is still moving RIGHT, he should have progressed
            if (pacman.x <= lastX) {
                throw new Error(`Pac-Man stopped at x=${pacman.x} (tile ${pacman.x/TILE_SIZE}) before turning. lastX was ${lastX}`);
            }
            lastX = pacman.x;
        }
        expect(turned).toBe(true);
    });
});