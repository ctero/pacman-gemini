import { describe, it, expect } from 'vitest';
import { getFruitDataForLevel, FruitType } from './fruit';

describe('Fruit Data Mapping', () => {
    it('should return correct fruit for level 1', () => {
        const data = getFruitDataForLevel(1);
        expect(data.type).toBe(FruitType.CHERRY);
        expect(data.points).toBe(100);
    });

    it('should return correct fruit for level 2', () => {
        const data = getFruitDataForLevel(2);
        expect(data.type).toBe(FruitType.STRAWBERRY);
        expect(data.points).toBe(300);
    });

    it('should return correct fruit for level 3 and 4', () => {
        expect(getFruitDataForLevel(3).type).toBe(FruitType.PEACH);
        expect(getFruitDataForLevel(4).type).toBe(FruitType.PEACH);
    });

    it('should return correct fruit for level 5 and 6', () => {
        expect(getFruitDataForLevel(5).type).toBe(FruitType.APPLE);
        expect(getFruitDataForLevel(6).type).toBe(FruitType.APPLE);
    });

    it('should return correct fruit for levels 13 and above', () => {
        expect(getFruitDataForLevel(13).type).toBe(FruitType.KEY);
        expect(getFruitDataForLevel(255).type).toBe(FruitType.KEY);
    });
});
