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

    it('should indicate flashing when frightened timer is low', () => {
        state.startFrightenedMode();
        expect(state.isFlashing()).toBe(false);
        
        // Timer starts at 360 frames. Flashing usually starts last 2s (120 frames).
        state.update(241); // 360 - 241 = 119
        expect(state.isFlashing()).toBe(true);
    });
});
