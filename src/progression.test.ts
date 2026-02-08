import { describe, it, expect, beforeEach } from 'vitest';
import { GameState, GameStatus } from './gameState';
import { MazeState } from './mazeState';
import { MazeTile } from './mazeData';

describe('Level Progression', () => {
    let state: GameState;
    let maze: MazeState;

    beforeEach(() => {
        state = new GameState();
        state.status = GameStatus.PLAYING;
        maze = new MazeState([[MazeTile.DOT]]);
    });

    it('should detect when the level is complete', () => {
        maze.removeLevelItem(0, 0);
        expect(maze.getRemainingItemsCount()).toBe(0);
    });

    it('should increment level and reset state on nextLevel()', () => {
        state.nextLevel();
        expect(state.level).toBe(2);
        expect(state.status).toBe(GameStatus.READY);
    });
});
