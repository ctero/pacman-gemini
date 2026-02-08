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
        ghost.setDirection(Direction.LEFT);
        ghost.update();
        expect(ghost.x).toBeLessThan(14 * TILE_SIZE);
    });

    it('should maintain tile alignment on the secondary axis', () => {
        ghost.setDirection(Direction.UP);
        ghost.update();
        expect(ghost.x).toBe(14 * TILE_SIZE);
    });

    it('should stay in the ghost house if houseTimer is positive', () => {
        ghost.setHouseTimer(100);
        ghost.setDirection(Direction.UP);
        ghost.update();
        // Should not have moved significantly if logic prevents exiting
        expect(ghost.isInHouse()).toBe(true);
    });

    it('should count down the house timer during updates', () => {
        ghost.setHouseTimer(10);
        ghost.update();
        expect(ghost.getHouseTimer()).toBeLessThan(10);
    });
});
