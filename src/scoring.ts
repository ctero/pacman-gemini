export class ScoringEngine {
    private score: number = 0;
    private static highScore: number = 0;
    private ghostMultiplier: number = 1;

    public addDot() {
        this.score += 10;
    }

    public addPowerPellet() {
        this.score += 50;
    }

    public addGhost() {
        this.score += 200 * this.ghostMultiplier;
        this.ghostMultiplier *= 2;
        if (this.ghostMultiplier > 8) {
            this.ghostMultiplier = 8;
        }
    }

    public resetGhostMultiplier() {
        this.ghostMultiplier = 1;
    }

    public getScore(): number {
        return this.score;
    }

    public getHighScore(): number {
        return ScoringEngine.highScore;
    }

    public updateHighScore() {
        if (this.score > ScoringEngine.highScore) {
            ScoringEngine.highScore = this.score;
        }
    }
}
