import { describe, it, expect, beforeEach } from 'vitest';
import { ScoringEngine } from './scoring';
import { GameState, GameStatus } from './gameState';

describe('High Score Persistence Integration', () => {
    let scoringEngine: ScoringEngine;
    let gameState: GameState;

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
        
        // Reset static high score
        // @ts-ignore
        ScoringEngine.highScore = 0;

        scoringEngine = new ScoringEngine();
        gameState = new GameState();
    });

    it('should persist high score when lives reach 0', () => {
        scoringEngine.addFruit(5000);
        scoringEngine.updateHighScore();
        
        // Simulate lose life until game over
        gameState.loseLife(); // 2
        gameState.loseLife(); // 1
        gameState.loseLife(); // 0 -> GAME_OVER
        
        expect(gameState.status).toBe(GameStatus.GAME_OVER);
        
        // In main.ts logic: if status is GAME_OVER, we call saveHighScore
        scoringEngine.saveHighScore();
        
        expect(localStorage.getItem('pacman_highscore')).toBe('5000');
    });

    it('should load previously saved high score on new game session', () => {
        localStorage.setItem('pacman_highscore', '9999');
        const newEngine = new ScoringEngine();
        expect(newEngine.getHighScore()).toBe(9999);
    });
});
