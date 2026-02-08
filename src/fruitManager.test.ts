import { describe, it, expect, beforeEach } from 'vitest';
import { FruitManager } from './fruitManager';

describe('FruitManager', () => {
    let fruitManager: FruitManager;

    beforeEach(() => {
        fruitManager = new FruitManager();
    });

    it('should not spawn fruit initially', () => {
        expect(fruitManager.getActiveFruit()).toBeNull();
    });

    it('should spawn fruit when dots eaten reaches 70', () => {
        fruitManager.updateDotsEaten(69);
        expect(fruitManager.getActiveFruit()).toBeNull();
        fruitManager.updateDotsEaten(70);
        expect(fruitManager.getActiveFruit()).not.toBeNull();
        expect(fruitManager.getActiveFruit()?.level).toBe(1);
    });

    it('should spawn fruit when dots eaten reaches 170', () => {
        fruitManager.updateDotsEaten(70);
        fruitManager.clearFruit(); // Simulate fruit expiring or being eaten
        
        fruitManager.updateDotsEaten(169);
        expect(fruitManager.getActiveFruit()).toBeNull();
        fruitManager.updateDotsEaten(170);
        expect(fruitManager.getActiveFruit()).not.toBeNull();
    });

    it('should not spawn fruit again for the same trigger', () => {
        fruitManager.updateDotsEaten(70);
        fruitManager.clearFruit();
        fruitManager.updateDotsEaten(71);
        expect(fruitManager.getActiveFruit()).toBeNull();
    });

    it('should expire fruit after timer ends', () => {
        fruitManager.updateDotsEaten(70);
        expect(fruitManager.getActiveFruit()).not.toBeNull();
        
        fruitManager.update(9 * 60); // 9 seconds
        expect(fruitManager.getActiveFruit()).not.toBeNull();
        
        fruitManager.update(0.5 * 60 + 1); // Exceed 9.5 seconds
        expect(fruitManager.getActiveFruit()).toBeNull();
    });

    it('should clear fruit on reset (e.g., life loss)', () => {
        fruitManager.updateDotsEaten(70);
        expect(fruitManager.getActiveFruit()).not.toBeNull();
        
        fruitManager.reset();
        expect(fruitManager.getActiveFruit()).toBeNull();
    });

    it('should detect collision when Pac-Man is at the fruit position', () => {
        fruitManager.updateDotsEaten(70);
        const fruit = fruitManager.getActiveFruit();
        expect(fruit).not.toBeNull();

        const pacmanPos = { x: 13.5 * 8, y: 20 * 8 };
        expect(fruitManager.checkCollision(pacmanPos)).toBe(true);
    });

    it('should not detect collision when Pac-Man is far away', () => {
        fruitManager.updateDotsEaten(70);
        const pacmanPos = { x: 0, y: 0 };
        expect(fruitManager.checkCollision(pacmanPos)).toBe(false);
    });

    it('should not detect collision if no fruit is active', () => {
        const pacmanPos = { x: 13.5 * 8, y: 20 * 8 };
        expect(fruitManager.checkCollision(pacmanPos)).toBe(false);
    });
});
