import { describe, it, expect, beforeEach } from 'vitest';
import { Ghost } from './ghost';
import { GhostState } from './types';
import { TILE_SIZE } from './constants';
import { MazeTile } from './mazeData';

describe('Ghost Regeneration Bug', () => {
    let inky: Ghost;
    let maze: MazeTile[][];

    beforeEach(() => {
        // Inky home is at (11.5, 17)
        inky = new Ghost(11.5 * TILE_SIZE, 17 * TILE_SIZE, 0x00ffff);
        maze = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
    });

    it('Inky should transition from ENTERING_HOUSE to REGENERATING after reaching home position', () => {
        inky.setEaten();
        // Position at entrance
        inky.x = 13.5 * TILE_SIZE;
        inky.y = 14 * TILE_SIZE;
        
        // This should trigger transition to ENTERING_HOUSE in the next update
        inky.update(maze);
        expect(inky.getState()).toBe(GhostState.ENTERING_HOUSE);

        // Run many updates to allow it to reach home
        // It needs to move from y=14 to y=17, then from x=13.5 to x=11.5
        for (let i = 0; i < 200; i++) {
            inky.update(maze);
            if (inky.getState() === GhostState.REGENERATING) break;
        }

        expect(inky.getState()).toBe(GhostState.REGENERATING);
    });
});
