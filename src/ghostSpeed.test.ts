import { describe, it, expect, beforeEach } from 'vitest';
import { Ghost } from './ghost';
import { Direction } from './types';
import { TILE_SIZE } from './constants';
import { MazeTile } from './mazeData';

describe('Ghost Speed Logic', () => {
    let ghost: Ghost;
    let maze: MazeTile[][];

    beforeEach(() => {
        ghost = new Ghost(14 * TILE_SIZE, 14 * TILE_SIZE, 0xff0000);
        maze = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));
        ghost.setHouseTimer(0); // Exit house
    });

    it('should use base speed when normal', () => {
        ghost.setSpeeds({ base: 1.0, frightened: 0.5, tunnel: 0.4 });
        ghost.setDirection(Direction.RIGHT);
        ghost.setTarget({ x: 1000, y: 14 * TILE_SIZE });
        const initialX = ghost.x;
        ghost.update(maze);
        expect(ghost.x).toBe(initialX + 1.0);
    });

    it('should use frightened speed when frightened', () => {
        ghost.setSpeeds({ base: 1.0, frightened: 0.5, tunnel: 0.4 });
        ghost.setFrightened(true);
        // Frightened chooses random direction, so we just check IF it moved by 0.5
        const initialX = ghost.x;
        const initialY = ghost.y;
        ghost.update(maze);
        const dist = Math.sqrt(Math.pow(ghost.x - initialX, 2) + Math.pow(ghost.y - initialY, 2));
        expect(dist).toBeCloseTo(0.5);
    });

    it('should use tunnel speed when in tunnel', () => {
        ghost.setSpeeds({ base: 1.0, frightened: 0.5, tunnel: 0.4 });
        // Tunnel is at row 17, cols 0-5 and 22-27
        ghost.x = 2 * TILE_SIZE;
        ghost.y = 17 * TILE_SIZE;
        ghost.setDirection(Direction.RIGHT);
        ghost.setTarget({ x: 1000, y: 17 * TILE_SIZE });
        const initialX = ghost.x;
        ghost.update(maze);
        expect(ghost.x).toBe(initialX + 0.4);
    });

    it('should use Cruise Elroy speed when enabled (Blinky only)', () => {
        ghost.setSpeeds({ base: 1.0, frightened: 0.5, tunnel: 0.4 });
        ghost.setCruiseElroySpeed(1.2);
        ghost.setDirection(Direction.RIGHT);
        ghost.setTarget({ x: 1000, y: 14 * TILE_SIZE });
        const initialX = ghost.x;
        ghost.update(maze);
        expect(ghost.x).toBe(initialX + 1.2);
    });
});
