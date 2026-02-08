import { describe, it, expect } from 'vitest';
import { getArcadeLevelData } from './arcadeData';

describe('Arcade Data Tables', () => {
    it('should return correct data for Level 1', () => {
        const data = getArcadeLevelData(1);
        expect(data.pacmanSpeed).toBe(0.80);
        expect(data.ghostSpeed).toBe(0.75);
        expect(data.frightenedDuration).toBe(6); // seconds
        expect(data.elroy1Dots).toBe(20);
        expect(data.elroy2Dots).toBe(10);
    });

    it('should return correct data for Level 5', () => {
        const data = getArcadeLevelData(5);
        expect(data.pacmanSpeed).toBe(1.00);
        expect(data.ghostSpeed).toBe(0.95);
        expect(data.frightenedDuration).toBe(2);
        expect(data.elroy1Dots).toBe(40);
        expect(data.elroy2Dots).toBe(20);
    });

    it('should return correct data for Level 21+', () => {
        const data = getArcadeLevelData(21);
        expect(data.pacmanSpeed).toBe(0.90);
        expect(data.ghostSpeed).toBe(0.95);
        expect(data.frightenedDuration).toBe(0);
        expect(data.elroy1Dots).toBe(60);
        expect(data.elroy2Dots).toBe(30);
    });
});
