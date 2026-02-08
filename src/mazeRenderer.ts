import { Container, Graphics } from 'pixi.js';
import { MazeTile } from './mazeData';
import { TILE_SIZE } from './constants';

export class MazeRenderer {
    public wallContainer: Container;
    public dotContainer: Container;

    constructor() {
        this.wallContainer = new Container();
        this.dotContainer = new Container();
    }

    public render(maze: MazeTile[][]) {
        this.renderWalls(maze);
        this.renderItems(maze);
    }

    public renderWalls(maze: MazeTile[][]) {
        this.wallContainer.removeChildren();
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                const tile = maze[y][x];
                const posX = x * TILE_SIZE;
                const posY = y * TILE_SIZE;

                if (tile === MazeTile.WALL) {
                    const wall = new Graphics();
                    wall.rect(posX, posY, TILE_SIZE, TILE_SIZE);
                    wall.fill(0x2121ff);
                    this.wallContainer.addChild(wall);
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
        const color = flash ? 0xffffff : 0x2121ff;
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
