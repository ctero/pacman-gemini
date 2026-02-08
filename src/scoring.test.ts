import { describe, it, expect, beforeEach } from 'vitest';
import { ScoringEngine } from './scoring';

describe('ScoringEngine', () => {
    let engine: ScoringEngine;

    beforeEach(() => {
        engine = new ScoringEngine();
    });

    it('should start with a score of 0', () => {
        expect(engine.getScore()).toBe(0);
    });

    it('should add 10 points for a dot', () => {
        engine.addDot();
        expect(engine.getScore()).toBe(10);
    });

    it('should add 50 points for a power pellet', () => {
        engine.addPowerPellet();
        expect(engine.getScore()).toBe(50);
    });

    it('should add 200, 400, 800, 1600 points for consecutive ghosts', () => {
        engine.addGhost();
        expect(engine.getScore()).toBe(200);
        engine.addGhost();
        expect(engine.getScore()).toBe(600); // 200 + 400
        engine.addGhost();
        expect(engine.getScore()).toBe(1400); // 600 + 800
        engine.addGhost();
        expect(engine.getScore()).toBe(3000); // 1400 + 1600
    });

    it('should reset ghost multiplier when frightened mode is restarted', () => {
        engine.addGhost();
        engine.resetGhostMultiplier();
        engine.addGhost();
        expect(engine.getScore()).toBe(400); // 200 + 200
    });

    it('should track and update high score', () => {
        engine.addPowerPellet(); // 50
        engine.updateHighScore();
        expect(engine.getHighScore()).toBe(50);
        
        const newEngine = new ScoringEngine();
        // Since we don't have persistence yet, high score is per session or handled by a manager.
        // For now let's assume the engine instance can handle it or we test the logic.
    });
});
