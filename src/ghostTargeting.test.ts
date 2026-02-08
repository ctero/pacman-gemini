import { describe, it, expect } from 'vitest';
import { getBlinkyTarget, getPinkyTarget, getInkyTarget, getClydeTarget } from './ghostTargeting';
import { Direction, Point } from './types';
import { TILE_SIZE } from './constants';

describe('Ghost Targeting Logic', () => {
    const pacmanPos: Point = { x: 14 * TILE_SIZE, y: 17 * TILE_SIZE };

    it('Blinky should target Pac-Man directly', () => {
        const target = getBlinkyTarget(pacmanPos);
        expect(target).toEqual(pacmanPos);
    });

    it('Pinky should target 4 tiles ahead of Pac-Man (with UP bug)', () => {
        const targetRight = getPinkyTarget(pacmanPos, Direction.RIGHT);
        expect(targetRight.x).toBe(pacmanPos.x + 32);
        expect(targetRight.y).toBe(pacmanPos.y);

        const targetUp = getPinkyTarget(pacmanPos, Direction.UP);
        expect(targetUp.y).toBe(pacmanPos.y - 32);
        expect(targetUp.x).toBe(pacmanPos.x - 32); // The bug
    });

    it('Inky should use Blinky and Pac-Man to target', () => {
        const blinkyPos: Point = { x: 10 * TILE_SIZE, y: 10 * TILE_SIZE };
        // Pacman at (112, 136) facing Right. 
        // Pivot (2 tiles ahead) is (112 + 16, 136) = (128, 136)
        // Vector Blinky(80, 80) to Pivot(128, 136) is (48, 56)
        // Double vector from Blinky is (80 + 96, 80 + 112) = (176, 192)
        const target = getInkyTarget(pacmanPos, Direction.RIGHT, blinkyPos);
        expect(target.x).toBe(176);
        expect(target.y).toBe(192);
    });

    it('Clyde should target Pac-Man if far, and his corner if near', () => {
        const clydeFar: Point = { x: 0, y: 0 };
        const targetFar = getClydeTarget(clydeFar, pacmanPos);
        expect(targetFar).toEqual(pacmanPos);

        const clydeNear: Point = { x: 13 * TILE_SIZE, y: 17 * TILE_SIZE };
        const targetNear = getClydeTarget(clydeNear, pacmanPos);
        // Clyde's corner is bottom-left (0, 35 * TILE_SIZE)
        expect(targetNear.x).toBe(0);
        expect(targetNear.y).toBe(35 * TILE_SIZE);
    });
});
