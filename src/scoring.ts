export class ScoringEngine {
    private score: number = 0;
    private static highScore: number = 0;
    private ghostMultiplier: number = 1;
    private dotsEaten: number = 0;
    private static readonly STORAGE_KEY = 'pacman_highscore';

    constructor() {
        this.loadHighScore();
    }

    public loadHighScore() {
        try {
            const stored = localStorage.getItem(ScoringEngine.STORAGE_KEY);
            if (stored) {
                ScoringEngine.highScore = parseInt(stored, 10) || 0;
            }
        } catch (e) {
            console.error('Failed to load high score', e);
        }
    }

    public saveHighScore() {
        try {
            localStorage.setItem(ScoringEngine.STORAGE_KEY, ScoringEngine.highScore.toString());
        } catch (e) {
            console.error('Failed to save high score', e);
        }
    }

    public addDot() {
        this.score += 10;
        this.dotsEaten++;
    }

    public addPowerPellet() {
        this.score += 50;
        this.dotsEaten++;
    }

    public getDotsEaten(): number {
        return this.dotsEaten;
    }

    public resetDotsEaten() {
        this.dotsEaten = 0;
    }

    public addFruit(points: number) {
        this.score += points;
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

    public getGhostMultiplier(): number {
        return this.ghostMultiplier;
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
