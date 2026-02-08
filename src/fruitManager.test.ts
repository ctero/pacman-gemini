import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FruitManager } from './fruitManager';
import { FruitType } from './fruit';

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
});
