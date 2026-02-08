import { describe, it, expect } from 'vitest';
import { chooseNextDirection } from './ghostMovement';
import { Direction, Point } from './types';
import { MazeTile } from './mazeData';

describe('Ghost Intersection Logic', () => {
    // Empty maze for testing
    const maze: MazeTile[][] = Array(36).fill(null).map(() => Array(28).fill(MazeTile.EMPTY));

    it('should choose the direction that brings it closest to the target', () => {
        const currentPos: Point = { x: 100, y: 100 };
        const targetPos: Point = { x: 200, y: 100 }; // Target is to the right
        const currentDir = Direction.RIGHT;
        
        // At an intersection, can go UP, DOWN, or RIGHT (cannot go back LEFT)
        const nextDir = chooseNextDirection(currentPos, currentDir, targetPos, maze);
        expect(nextDir).toBe(Direction.RIGHT);
    });

    it('should not allow vertical movement in tunnels', () => {
        const currentPos: Point = { x: -8, y: 17 * 8 }; // In left tunnel
        const targetPos: Point = { x: -8, y: 0 }; // Target is UP
        const currentDir = Direction.LEFT;
        
        const nextDir = chooseNextDirection(currentPos, currentDir, targetPos, maze);
        expect(nextDir).not.toBe(Direction.UP);
        expect(nextDir).not.toBe(Direction.DOWN);
    });
});
