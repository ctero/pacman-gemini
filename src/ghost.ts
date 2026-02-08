import { Container, Graphics } from 'pixi.js';
import { Direction, Point } from './types';
import { chooseNextDirection } from './ghostMovement';
import { MazeTile } from './mazeData';
import { TILE_SIZE } from './constants';

export class Ghost {
    public x: number;
    public y: number;
    public direction: Direction = Direction.NONE;
    public target: Point = { x: 0, y: 0 };
    public speed: number = 1.8; // Slightly slower than Pac-Man (2.0)
    private houseTimer: number = 0;
    private inHouse: boolean = true;
    
    public container: Container;
    private graphics: Graphics;
    private color: number;

    constructor(x: number, y: number, color: number) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.container = new Container();
        this.graphics = new Graphics();
        this.draw();
        this.container.addChild(this.graphics);
        this.updateVisualPosition();
    }

    private draw() {
        this.graphics.clear();
        // Simple ghost shape (square with a rounded top)
        this.graphics.rect(0, 4, 8, 4);
        this.graphics.circle(4, 4, 4);
        this.graphics.fill(this.color);
        
        // Eyes (white)
        this.graphics.circle(2, 3, 1.5);
        this.graphics.circle(6, 3, 1.5);
        this.graphics.fill(0xffffff);

        // Pupils (blue)
        this.graphics.circle(2, 3, 0.5);
        this.graphics.circle(6, 3, 0.5);
        this.graphics.fill(0x0000ff);
    }

    public setDirection(direction: Direction) {
        this.direction = direction;
    }

    public setTarget(target: Point) {
        this.target = target;
    }

    public setHouseTimer(frames: number) {
        this.houseTimer = frames;
        this.inHouse = frames > 0;
    }

    public getHouseTimer(): number {
        return this.houseTimer;
    }

    public isInHouse(): boolean {
        return this.inHouse;
    }

    public update(maze: MazeTile[][]) {
        if (this.houseTimer > 0) {
            this.houseTimer--;
            if (this.houseTimer === 0) {
                this.inHouse = false;
                this.x = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
                this.y = Math.round(this.y / TILE_SIZE) * TILE_SIZE;
            }
            return;
        }

        // Decision point: center of tile
        if (this.isAtTileCenter()) {
            this.direction = chooseNextDirection(
                { x: this.x, y: this.y },
                this.direction,
                this.target,
                maze
            );
        }

        if (this.direction === Direction.LEFT) {
            this.x -= this.speed;
        } else if (this.direction === Direction.RIGHT) {
            this.x += this.speed;
        } else if (this.direction === Direction.UP) {
            this.y -= this.speed;
        } else if (this.direction === Direction.DOWN) {
            this.y += this.speed;
        }
        
        this.updateVisualPosition();
    }

    private isAtTileCenter(): boolean {
        const offX = Math.abs((this.x % TILE_SIZE));
        const offY = Math.abs((this.y % TILE_SIZE));
        // Using a small threshold for sub-pixel speed
        return offX < this.speed && offY < this.speed;
    }

    protected updateVisualPosition() {
        this.container.x = this.x;
        this.container.y = this.y;
    }
}
