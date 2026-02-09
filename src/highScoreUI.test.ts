import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScoringEngine } from './scoring';
import { ScoringUI } from './scoringUI';

// Mock PIXI.js to avoid WebGL/Canvas issues in tests
vi.mock('pixi.js', () => {
    return {
        Container: class {
            addChild = vi.fn();
            removeChildren = vi.fn();
            position = { set: vi.fn() };
        },
        Text: class {
            text = '';
            position = { set: vi.fn() };
            anchor = { set: vi.fn() };
            visible = true;
        },
        TextStyle: class {},
        Graphics: class {
            beginPath = vi.fn();
            moveTo = vi.fn();
            arc = vi.fn();
            lineTo = vi.fn();
            fill = vi.fn();
            position = { set: vi.fn() };
        }
    };
});

describe('Scoring UI and Real-time Updates', () => {
    let scoringEngine: ScoringEngine;
    let scoringUI: ScoringUI;

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
        scoringUI = new ScoringUI();
    });

    it('should update high score in UI when current score exceeds it', () => {
        // Initial state
        expect(scoringEngine.getHighScore()).toBe(0);
        
        // Add points
        scoringEngine.addDot(); // 10
        scoringEngine.updateHighScore();
        
        expect(scoringEngine.getHighScore()).toBe(10);
        
        // Trigger UI update
        scoringUI.update(scoringEngine.getScore(), scoringEngine.getHighScore(), 3);
        
        // @ts-ignore - access private field for verification
        expect(scoringUI.highScoreText.text).toBe('10');
    });

    it('should display loaded high score correctly at startup', () => {
        localStorage.setItem('pacman_highscore', '1234');
        const engine = new ScoringEngine();
        const ui = new ScoringUI();
        
        ui.update(engine.getScore(), engine.getHighScore(), 3);
        
        // @ts-ignore
        expect(ui.highScoreText.text).toBe('1234');
    });
});
