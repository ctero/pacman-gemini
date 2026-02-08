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

        // 1. Handle Reversals (Instant)
        if (this.nextDirection !== Direction.NONE && this.isOpposite(this.direction, this.nextDirection)) {
            this.direction = this.nextDirection;
            this.nextDirection = Direction.NONE;
        }

        // 2. Try to turn if we have a buffered direction
        if (this.nextDirection !== Direction.NONE && this.nextDirection !== this.direction) {
            // We only check if a turn is possible if we are near the center of a tile
            // and we check IF the turn is possible FROM that center.
            const snappedX = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
            const snappedY = Math.round(this.y / TILE_SIZE) * TILE_SIZE;
            const distanceToCenter = Math.sqrt(Math.pow(this.x - snappedX, 2) + Math.pow(this.y - snappedY, 2));

            if (distanceToCenter < 4) {
                // Temporarily move to snapped position to check if the turn is possible
                const originalX = this.x;
                const originalY = this.y;
                this.x = snappedX;
                this.y = snappedY;

                if (this.canMove(this.nextDirection, maze, currentSpeed, 1)) {
                    this.direction = this.nextDirection;
                    this.nextDirection = Direction.NONE;
                    this.snapToTile();
                    // Move in the new direction immediately for responsiveness
                    this.move(this.direction, currentSpeed);
                    this.animationFrame++;
                    this.draw();
                    this.updateVisualPosition();
                    return;
                }
                // Restore original position if we can't turn
                this.x = originalX;
                this.y = originalY;
            }
        }

        // 3. Move in current direction
        // Current movement uses a tighter margin (1) to prevent clipping through walls
        if (this.canMove(this.direction, maze, currentSpeed, 1)) {
            this.move(this.direction, currentSpeed);
            this.animationFrame++;
            this.draw();
        } else {
            // Blocked by a wall, snap to center and stop
            this.snapToTile();
            this.animationFrame = 0;
            this.draw();
        }

        // 4. Handle Tunnel Wrapping
        if (this.x < -TILE_SIZE / 2) {
            this.x = MAZE_WIDTH + TILE_SIZE / 2;
        } else if (this.x > MAZE_WIDTH + TILE_SIZE / 2) {
            this.x = -TILE_SIZE / 2;
        }
        
        this.updateVisualPosition();
    }

    private move(dir: Direction, speed: number) {
        if (dir === Direction.LEFT) this.x -= speed;
        else if (dir === Direction.RIGHT) this.x += speed;
        else if (dir === Direction.UP) this.y -= speed;
        else if (dir === Direction.DOWN) this.y += speed;
    }

    private isOpposite(dir1: Direction, dir2: Direction): boolean {
        if (dir1 === Direction.UP && dir2 === Direction.DOWN) return true;
        if (dir1 === Direction.DOWN && dir2 === Direction.UP) return true;
        if (dir1 === Direction.LEFT && dir2 === Direction.RIGHT) return true;
        if (dir1 === Direction.RIGHT && dir2 === Direction.LEFT) return true;
        return false;
    }

    private canMove(dir: Direction, maze: MazeTile[][], speed: number, margin: number = 1): boolean {
        if (dir === Direction.NONE) return false;

        // Prevent vertical movement in warp tunnels
        const currentTileX = Math.round(this.x / TILE_SIZE);
        if ((currentTileX < 0 || currentTileX >= 28) && (dir === Direction.UP || dir === Direction.DOWN)) {
            return false;
        }

        // Calculate next position based on direction
        let nextX = this.x;
        let nextY = this.y;

        if (dir === Direction.LEFT) nextX -= speed;
        if (dir === Direction.RIGHT) nextX += speed;
        if (dir === Direction.UP) nextY -= speed;
        if (dir === Direction.DOWN) nextY += speed;

        // Check corner points of the bounding box
        const points = [
            { x: nextX + margin, y: nextY + margin },
            { x: nextX + TILE_SIZE - 1 - margin, y: nextY + margin },
            { x: nextX + margin, y: nextY + TILE_SIZE - 1 - margin },
            { x: nextX + TILE_SIZE - 1 - margin, y: nextY + TILE_SIZE - 1 - margin }
        ];

        for (const p of points) {
            const tileX = Math.floor(p.x / TILE_SIZE);
            const tileY = Math.floor(p.y / TILE_SIZE);

            // Restrict horizontal exit points to the tunnel row (17)
            if (tileX < 0 || tileX >= 28) {
                if (tileY === 17) continue;
                return false;
            }
            if (tileY < 0 || tileY >= 36) return true; // Safety for header/footer

            const tile = maze[tileY][tileX];
            if (tile === MazeTile.WALL || tile === MazeTile.GHOST_HOUSE_DOOR) {
                return false;
            }
        }

        return true;
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
