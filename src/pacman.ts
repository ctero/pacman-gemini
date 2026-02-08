import { Container, Graphics } from 'pixi.js';
import { Direction } from './types';

export class PacMan {
    public x: number;
    public y: number;
    public direction: Direction = Direction.NONE;
    public speed: number = 1.46; // Arcade speed (approx pixels per frame at 60fps)
    
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

    public update(_deltaTime: number) {
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

    private updateVisualPosition() {
        this.container.x = this.x;
        this.container.y = this.y;
    }
}
