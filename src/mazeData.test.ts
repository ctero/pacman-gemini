import { describe, it, expect } from 'vitest';
import { MAZE_DATA, MazeTile } from './mazeData';

describe('Maze Data', () => {
    it('should have the correct arcade dimensions (28x36 tiles)', () => {
        expect(MAZE_DATA.length).toBe(36);
        MAZE_DATA.forEach(row => {
            expect(row.length).toBe(28);
        });
    });

    it('should contain walls, dots, and power pellets', () => {
        const flatData = MAZE_DATA.flat();
        expect(flatData).toContain(MazeTile.WALL);
        expect(flatData).toContain(MazeTile.DOT);
        expect(flatData).toContain(MazeTile.POWER_PELLET);
    });

    it('should have a symmetric layout (left-right)', () => {
        MAZE_DATA.forEach(row => {
            for (let i = 0; i < 14; i++) {
                // Tunnel might be an exception if we represent it differently, 
                // but usually the layout is perfectly symmetric.
                expect(row[i]).toBe(row[27 - i]);
            }
        });
    });
});
