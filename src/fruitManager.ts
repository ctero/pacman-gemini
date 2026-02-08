import { FruitType, FruitData, getFruitDataForLevel } from './fruit';

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

    public updateDotsEaten(count: number) {
        this.dotsEaten = count;
        this.checkSpawning();
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
