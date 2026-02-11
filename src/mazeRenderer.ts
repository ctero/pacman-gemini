import { Container, Graphics, Sprite, Assets } from 'pixi.js';
import { MazeTile } from './mazeData';
import { TILE_SIZE } from './constants';

export class MazeRenderer {
    public wallContainer: Container;
    public dotContainer: Container;
    private mazeSprite?: Sprite;

    constructor() {
        this.wallContainer = new Container();
        this.dotContainer = new Container();
    }

    public async initialize() {
        try {
            const texture = await Assets.load('maze.webp');
            this.mazeSprite = new Sprite(texture);

            // The maze grid is 28x36 tiles total.
            // The actual wall area (the maze) starts at row 3 and ends before the last 2 rows.
            // Maze height: (36 - 3 - 2) * TILE_SIZE = 31 * 8 = 248 pixels.
            // Maze width: 28 * TILE_SIZE = 224 pixels.
            this.mazeSprite.width = 28 * TILE_SIZE;
            this.mazeSprite.height = 31 * TILE_SIZE;

            // Offset the sprite by 3 tiles (24 pixels) vertically to align with the game grid
            //this.mazeSprite.y = 3 * TILE_SIZE;
            this.mazeSprite.y = 20;

            this.wallContainer.addChild(this.mazeSprite);
        } catch (error) {
            console.error('Failed to load maze image:', error);
        }
    }

    public render(maze: MazeTile[][]) {
        this.renderWalls(maze);
        this.renderItems(maze);
    }

    public renderWalls(maze: MazeTile[][]) {
        this.wallContainer.removeChildren();
        if (this.mazeSprite) {
            this.wallContainer.addChild(this.mazeSprite);
        }

        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                const tile = maze[y][x];
                const posX = x * TILE_SIZE;
                const posY = y * TILE_SIZE;

                if (tile === MazeTile.WALL) {
                    if (!this.mazeSprite) {
                        const wall = new Graphics();
                        wall.rect(posX, posY, TILE_SIZE, TILE_SIZE);
                        wall.fill(0x2121ff);
                        this.wallContainer.addChild(wall);
                    }
                } else if (tile === MazeTile.GHOST_HOUSE_DOOR) {
                    const door = new Graphics();
                    door.rect(posX, posY + 3, TILE_SIZE, 2);
                    door.fill(0xffb8ae);
                    this.wallContainer.addChild(door);
                }
            }
        }
    }

    public renderItems(maze: MazeTile[][]) {
        this.dotContainer.removeChildren();
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                const tile = maze[y][x];
                const posX = x * TILE_SIZE;
                const posY = y * TILE_SIZE;

                if (tile === MazeTile.DOT) {
                    const dot = new Graphics();
                    dot.rect(posX + 3, posY + 3, 2, 2);
                    dot.fill(0xffb8ae);
                    this.dotContainer.addChild(dot);
                } else if (tile === MazeTile.POWER_PELLET) {
                    const pellet = new Graphics();
                    pellet.circle(posX + 4, posY + 4, 3);
                    pellet.fill(0xffb8ae);
                    this.dotContainer.addChild(pellet);
                }
            }
        }
    }

    public flashWalls(maze: MazeTile[][], flash: boolean) {
        this.wallContainer.removeChildren();

        if (this.mazeSprite) {
            this.wallContainer.addChild(this.mazeSprite);
            // If the sprite is present, we handle flash by drawing white rectangles ON TOP of it when flash is true
        }

        const color = flash ? 0xffffff : 0x2121ff;

        // If flash is false and we have a sprite, we don't need to do anything else (sprite is already added)
        if (!flash && this.mazeSprite) return;

        // Otherwise (flash is true OR no sprite), we draw tiles
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === MazeTile.WALL) {
                    const wall = new Graphics();
                    wall.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    wall.fill(color);
                    this.wallContainer.addChild(wall);
                }
            }
        }
    }

    public addTo(parent: Container) {
        parent.addChild(this.wallContainer);
        parent.addChild(this.dotContainer);
    }
}
