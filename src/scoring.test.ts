import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScoringEngine } from './scoring';

describe('ScoringEngine', () => {
    let engine: ScoringEngine;

    beforeEach(() => {
        // Mock localStorage
        const localStorageMock = (() => {
            let store: { [key: string]: string } = {};
            return {
                getItem: (key: string) => store[key] || null,
                setItem: (key: string, value: string) => { store[key] = value.toString(); },
                clear: () => { store = {}; },
                removeItem: (key: string) => { delete store[key]; }
            };
        })();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

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

    it('should reset dotsEaten on resetDotsEaten', () => {
        engine.addDot();
        expect(engine.getDotsEaten()).toBe(1);
        engine.resetDotsEaten();
        expect(engine.getDotsEaten()).toBe(0);
    });

    it('should add points for fruit', () => {
        engine.addFruit(100);
        expect(engine.getScore()).toBe(100);
        engine.addFruit(500);
        expect(engine.getScore()).toBe(600);
    });

    describe('Persistence', () => {
        beforeEach(() => {
            localStorage.clear();
            // @ts-ignore - access private static for test reset
            ScoringEngine.highScore = 0;
        });

        it('should load high score from localStorage', () => {
            localStorage.setItem('pacman_highscore', '5000');
            engine.loadHighScore();
            expect(engine.getHighScore()).toBe(5000);
        });

        it('should save high score to localStorage', () => {
            engine.addFruit(1000);
            engine.updateHighScore();
            engine.saveHighScore();
            expect(localStorage.getItem('pacman_highscore')).toBe('1000');
        });

        it('should default to 0 if no high score in localStorage', () => {
            engine.loadHighScore();
            expect(engine.getHighScore()).toBe(0);
        });
    });
});
