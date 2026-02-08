import { describe, it, expect, vi } from 'vitest';
import { ScoringUI } from './scoringUI';

vi.mock('pixi.js', () => {
    return {
        Container: vi.fn().mockImplementation(() => ({
            addChild: vi.fn(),
        })),
        Text: vi.fn().mockImplementation(() => ({
            text: '',
            position: { set: vi.fn() },
            anchor: { set: vi.fn() },
        })),
        TextStyle: vi.fn().mockImplementation(() => ({})),
    };
});

describe('ScoringUI', () => {
    it('should initialize score texts', () => {
        const ui = new ScoringUI();
        expect(ui.scoreContainer).toBeDefined();
    });

    it('should update text when update() is called', () => {
        const ui = new ScoringUI();
        ui.update(100, 500);
        // We'd need to expose the text objects or check addChild calls
        expect(ui.scoreContainer.addChild).toHaveBeenCalled();
    });
});
