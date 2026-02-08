import { describe, it, expect, beforeEach } from 'vitest';
import { Ghost } from './ghost';
import { Direction } from './types';
import { TILE_SIZE } from './constants';

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
        // Pac-Man is 2.0 in our prototype, ghosts are usually slightly slower
        expect(ghost.speed).toBeLessThan(2.0);
    });

    it('should move in the current direction', () => {
        const maze = Array(36).fill(null).map(() => Array(28).fill(2)); // Empty path
        ghost.x = 14 * TILE_SIZE + 2; // Offset from center
        ghost.setDirection(Direction.LEFT);
        ghost.update(maze);
        expect(ghost.x).toBeLessThan(14 * TILE_SIZE + 2);
    });

    it('should maintain tile alignment on the secondary axis', () => {
        const maze = Array(36).fill(null).map(() => Array(28).fill(2)); // Empty path
        ghost.setDirection(Direction.UP);
        ghost.update(maze);
        expect(ghost.x).toBe(14 * TILE_SIZE);
    });

    it('should stay in the ghost house if houseTimer is positive', () => {
        const maze = Array(36).fill(null).map(() => Array(28).fill(2)); // Empty path
        ghost.setHouseTimer(100);
        ghost.setDirection(Direction.UP);
        ghost.update(maze);
        // Should not have moved significantly if logic prevents exiting
        expect(ghost.isInHouse()).toBe(true);
    });

    it('should count down the house timer during updates', () => {
        const maze = Array(36).fill(null).map(() => Array(28).fill(2)); // Empty path
        ghost.setHouseTimer(10);
        ghost.update(maze);
        expect(ghost.getHouseTimer()).toBeLessThan(10);
    });

    it('should change color when frightened', () => {
        ghost.setFrightened(true);
        // This is a bit indirect as we'd need to check graphics, 
        // but we can at least check a property if we add one.
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
