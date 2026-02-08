import { Container, Graphics } from 'pixi.js';
import { FruitType, FRUIT_SPAWN_POS } from './fruit';

export class FruitRenderer {
    public container: Container;
    private graphics: Graphics;

    constructor() {
        this.container = new Container();
        this.graphics = new Graphics();
        this.container.addChild(this.graphics);
        this.container.position.set(FRUIT_SPAWN_POS.x, FRUIT_SPAWN_POS.y);
        this.container.visible = false;
    }

    public render(type: FruitType | null) {
        this.graphics.clear();
        if (!type) {
            this.container.visible = false;
            return;
        }

        this.container.visible = true;
        this.drawFruit(type);
    }

    private drawFruit(type: FruitType) {
        switch (type) {
            case FruitType.CHERRY:
                this.drawCherry();
                break;
            case FruitType.STRAWBERRY:
                this.drawStrawberry();
                break;
            case FruitType.PEACH:
                this.drawPeach();
                break;
            case FruitType.APPLE:
                this.drawApple();
                break;
            case FruitType.GRAPES:
                this.drawGrapes();
                break;
            case FruitType.GALAXIAN:
                this.drawGalaxian();
                break;
            case FruitType.BELL:
                this.drawBell();
                break;
            case FruitType.KEY:
                this.drawKey();
                break;
        }
    }

    private drawCherry() {
        // Two red circles
        this.graphics.circle(2, 6, 2).fill(0xff0000);
        this.graphics.circle(6, 4, 2).fill(0xff0000);
        // Stems
        this.graphics.moveTo(2, 6).lineTo(4, 2).lineTo(6, 4).stroke({ width: 1, color: 0x00ff00 });
    }

    private drawStrawberry() {
        // Red triangle-ish
        this.graphics.beginPath();
        this.graphics.moveTo(1, 2);
        this.graphics.lineTo(7, 2);
        this.graphics.lineTo(4, 8);
        this.graphics.closePath();
        this.graphics.fill(0xff0000);
        // Green top
        this.graphics.rect(3, 0, 2, 2).fill(0x00ff00);
    }

    private drawPeach() {
        // Orange circle
        this.graphics.circle(4, 4, 4).fill(0xffb852);
        // Small leaf
        this.graphics.rect(4, 0, 1, 2).fill(0x00ff00);
    }

    private drawApple() {
        // Red circle
        this.graphics.circle(4, 4, 4).fill(0xff0000);
        // Stem
        this.graphics.rect(4, 0, 1, 2).fill(0x552200);
    }

    private drawGrapes() {
        // Purple cluster
        this.graphics.circle(4, 2, 2).fill(0xff00ff);
        this.graphics.circle(2, 4, 2).fill(0xff00ff);
        this.graphics.circle(6, 4, 2).fill(0xff00ff);
        this.graphics.circle(4, 6, 2).fill(0xff00ff);
        // Green stem
        this.graphics.rect(4, 0, 1, 1).fill(0x00ff00);
    }

    private drawGalaxian() {
        // Blue and yellow shape
        this.graphics.poly([4, 0, 8, 8, 4, 6, 0, 8]).fill(0x00ffff);
        this.graphics.rect(3, 3, 2, 2).fill(0xffff00);
    }

    private drawBell() {
        // Yellow bell
        this.graphics.rect(2, 1, 4, 5).fill(0xffff00);
        this.graphics.rect(1, 6, 6, 2).fill(0xffff00);
    }

    private drawKey() {
        // White key
        this.graphics.circle(4, 2, 2).stroke({ width: 1, color: 0xffffff });
        this.graphics.rect(4, 4, 1, 4).fill(0xffffff);
        this.graphics.rect(5, 6, 2, 1).fill(0xffffff);
    }

    public addTo(parent: Container) {
        parent.addChild(this.container);
    }
}
