import { describe, it, expect, beforeEach } from 'vitest';
import { GameState, GameStatus } from './gameState';

describe('Life Management', () => {
    let state: GameState;

    beforeEach(() => {
        state = new GameState();
    });

    it('should start with 3 lives', () => {
        expect(state.lives).toBe(3);
    });

    it('should decrement lives', () => {
        state.loseLife();
        expect(state.lives).toBe(2);
    });

    it('should set status to GAME_OVER when lives reach zero', () => {
        state.loseLife();
        state.loseLife();
        state.loseLife();
        expect(state.lives).toBe(0);
        expect(state.status).toBe(GameStatus.GAME_OVER);
    });
});
