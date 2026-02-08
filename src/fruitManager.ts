import { FruitData, getFruitDataForLevel, FRUIT_SPAWN_POS } from './fruit';

export interface ActiveFruit {
    data: FruitData;
    level: number;
    timer: number;
}

export class FruitManager {
    private activeFruit: ActiveFruit | null = null;
    private dotsEaten: number = 0;
    private currentLevel: number = 1;
    private spawn1Triggered: boolean = false;
    private spawn2Triggered: boolean = false;

    public checkCollision(pacmanPos: { x: number, y: number }): boolean {
        if (!this.activeFruit) return false;

        const dist = Math.sqrt(
            Math.pow(pacmanPos.x - FRUIT_SPAWN_POS.x, 2) +
            Math.pow(pacmanPos.y - FRUIT_SPAWN_POS.y, 2)
        );

        return dist < 4; // Collision threshold
    }

    public updateDotsEaten(count: number) {
        this.dotsEaten = count;
        this.checkSpawning();
    }

    public update(frames: number) {
        if (this.activeFruit) {
            this.activeFruit.timer -= frames;
            if (this.activeFruit.timer <= 0) {
                this.activeFruit = null;
            }
        }
    }

    public reset() {
        this.activeFruit = null;
    }

    public setLevel(level: number) {
        this.currentLevel = level;
        this.resetLevelState();
    }

    private resetLevelState() {
        this.spawn1Triggered = false;
        this.spawn2Triggered = false;
        this.activeFruit = null;
    }

    private checkSpawning() {
        if (!this.spawn1Triggered && this.dotsEaten >= 70) {
            this.spawn1Triggered = true;
            this.spawnFruit();
        } else if (!this.spawn2Triggered && this.dotsEaten >= 170) {
            this.spawn2Triggered = true;
            this.spawnFruit();
        }
    }

    private spawnFruit() {
        const data = getFruitDataForLevel(this.currentLevel);
        console.log(`Fruit spawned: ${data.type}`);
        this.activeFruit = {
            data,
            level: this.currentLevel,
            timer: 9.5 * 60 // Default frames at 60fps, will refine in lifecycle task
        };
    }

    public getActiveFruit(): ActiveFruit | null {
        return this.activeFruit;
    }

    public clearFruit() {
        this.activeFruit = null;
    }
}
