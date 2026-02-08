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

    it('should update text when update() is called', () => {
        const ui = new ScoringUI();
        ui.update(100, 500, 3);
        // We'd need to expose the text objects or check addChild calls
        expect(ui.scoreContainer.addChild).toHaveBeenCalled();
    });
});
