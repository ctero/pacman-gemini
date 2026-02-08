export enum GhostMode {
    SCATTER = 0,
    CHASE = 1,
    FRIGHTENED = 2,
    EATEN = 3
}

export enum GameStatus {
    READY = 0,
    PLAYING = 1,
    LEVEL_COMPLETE = 2,
    GAME_OVER = 3
}

export class GameState {
    public ghostMode: GhostMode = GhostMode.SCATTER;
    public status: GameStatus = GameStatus.READY;
    public level: number = 1;
    public lives: number = 3;
    private timer: number = 0;
    private phaseIndex: number = 0;
    private frightenedTimer: number = 0;
    private previousMode: GhostMode = GhostMode.SCATTER;

    private level1Phases = [
        { mode: GhostMode.SCATTER, duration: 7 * 60 },
        { mode: GhostMode.CHASE, duration: 20 * 60 },
        { mode: GhostMode.SCATTER, duration: 7 * 60 },
        { mode: GhostMode.CHASE, duration: 20 * 60 },
        { mode: GhostMode.SCATTER, duration: 5 * 60 },
        { mode: GhostMode.CHASE, duration: 20 * 60 },
        { mode: GhostMode.SCATTER, duration: 5 * 60 },
        { mode: GhostMode.CHASE, duration: Infinity }
    ];

    public startFrightenedMode() {
        if (this.ghostMode !== GhostMode.FRIGHTENED) {
            this.previousMode = this.ghostMode;
        }
        this.ghostMode = GhostMode.FRIGHTENED;
        this.frightenedTimer = 6 * 60; // 6 seconds at 60fps
    }

    public isFlashing(): boolean {
        return this.ghostMode === GhostMode.FRIGHTENED && this.frightenedTimer < 2 * 60;
    }

    public loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.status = GameStatus.GAME_OVER;
        } else {
            this.status = GameStatus.READY;
        }
    }

    public nextLevel() {
        this.level++;
        this.status = GameStatus.READY;
        this.timer = 0;
        this.phaseIndex = 0;
        this.frightenedTimer = 0;
    }

    public update(frames: number) {
        if (this.status !== GameStatus.PLAYING) return;

        if (this.ghostMode === GhostMode.FRIGHTENED) {
            this.frightenedTimer -= frames;
            if (this.frightenedTimer <= 0) {
                this.ghostMode = this.previousMode;
            }
            return;
        }

        this.timer += frames;
        
        while (this.phaseIndex < this.level1Phases.length) {
            const currentPhase = this.level1Phases[this.phaseIndex];
            if (this.timer >= currentPhase.duration) {
                this.timer -= currentPhase.duration;
                this.phaseIndex++;
                if (this.phaseIndex < this.level1Phases.length) {
                    this.ghostMode = this.level1Phases[this.phaseIndex].mode;
                }
            } else {
                this.ghostMode = currentPhase.mode;
                break;
            }
        }
    }
}