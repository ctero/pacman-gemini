import { describe, it, expect, beforeEach } from 'vitest';
import { Ghost } from './ghost';
import { GhostState, Direction } from './types';
import { TILE_SIZE } from './constants';

describe('Ghost State Transitions', () => {
    let ghost: Ghost;

    beforeEach(() => {
        ghost = new Ghost(13.5 * TILE_SIZE, 14 * TILE_SIZE, 0xff0000);
    });

    it('should start in NORMAL state when initialized outside house', () => {
        const activeGhost = new Ghost(13.5 * TILE_SIZE, 14 * TILE_SIZE, 0xff0000);
        expect(activeGhost.getState()).toBe(GhostState.NORMAL);
    });

    it('should transition to EATEN state when setEaten is called', () => {
        ghost.setEaten();
        expect(ghost.getState()).toBe(GhostState.EATEN);
    });

    it('should increase speed in EATEN state', () => {
        const baseSpeed = ghost.getSpeed();
        ghost.setEaten();
        expect(ghost.getSpeed()).toBeGreaterThan(baseSpeed);
    });
});
