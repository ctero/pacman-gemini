import { Container, Graphics } from 'pixi.js';
import { Direction, Point, GhostState } from './types';
import { chooseNextDirection } from './ghostMovement';
import { MazeTile } from './mazeData';
import { TILE_SIZE } from './constants';

export class Ghost {
    public x: number;
    public y: number;
    public direction: Direction = Direction.NONE;
    public target: Point = { x: 0, y: 0 };
    private state: GhostState = GhostState.NORMAL;
    private baseSpeed: number = 0.75 * (80 / 60);
    private frightenedSpeed: number = 0.5 * (80 / 60);
    private tunnelSpeed: number = 0.4 * (80 / 60);
    private eatenSpeed: number = 2.0 * (80 / 60);
    private cruiseElroySpeed: number | null = null;
    private houseTimer: number = 0;
    private inHouse: boolean = true;
    private exiting: boolean = false;
    private exitStep: number = 0;
    private regenerationTimer: number = 0;
    private frightened: boolean = false;
    private flashing: boolean = false;
    private animationFrame: number = 0;
    
    public container: Container;
    private graphics: Graphics;
    private color: number;
    private homePosition: Point;

    constructor(x: number, y: number, color: number) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.homePosition = { x, y };
        // 17 * TILE_SIZE is inside the house
        this.inHouse = (Math.round(y / TILE_SIZE) === 17);
        this.state = this.inHouse ? GhostState.NORMAL : GhostState.NORMAL; // Still NORMAL, but inHouse flag is used for logic
        this.container = new Container();
        this.graphics = new Graphics();
        this.draw();
        this.container.addChild(this.graphics);
        this.updateVisualPosition();
    }

    public getState(): GhostState {
        return this.state;
    }

    public setEaten() {
        this.state = GhostState.EATEN;
        this.frightened = false;
        this.inHouse = false;
        this.draw();
    }

    public setSpeeds(speeds: { base: number, frightened: number, tunnel: number }) {
        this.baseSpeed = speeds.base;
        this.frightenedSpeed = speeds.frightened;
        this.tunnelSpeed = speeds.tunnel;
        this.eatenSpeed = speeds.base * 2; // Typically double base speed
    }

    public setCruiseElroySpeed(speed: number | null) {
        this.cruiseElroySpeed = speed;
    }

    public getSpeed(): number {
        if (this.state === GhostState.EATEN || this.state === GhostState.ENTERING_HOUSE) {
            return this.eatenSpeed;
        }

        if (this.exiting) return 0.4 * (80 / 60); // Slow exit speed

        const tileX = Math.round(this.x / TILE_SIZE);
        const tileY = Math.round(this.y / TILE_SIZE);

        // Tunnel check (Arcade: ghosts are slow in tunnels)
        if (tileY === 17 && (tileX < 6 || tileX > 21)) {
            return this.tunnelSpeed;
        }

        if (this.frightened) {
            return this.frightenedSpeed;
        }

        return this.cruiseElroySpeed ?? this.baseSpeed;
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
        
        const isEyesOnly = this.state === GhostState.EATEN || this.state === GhostState.ENTERING_HOUSE;
        let eyeColor = this.frightened && !isEyesOnly ? 0xffb8ff : 0xffffff;
        let pupilColor = this.frightened && !isEyesOnly ? 0xffb8ff : 0x0000ff;

        if (!isEyesOnly) {
            let bodyColor = this.frightened ? 0x2121ff : this.color;

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
        }

        if (this.frightened && !isEyesOnly) {
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
    }

    public getHouseTimer(): number {
        return this.houseTimer;
    }

    public isInHouse(): boolean {
        return this.inHouse;
    }

    public setFrightened(frightened: boolean) {
        if (this.state === GhostState.EATEN || this.state === GhostState.ENTERING_HOUSE) return;
        
        this.frightened = frightened;
        this.state = frightened ? GhostState.FRIGHTENED : GhostState.NORMAL;
        this.draw();
    }

    public reset(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.inHouse = (Math.round(y / TILE_SIZE) === 17);
        this.direction = Direction.NONE;
        this.frightened = false;
        this.flashing = false;
        this.state = GhostState.NORMAL;
        this.exiting = false;
        this.exitStep = 0;
        this.setHouseTimer(60);
        this.draw();
        this.updateVisualPosition();
    }

    public isFrightened(): boolean {
        return this.frightened;
    }

    public setVisible(visible: boolean) {
        this.container.visible = visible;
    }

    public forceExitHouse() {
        if (this.inHouse) {
            this.exiting = true;
            this.inHouse = false;
            this.exitStep = 0;
        }
    }

    private handleExit() {
        const targetX = 13.5 * TILE_SIZE;
        const targetY = 14 * TILE_SIZE;
        const speed = this.getSpeed();

        if (this.exitStep === 0) {
            // Move horizontally to center
            if (Math.abs(this.x - targetX) < speed) {
                this.x = targetX;
                this.exitStep = 1;
            } else {
                this.x += this.x < targetX ? speed : -speed;
                this.direction = this.x < targetX ? Direction.RIGHT : Direction.LEFT;
            }
        } else if (this.exitStep === 1) {
            // Move vertically to exit
            if (Math.abs(this.y - targetY) < speed) {
                this.y = targetY;
                this.exiting = false;
                this.direction = Direction.LEFT; // Standard first move
            } else {
                this.y += this.y < targetY ? speed : -speed;
                this.direction = this.y < targetY ? Direction.DOWN : Direction.UP;
            }
        }
        
        this.animationFrame++;
        this.draw();
        this.updateVisualPosition();
    }

    private handleEntering() {
        const speed = this.getSpeed();

        if (this.state === GhostState.ENTERING_HOUSE) {
            // We are already at centerTileX (13.5) from the transition in update()
            // Step 1: Move vertically to home Y
            if (Math.abs(this.y - this.homePosition.y) > 0.1) {
                this.y += this.y < this.homePosition.y ? speed : -speed;
                if (Math.abs(this.y - this.homePosition.y) < speed) this.y = this.homePosition.y;
                this.direction = this.y < this.homePosition.y ? Direction.DOWN : Direction.UP;
            } 
            // Step 2: Move horizontally to home X
            else if (Math.abs(this.x - this.homePosition.x) > 0.1) {
                this.x += this.x < this.homePosition.x ? speed : -speed;
                if (Math.abs(this.x - this.homePosition.x) < speed) this.x = this.homePosition.x;
                this.direction = this.x < this.homePosition.x ? Direction.RIGHT : Direction.LEFT;
            } 
            // Step 3: Reached home
            else {
                // Reached home
                this.state = GhostState.REGENERATING;
                this.inHouse = true;
                this.regenerationTimer = 30; // 0.5s at 60fps
                this.draw();
            }
        }
        
        this.animationFrame++;
        this.draw();
        this.updateVisualPosition();
    }

    public update(maze: MazeTile[][]) {
        if (this.state === GhostState.REGENERATING) {
            this.regenerationTimer--;
            if (this.regenerationTimer <= 0) {
                this.state = GhostState.NORMAL;
                this.draw();
            }
            this.animationFrame++;
            this.draw();
            return;
        }

        if (this.state === GhostState.ENTERING_HOUSE) {
            this.handleEntering();
            return;
        }

        if (this.inHouse) {
            // Simple up/down bounce while in house
            this.animationFrame++;
            this.draw();
            return;
        }

        if (this.exiting) {
            this.handleExit();
            return;
        }

        const currentSpeed = this.getSpeed();

        // If eaten, check for entrance independently of tile center
        if (this.state === GhostState.EATEN) {
            const entranceX = 13.5 * TILE_SIZE;
            const entranceY = 14 * TILE_SIZE;
            const distToEntrance = Math.sqrt(
                Math.pow(this.x - entranceX, 2) + 
                Math.pow(this.y - entranceY, 2)
            );
            if (distToEntrance < currentSpeed) {
                this.x = entranceX;
                this.y = entranceY;
                this.state = GhostState.ENTERING_HOUSE;
                this.direction = Direction.DOWN;
                this.draw();
                return;
            }
        }

        // Decision point: center of tile
        if (this.isAtTileCenter(currentSpeed)) {
            const oldDir = this.direction;
            
            let effectiveTarget = (this.state === GhostState.EATEN)
                ? { x: 13.5 * TILE_SIZE, y: 14 * TILE_SIZE }
                : this.target;

            if (this.frightened) {
                this.direction = this.chooseRandomDirection(maze);
            } else {
                this.direction = chooseNextDirection(
                    { x: this.x, y: this.y },
                    this.direction,
                    effectiveTarget,
                    maze
                );
            }

            // Snap to grid on direction change to prevent clipping/drifting
            if (this.direction !== oldDir) {
                this.x = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
                this.y = Math.round(this.y / TILE_SIZE) * TILE_SIZE;
            }
        }

        if (this.direction !== Direction.NONE) {
            this.animationFrame++;
            this.draw();
        }

        if (this.direction === Direction.LEFT) {
            this.x -= currentSpeed;
        } else if (this.direction === Direction.RIGHT) {
            this.x += currentSpeed;
        } else if (this.direction === Direction.UP) {
            this.y -= currentSpeed;
        } else if (this.direction === Direction.DOWN) {
            this.y += currentSpeed;
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

        // Prevent vertical movement in warp tunnels
        if ((tileX < 0 || tileX >= 28) && (dir === Direction.UP || dir === Direction.DOWN)) {
            return false;
        }

        let nextX = tileX;
        let nextY = tileY;

        if (dir === Direction.UP) nextY--;
        if (dir === Direction.DOWN) nextY++;
        if (dir === Direction.LEFT) nextX--;
        if (dir === Direction.RIGHT) nextX++;

        // Restrict horizontal exit points to the tunnel row (17)
        if (nextX < 0 || nextX >= 28) {
            if (tileY === 17) return true;
            return false;
        }
        if (nextY < 0 || nextY >= 36) return true;
        return maze[nextY][nextX] !== MazeTile.WALL;
    }

    private isAtTileCenter(speed: number): boolean {
        const offX = Math.abs((this.x % TILE_SIZE));
        const offY = Math.abs((this.y % TILE_SIZE));
        // Using current speed as threshold for sub-pixel accuracy
        return offX < speed && offY < speed;
    }

    protected updateVisualPosition() {
        this.container.x = this.x;
        this.container.y = this.y;
    }
}
