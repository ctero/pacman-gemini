import { describe, it, expect, beforeEach } from 'vitest';
import { Ghost } from './ghost';
import { GhostState, Direction } from './types';
import { TILE_SIZE } from './constants';
import { MazeTile } from './mazeData';

describe('Ghost Entrance Fix', () => {
    let ghost: Ghost;
    let maze: MazeTile[][];

    beforeEach(() => {
        // Ghost home is at Row 17
        ghost = new Ghost(13.5 * TILE_SIZE, 17 * TILE_SIZE, 0xff0000);
        maze = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
        // Add the door at row 15, cols 13 and 14
        maze[15][13] = MazeTile.GHOST_HOUSE_DOOR;
        maze[15][14] = MazeTile.GHOST_HOUSE_DOOR;
    });

    it('should transition from EATEN to ENTERING_HOUSE when reaching (13.5, 14)', () => {
        ghost.setEaten();
        // Position it slightly away and move it towards (13.5, 14)
        ghost.x = 13.5 * TILE_SIZE;
        ghost.y = 13 * TILE_SIZE;
        ghost.setDirection(Direction.DOWN);
        
        // Update several times to reach the entrance
        for (let i = 0; i < 10; i++) {
            ghost.update(maze);
            if (ghost.getState() === GhostState.ENTERING_HOUSE) break;
        }

        expect(ghost.getState()).toBe(GhostState.ENTERING_HOUSE);
    });

    it('should be able to pass through GHOST_HOUSE_DOOR when in ENTERING_HOUSE state', () => {
        ghost.setEaten();
        ghost.x = 13.5 * TILE_SIZE;
        ghost.y = 14 * TILE_SIZE;
        
        // Force transition to ENTERING_HOUSE by updating once at the entrance
        ghost.update(maze);
        expect(ghost.getState()).toBe(GhostState.ENTERING_HOUSE);

        const initialY = ghost.y;
        // Update to move DOWN through the door
        ghost.update(maze);
        
        expect(ghost.y).toBeGreaterThan(initialY);
        expect(Math.round(ghost.y / TILE_SIZE)).toBe(14); // Still in row 14 or moving to 15
        
        // Move further until it would be hitting the door at row 15
        for (let i = 0; i < 20; i++) {
            ghost.update(maze);
        }
        
        expect(ghost.y).toBeGreaterThan(15 * TILE_SIZE);
    });
});
