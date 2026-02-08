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
    private baseSpeed: number = 0.8 * (80 / 60); // Default Level 1 arcade speed
    private eatingSpeed: number = 0.71 * (80 / 60);
    private animationFrame: number = 0;
    
    public container: Container;
    private graphics: Graphics;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.container = new Container();
        this.graphics = new Graphics();
        this.draw();
        this.container.addChild(this.graphics);
        // Center the graphics within the container for rotation
        this.graphics.pivot.set(4, 4);
        this.graphics.position.set(4, 4);
        this.updateVisualPosition();
    }

    public setBaseSpeed(speed: number) {
        this.baseSpeed = speed;
    }

    public setEatingSpeed(speed: number) {
        this.eatingSpeed = speed;
    }

    public getSpeed(): number {
        return this.baseSpeed;
    }

    public getRotation(): number {
        if (this.direction === Direction.RIGHT) return 0;
        if (this.direction === Direction.DOWN) return Math.PI / 2;
        if (this.direction === Direction.LEFT) return Math.PI;
        if (this.direction === Direction.UP) return -Math.PI / 2;
        return 0;
    }

    private draw() {
        this.graphics.clear();
        
        // 3-frame animation logic
        // 0: Full circle, 1: Half open, 2: Fully open
        const frame = Math.floor(this.animationFrame / 5) % 4;
        const mouthSize = frame === 0 ? 0 : (frame === 1 || frame === 3 ? 0.4 : 0.8);

        this.graphics.beginPath();
        this.graphics.moveTo(4, 4);
        // Draw an arc with a "mouth" gap
        this.graphics.arc(4, 4, 4, mouthSize, 2 * Math.PI - mouthSize);
        this.graphics.lineTo(4, 4);
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
        
        const currentSpeed = this.getSpeed();
        if (offX < currentSpeed && offY < currentSpeed) {
            const tile = mazeState.getTile(tileX, tileY);
            if (tile === MazeTile.DOT || tile === MazeTile.POWER_PELLET) {
                mazeState.removeLevelItem(tileX, tileY);
                return tile;
            }
        }
        
        return MazeTile.EMPTY;
    }

    private isEating(maze: MazeTile[][]): boolean {
        const tileX = Math.round(this.x / TILE_SIZE);
        const tileY = Math.round(this.y / TILE_SIZE);
        
        // Safety check for bounds
        if (tileY < 0 || tileY >= maze.length || tileX < 0 || tileX >= maze[0].length) {
            return false;
        }

        const tile = maze[tileY][tileX];
        return tile === MazeTile.DOT || tile === MazeTile.POWER_PELLET;
    }

    public update(_deltaTime: number, maze: MazeTile[][]) {
        const currentSpeed = this.isEating(maze) ? this.eatingSpeed : this.baseSpeed;

        // 1. Try to change to nextDirection if possible (pre-turn / intersection)
        if (this.nextDirection !== Direction.NONE && this.canMove(this.nextDirection, maze, currentSpeed)) {
            // Only allow turning if we are closely aligned with a tile center
            if (this.isAlignedWithTile(currentSpeed)) {
                this.direction = this.nextDirection;
                this.nextDirection = Direction.NONE;
            }
        }

        // 2. Move in current direction if not blocked
        if (this.canMove(this.direction, maze, currentSpeed)) {
            if (this.direction === Direction.LEFT) {
                this.x -= currentSpeed;
            } else if (this.direction === Direction.RIGHT) {
                this.x += currentSpeed;
            } else if (this.direction === Direction.UP) {
                this.y -= currentSpeed;
            } else if (this.direction === Direction.DOWN) {
                this.y += currentSpeed;
            }
            
            // Only animate if moving
            if (this.direction !== Direction.NONE) {
                this.animationFrame++;
                this.draw();
            }
        } else {
            // Stop and snap to tile center if we hit a wall
            this.snapToTile();
            // Reset to full circle when stopped
            this.animationFrame = 0;
            this.draw();
        }

        // 3. Handle Tunnel Wrapping
        if (this.x < -TILE_SIZE / 2) {
            this.x = MAZE_WIDTH + TILE_SIZE / 2;
        } else if (this.x > MAZE_WIDTH + TILE_SIZE / 2) {
            this.x = -TILE_SIZE / 2;
        }
        
        this.updateVisualPosition();
    }

    private canMove(dir: Direction, maze: MazeTile[][], speed: number): boolean {
        if (dir === Direction.NONE) return false;

        // Prevent vertical movement in warp tunnels
        const currentTileX = Math.round(this.x / TILE_SIZE);
        if ((currentTileX < 0 || currentTileX >= 28) && (dir === Direction.UP || dir === Direction.DOWN)) {
            return false;
        }

        // Calculate next tile based on direction
        let nextX = this.x;
        let nextY = this.y;

        if (dir === Direction.LEFT) nextX -= speed;
        if (dir === Direction.RIGHT) nextX += speed;
        if (dir === Direction.UP) nextY -= speed;
        if (dir === Direction.DOWN) nextY += speed;

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

    private isAlignedWithTile(speed: number): boolean {
        const tolerance = speed;
        const offX = Math.abs(this.x % TILE_SIZE);
        const offY = Math.abs(this.y % TILE_SIZE);
        return offX < tolerance && offY < tolerance;
    }

    private snapToTile() {
        this.x = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
        this.y = Math.round(this.y / TILE_SIZE) * TILE_SIZE;
    }

    private updateVisualPosition() {
        this.container.x = this.x;
        this.container.y = this.y;
        this.graphics.rotation = this.getRotation();
    }
}
