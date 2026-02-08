import { describe, it, expect } from 'vitest';
import { checkCollision } from './collision';
import { PacMan } from './pacman';
import { Ghost } from './ghost';

describe('Pac-Man and Ghost Collision', () => {
    it('should detect collision when overlapping', () => {
        const pacman = new PacMan(100, 100);
        const ghost = new Ghost(102, 102, 0xff0000);
        expect(checkCollision(pacman, ghost)).toBe(true);
    });

    it('should not detect collision when far apart', () => {
        const pacman = new PacMan(100, 100);
        const ghost = new Ghost(200, 200, 0xff0000);
        expect(checkCollision(pacman, ghost)).toBe(false);
    });
});
