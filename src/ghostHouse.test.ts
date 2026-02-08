import { describe, it, expect, beforeEach } from 'vitest';
import { GhostHouseManager } from './ghostHouseManager';

describe('Ghost House Exit Logic', () => {
    let manager: GhostHouseManager;

    beforeEach(() => {
        manager = new GhostHouseManager();
    });

    it('should allow Pinky to leave immediately on Level 1', () => {
        manager.setLevel(1);
        manager.updateDots(0);
        expect(manager.shouldReleaseGhost(1)).toBe(true); // Pinky index 1
    });

    it('should release Inky after 30 dots on Level 1', () => {
        manager.setLevel(1);
        manager.updateDots(29);
        expect(manager.shouldReleaseGhost(2)).toBe(false); // Inky index 2
        manager.updateDots(30);
        expect(manager.shouldReleaseGhost(2)).toBe(true);
    });

    it('should release Clyde after 60 dots on Level 1', () => {
        manager.setLevel(1);
        for (let i = 0; i < 59; i++) manager.updateDots(i + 1);
        expect(manager.shouldReleaseGhost(3)).toBe(false); // Clyde index 3
        manager.updateDots(60);
        expect(manager.shouldReleaseGhost(3)).toBe(true);
    });

    it('should use global counter after life loss', () => {
        manager.setLevel(1);
        manager.resetForNewLife();
        
        for (let i = 0; i < 6; i++) manager.updateDots(i + 1);
        expect(manager.shouldReleaseGhost(1)).toBe(false); // Pinky
        manager.updateDots(7);
        expect(manager.shouldReleaseGhost(1)).toBe(true);
        
        for (let i = 0; i < 9; i++) manager.updateDots(i + 8); // 7 + 10 = 17
        expect(manager.shouldReleaseGhost(2)).toBe(false); // Inky
        manager.updateDots(17);
        expect(manager.shouldReleaseGhost(2)).toBe(true);
    });
});
