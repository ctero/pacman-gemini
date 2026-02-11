import { describe, it, expect, vi } from 'vitest';
import { MazeRenderer } from './mazeRenderer';
import { MazeTile } from './mazeData';

// Mock Pixi.js to avoid canvas issues in tests
vi.mock('pixi.js', () => {
    return {
        Container: vi.fn().mockImplementation(() => ({
            addChild: vi.fn(),
            removeChildren: vi.fn(),
            children: []
        })),
        Graphics: vi.fn().mockImplementation(() => ({
            rect: vi.fn().mockReturnThis(),
            fill: vi.fn().mockReturnThis(),
            circle: vi.fn().mockReturnThis(),
            clear: vi.fn().mockReturnThis(),
        })),
        Sprite: vi.fn().mockImplementation(() => ({
            addChild: vi.fn(),
            removeChildren: vi.fn(),
            tint: 0xffffff,
            visible: true
        })),
        Assets: {
            load: vi.fn().mockResolvedValue({})
        }
    };
});

describe('MazeRenderer', () => {
    it('should create containers for walls and dots', () => {
        const renderer = new MazeRenderer();
        expect(renderer.wallContainer).toBeDefined();
        expect(renderer.dotContainer).toBeDefined();
    });

    it('should add children for each tile in the maze', () => {
        const testMaze = [
            [MazeTile.WALL, MazeTile.DOT, MazeTile.POWER_PELLET],
        ];
        const renderer = new MazeRenderer();
        renderer.render(testMaze);

        // Check if addChild was called
        expect(renderer.wallContainer.addChild).toHaveBeenCalled();
        expect(renderer.dotContainer.addChild).toHaveBeenCalled();
    });
});
