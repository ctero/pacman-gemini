import { describe, it, expect } from 'vitest';
import { MAZE_WIDTH, MAZE_HEIGHT } from './constants';

describe('Project Constants', () => {
    it('should have the correct arcade dimensions', () => {
        expect(MAZE_WIDTH).toBe(224);
        expect(MAZE_HEIGHT).toBe(288);
    });
});