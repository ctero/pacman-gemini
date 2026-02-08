export class GhostHouseManager {
    private currentLevel: number = 1;
    private dotsEatenInLevel: number = 0;
    private globalCounterActive: boolean = false;
    private globalDots: number = 0;
    private personalDots: number[] = [0, 0, 0, 0]; // Blinky, Pinky, Inky, Clyde
    
    // Personal dot limits per level
    // Index 1: Pinky, 2: Inky, 3: Clyde
    private personalLimits: Record<number, number[]> = {
        1: [0, 0, 30, 60],
        2: [0, 0, 0, 50],
        default: [0, 0, 0, 0]
    };

    // Global limits (used after life loss)
    private globalLimits = [0, 7, 17, 32];

    public setLevel(level: number) {
        this.currentLevel = level;
        this.dotsEatenInLevel = 0;
        this.globalCounterActive = false;
        this.personalDots = [0, 0, 0, 0];
    }

    public resetForNewLife() {
        this.globalCounterActive = true;
        this.globalDots = 0;
    }

    public updateDots(totalDotsEaten: number) {
        // In the arcade, personal counters only increment for the ghost at the "head of the line"
        // But for simplicity, we'll increment based on what's active.
        if (this.globalCounterActive) {
            this.globalDots++;
        } else {
            // Find the first ghost still in house and increment its counter
            // (Handled externally or we track state here)
            this.dotsEatenInLevel = totalDotsEaten;
        }
    }

    public shouldReleaseGhost(ghostIndex: number): boolean {
        if (ghostIndex === 0) return true; // Blinky always out

        if (this.globalCounterActive) {
            if (this.globalDots >= this.globalLimits[ghostIndex]) {
                if (ghostIndex === 3) {
                    this.globalCounterActive = false; // Clyde is last
                }
                return true;
            }
            return false;
        }

        const limits = this.personalLimits[this.currentLevel] || this.personalLimits.default;
        return this.dotsEatenInLevel >= limits[ghostIndex];
    }
}
