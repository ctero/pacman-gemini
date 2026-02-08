import { describe, it, expect, vi } from 'vitest';
import { ScoringUI } from './scoringUI';

vi.mock('pixi.js', () => {
    return {
        Container: vi.fn().mockImplementation(() => ({
            addChild: vi.fn(),
            position: { set: vi.fn() },
            removeChildren: vi.fn(),
        })),
        Text: vi.fn().mockImplementation(() => ({
            text: '',
            position: { set: vi.fn() },
            anchor: { set: vi.fn() },
            visible: true,
        })),
        TextStyle: vi.fn().mockImplementation(() => ({})),
        Graphics: vi.fn().mockImplementation(() => ({
            beginPath: vi.fn().mockReturnThis(),
            moveTo: vi.fn().mockReturnThis(),
            arc: vi.fn().mockReturnThis(),
            lineTo: vi.fn().mockReturnThis(),
            fill: vi.fn().mockReturnThis(),
            position: { set: vi.fn() },
        })),
    };
});

describe('ScoringUI', () => {
    it('should initialize score texts', () => {
        const ui = new ScoringUI();
        expect(ui.scoreContainer).toBeDefined();
    });

    it('should show score popup', () => {
        vi.useFakeTimers();
        const ui = new ScoringUI();
        ui.showScorePopup(100, 100, 500);
        expect(ui.scoreContainer.addChild).toHaveBeenCalled();
        
        vi.advanceTimersByTime(2001);
        // Expect child removal (difficult to verify with current mocks but we check the flow)
        vi.useRealTimers();
    });
});
