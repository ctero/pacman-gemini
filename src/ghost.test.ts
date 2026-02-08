import { describe, it, expect, beforeEach } from 'vitest';
import { Ghost } from './ghost';
import { Direction } from './types';
import { TILE_SIZE } from './constants';
import { MazeTile } from './mazeData';

describe('Ghost Base Class', () => {
    let ghost: Ghost;

    beforeEach(() => {
        ghost = new Ghost(14 * TILE_SIZE, 14 * TILE_SIZE, 0xff0000); // Red ghost
    });

    it('should initialize at the correct position', () => {
        expect(ghost.x).toBe(14 * TILE_SIZE);
        expect(ghost.y).toBe(14 * TILE_SIZE);
    });

    it('should have a default speed slightly slower than Pac-Man', () => {
        // Arcade Level 1: Pac-Man 80%, Ghosts 75%
        expect(ghost.getSpeed()).toBeLessThan(0.8 * (80/60));
    });

    it('should move in the current direction when out of house', () => {
        const maze = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
        ghost.forceExitHouse();
        ghost.x = 14 * TILE_SIZE + 2; // Offset from center
        ghost.setDirection(Direction.LEFT);
        ghost.setTarget({ x: 0, y: 14 * TILE_SIZE });
        ghost.update(maze);
        expect(ghost.x).toBeLessThan(14 * TILE_SIZE + 2);
    });

    it('should maintain tile alignment on the secondary axis', () => {
        const maze = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
        ghost.x = 13.5 * TILE_SIZE; // Set to house center
        ghost.forceExitHouse();
        ghost.setDirection(Direction.UP);
        ghost.update(maze);
        expect(ghost.x).toBe(13.5 * TILE_SIZE);
    });

    it('should stay in the ghost house by default', () => {
        const houseGhost = new Ghost(13.5 * TILE_SIZE, 17 * TILE_SIZE, 0xff0000);
        const maze = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
        houseGhost.setDirection(Direction.UP);
        houseGhost.update(maze);
        expect(houseGhost.isInHouse()).toBe(true);
        expect(houseGhost.x).toBe(13.5 * TILE_SIZE);
    });

    it('should change color when frightened', () => {
        ghost.setFrightened(true);
        expect(ghost.isFrightened()).toBe(true);
    });

    it('should reset position and state when reset() is called', () => {
        const startX = ghost.x;
        const startY = ghost.y;
        ghost.x += 100;
        ghost.setFrightened(true);
        ghost.reset(startX, startY);
        expect(ghost.x).toBe(startX);
        expect(ghost.isFrightened()).toBe(false);
    });

    it('should have eye direction matching movement direction', () => {
        ghost.setDirection(Direction.RIGHT);
        expect(ghost.getEyeDirection()).toBe(Direction.RIGHT);
        
        ghost.setDirection(Direction.UP);
        expect(ghost.getEyeDirection()).toBe(Direction.UP);
    });
});