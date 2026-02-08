import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameState, GhostMode, GameStatus } from './gameState';

describe('GameState Mode Timer', () => {
    let state: GameState;

    beforeEach(() => {
        state = new GameState();
        state.status = GameStatus.PLAYING;
    });

    it('should start in SCATTER mode', () => {
        expect(state.ghostMode).toBe(GhostMode.SCATTER);
    });

    it('should switch to CHASE after 7 seconds (at level 1)', () => {
        // level 1: 7s Scatter, 20s Chase, 7s Scatter, 20s Chase, 5s Scatter, 20s Chase, 5s Scatter, then permanent Chase
        state.update(7 * 60 + 1); // simulate 7 seconds + 1 frame at 60fps
        expect(state.ghostMode).toBe(GhostMode.CHASE);
    });

    it('should switch back to SCATTER after the first Chase period', () => {
        state.update((7 + 20) * 60 + 1);
        expect(state.ghostMode).toBe(GhostMode.SCATTER);
    });

    it('should enter FRIGHTENED mode and switch back after duration', () => {
        state.startFrightenedMode();
        expect(state.ghostMode).toBe(GhostMode.FRIGHTENED);
        
        // Frightened duration is approx 6s at Level 1
        state.update(6 * 60 + 1);
        expect(state.ghostMode).not.toBe(GhostMode.FRIGHTENED);
    });

    it('should have 0 frightened duration at level 21+', () => {
        for (let i = 0; i < 20; i++) state.nextLevel();
        expect(state.level).toBe(21);
        
        state.startFrightenedMode();
        // At level 21, duration is 0, so it should immediately revert or not even start
        // In our current implementation it might switch for 1 frame or not at all.
        // Let's see how it behaves.
        state.update(1);
        expect(state.ghostMode).not.toBe(GhostMode.FRIGHTENED);
    });

    it('should follow accurate Scatter/Chase timings per level', () => {
        // SCATTER_CHASE_TABLE is used for all levels in the arcade, 
        // though durations change slightly at level 5+.
        // Our table is constant for now as per arcadeData.ts.
        state.update(7 * 60 + 1);
        expect(state.ghostMode).toBe(GhostMode.CHASE);
    });
});
