import { Container, Graphics } from 'pixi.js';
import { Direction } from './types';
import { TILE_SIZE, MAZE_WIDTH } from './constants';
import { MazeTile } from './mazeData';
import { MazeState } from './mazeState';

export class PacMan {
    public x: number;
    public y: number;
    public direction: Direction = Direction.NONE;
    public nextDirection: Direction = Direction.NONE;
    public speed: number = 2.0;
    
    public container: Container;
    private graphics: Graphics;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.container = new Container();
        this.graphics = new Graphics();
        this.draw();
        this.container.addChild(this.graphics);
        this.updateVisualPosition();
    }

    private draw() {
        this.graphics.clear();
        this.graphics.circle(4, 4, 4);
        this.graphics.fill(0xffff00);
    }

    public setDirection(direction: Direction) {
        this.direction = direction;
    }

    public setNextDirection(direction: Direction) {
        this.nextDirection = direction;
    }

    public eat(mazeState: MazeState): MazeTile {
        const tileX = Math.round(this.x / TILE_SIZE);
        const tileY = Math.round(this.y / TILE_SIZE);
        
        // Tolerance for eating: must be close to tile center
        const offX = Math.abs(this.x - tileX * TILE_SIZE);
        const offY = Math.abs(this.y - tileY * TILE_SIZE);
        
        if (offX < this.speed && offY < this.speed) {
            const tile = mazeState.getTile(tileX, tileY);
            if (tile === MazeTile.DOT || tile === MazeTile.POWER_PELLET) {
                mazeState.removeLevelItem(tileX, tileY);
                return tile;
            }
        }
        
        return MazeTile.EMPTY;
    }

    public update(_deltaTime: number, maze: MazeTile[][]) {
        // 1. Try to change to nextDirection if possible (pre-turn / intersection)
        if (this.nextDirection !== Direction.NONE && this.canMove(this.nextDirection, maze)) {
            // Only allow turning if we are closely aligned with a tile center
            if (this.isAlignedWithTile()) {
                this.direction = this.nextDirection;
                this.nextDirection = Direction.NONE;
            }
        }

        // 2. Move in current direction if not blocked
        if (this.canMove(this.direction, maze)) {
            if (this.direction === Direction.LEFT) {
                this.x -= this.speed;
            } else if (this.direction === Direction.RIGHT) {
                this.x += this.speed;
            } else if (this.direction === Direction.UP) {
                this.y -= this.speed;
            } else if (this.direction === Direction.DOWN) {
                this.y += this.speed;
            }
        } else {
            // Stop and snap to tile center if we hit a wall
            this.snapToTile();
        }

        // 3. Handle Tunnel Wrapping
        if (this.x < -TILE_SIZE / 2) {
            this.x = MAZE_WIDTH + TILE_SIZE / 2;
        } else if (this.x > MAZE_WIDTH + TILE_SIZE / 2) {
            this.x = -TILE_SIZE / 2;
        }
        
        this.updateVisualPosition();
    }

    private canMove(dir: Direction, maze: MazeTile[][]): boolean {
        if (dir === Direction.NONE) return false;

        // Calculate next tile based on direction
        let nextX = this.x;
        let nextY = this.y;

        if (dir === Direction.LEFT) nextX -= this.speed;
        if (dir === Direction.RIGHT) nextX += this.speed;
        if (dir === Direction.UP) nextY -= this.speed;
        if (dir === Direction.DOWN) nextY += this.speed;

        // Check corner points of the bounding box (slightly smaller than tile)
        const margin = 1;
        const points = [
            { x: nextX + margin, y: nextY + margin },
            { x: nextX + TILE_SIZE - 1 - margin, y: nextY + margin },
            { x: nextX + margin, y: nextY + TILE_SIZE - 1 - margin },
            { x: nextX + TILE_SIZE - 1 - margin, y: nextY + TILE_SIZE - 1 - margin }
        ];

        for (const p of points) {
            const tileX = Math.floor(p.x / TILE_SIZE);
            const tileY = Math.floor(p.y / TILE_SIZE);

            // Tunnels are special: outside maze is EMPTY
            if (tileX < 0 || tileX >= 28) continue;
            if (tileY < 0 || tileY >= 36) return true; // Safety

            const tile = maze[tileY][tileX];
            if (tile === MazeTile.WALL || tile === MazeTile.GHOST_HOUSE_DOOR) {
                return false;
            }
        }

        return true;
    }

    private isAlignedWithTile(): boolean {
        const tolerance = this.speed;
        const offX = this.x % TILE_SIZE;
        const offY = this.y % TILE_SIZE;
        return offX < tolerance && offY < tolerance;
    }

    private snapToTile() {
        this.x = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
        this.y = Math.round(this.y / TILE_SIZE) * TILE_SIZE;
    }

    private updateVisualPosition() {
        this.container.x = this.x;
        this.container.y = this.y;
    }
}