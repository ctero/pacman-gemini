import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioManager } from './audioManager';

// Mock Howler
vi.mock('howler', () => {
    return {
        Howl: vi.fn().mockImplementation(() => ({
            play: vi.fn().mockReturnValue(1),
            stop: vi.fn(),
            loop: vi.fn(),
            volume: vi.fn(),
            state: vi.fn().mockReturnValue('loaded'),
        })),
    };
});

describe('AudioManager', () => {
    let audioManager: AudioManager;

    beforeEach(() => {
        audioManager = new AudioManager();
    });

    it('should initialize with sound definitions', () => {
        expect(audioManager).toBeDefined();
    });

    it('should be able to play a sound', () => {
        const id = audioManager.play('intro');
        expect(id).toBeDefined();
    });

    it('should track playing loops', () => {
        audioManager.play('siren', true);
        expect(audioManager.isPlaying('siren')).toBe(true);
        audioManager.stop('siren');
        expect(audioManager.isPlaying('siren')).toBe(false);
    });
});
