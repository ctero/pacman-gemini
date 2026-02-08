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
    private frightened: boolean = false;
    private flashing: boolean = false;
    private animationFrame: number = 0;
    
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

    public getEyeDirection(): Direction {
        return this.direction === Direction.NONE ? Direction.LEFT : this.direction;
    }

    public setFlashing(flashing: boolean) {
        this.flashing = flashing;
        this.draw();
    }

    private draw() {
        this.graphics.clear();
        
        let bodyColor = this.frightened ? 0x2121ff : this.color;
        let eyeColor = this.frightened ? 0xffb8ff : 0xffffff;
        let pupilColor = this.frightened ? 0xffb8ff : 0x0000ff;

        // Flashing logic (last 2s): switch between blue and white every 10 frames
        if (this.flashing) {
            const flashFrame = Math.floor(this.animationFrame / 10) % 2;
            if (flashFrame === 1) {
                bodyColor = 0xffffff;
                eyeColor = 0xff0000;
                pupilColor = 0xff0000;
            }
        }

        // Simple ghost shape (square with a rounded top)
        this.graphics.rect(0, 4, 8, 4);
        this.graphics.circle(4, 4, 4);
        this.graphics.fill(bodyColor);
        
        // Legs animation (2 frames)
        const legFrame = Math.floor(this.animationFrame / 10) % 2;
        if (legFrame === 0) {
            this.graphics.moveTo(0, 8);
            this.graphics.lineTo(2, 6);
            this.graphics.lineTo(4, 8);
            this.graphics.lineTo(6, 6);
            this.graphics.lineTo(8, 8);
        } else {
            this.graphics.moveTo(0, 6);
            this.graphics.lineTo(2, 8);
            this.graphics.lineTo(4, 6);
            this.graphics.lineTo(6, 8);
            this.graphics.lineTo(8, 6);
        }
        this.graphics.fill(bodyColor);

        if (this.frightened) {
            // Squiggly mouth for frightened
            this.graphics.rect(1, 6, 6, 1);
            this.graphics.fill(eyeColor);
        } else {
            // Eyes direction
            const eyeDir = this.getEyeDirection();
            let eyeOffsetX = 0;
            let eyeOffsetY = 0;
            if (eyeDir === Direction.LEFT) eyeOffsetX = -1;
            if (eyeDir === Direction.RIGHT) eyeOffsetX = 1;
            if (eyeDir === Direction.UP) eyeOffsetY = -1;
            if (eyeDir === Direction.DOWN) eyeOffsetY = 1;

            // Eyes (white)
            this.graphics.circle(2 + eyeOffsetX, 3 + eyeOffsetY, 1.5);
            this.graphics.circle(6 + eyeOffsetX, 3 + eyeOffsetY, 1.5);
            this.graphics.fill(eyeColor);

            // Pupils (blue)
            this.graphics.circle(2 + eyeOffsetX * 2, 3 + eyeOffsetY * 2, 0.5);
            this.graphics.circle(6 + eyeOffsetX * 2, 3 + eyeOffsetY * 2, 0.5);
            this.graphics.fill(pupilColor);
        }
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

    public setFrightened(frightened: boolean) {
        this.frightened = frightened;
        this.draw();
    }

    public reset(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.direction = Direction.NONE;
        this.frightened = false;
        this.setHouseTimer(60);
        this.draw();
        this.updateVisualPosition();
    }

    public isFrightened(): boolean {
        return this.frightened;
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
            if (this.frightened) {
                this.direction = this.chooseRandomDirection(maze);
            } else {
                this.direction = chooseNextDirection(
                    { x: this.x, y: this.y },
                    this.direction,
                    this.target,
                    maze
                );
            }
        }

        if (this.direction !== Direction.NONE) {
            this.animationFrame++;
            this.draw();
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

    private chooseRandomDirection(maze: MazeTile[][]): Direction {
        const dirs = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
        const validDirs = dirs.filter(d => d !== this.getOppositeDirection() && this.canMove(d, maze));
        if (validDirs.length === 0) return this.getOppositeDirection();
        return validDirs[Math.floor(Math.random() * validDirs.length)];
    }

    private getOppositeDirection(): Direction {
        if (this.direction === Direction.UP) return Direction.DOWN;
        if (this.direction === Direction.DOWN) return Direction.UP;
        if (this.direction === Direction.LEFT) return Direction.RIGHT;
        if (this.direction === Direction.RIGHT) return Direction.LEFT;
        return Direction.NONE;
    }

    private canMove(dir: Direction, maze: MazeTile[][]): boolean {
        const tileX = Math.round(this.x / TILE_SIZE);
        const tileY = Math.round(this.y / TILE_SIZE);
        let nextX = tileX;
        let nextY = tileY;

        if (dir === Direction.UP) nextY--;
        if (dir === Direction.DOWN) nextY++;
        if (dir === Direction.LEFT) nextX--;
        if (dir === Direction.RIGHT) nextX++;

        if (nextX < 0 || nextX >= 28 || nextY < 0 || nextY >= 36) return true;
        return maze[nextY][nextX] !== MazeTile.WALL;
    }

    private draw() {
        this.graphics.clear();
        
        const bodyColor = this.frightened ? 0x2121ff : this.color;
        const eyeColor = this.frightened ? 0xffb8ff : 0xffffff;
        const pupilColor = this.frightened ? 0xffb8ff : 0x0000ff;

        // Simple ghost shape (square with a rounded top)
        this.graphics.rect(0, 4, 8, 4);
        this.graphics.circle(4, 4, 4);
        this.graphics.fill(bodyColor);
        
        if (this.frightened) {
            // Squiggly mouth or just different eyes for frightened
            this.graphics.rect(1, 6, 6, 1);
            this.graphics.fill(eyeColor);
        } else {
            // Eyes (white)
            this.graphics.circle(2, 3, 1.5);
            this.graphics.circle(6, 3, 1.5);
            this.graphics.fill(eyeColor);

            // Pupils (blue)
            this.graphics.circle(2, 3, 0.5);
            this.graphics.circle(6, 3, 0.5);
            this.graphics.fill(pupilColor);
        }
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
