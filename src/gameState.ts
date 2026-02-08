import { GhostMode, GameStatus } from './types';
import { getArcadeLevelData, ArcadeLevelData, SCATTER_CHASE_TABLE } from './arcadeData';

export { GhostMode, GameStatus };

export class GameState {
    public ghostMode: GhostMode = GhostMode.SCATTER;
    public status: GameStatus = GameStatus.READY;
    public level: number = 1;
    public lives: number = 3;
    private timer: number = 0;
    private phaseIndex: number = 0;
    private frightenedTimer: number = 0;
    private previousMode: GhostMode = GhostMode.SCATTER;
    private levelData: ArcadeLevelData;

    constructor() {
        this.levelData = getArcadeLevelData(this.level);
    }

    public getLevelData(): ArcadeLevelData {
        return this.levelData;
    }

    public startFrightenedMode() {
        if (this.ghostMode !== GhostMode.FRIGHTENED) {
            this.previousMode = this.ghostMode;
        }
        this.ghostMode = GhostMode.FRIGHTENED;
        this.frightenedTimer = this.levelData.frightenedDuration * 60;
    }

    public isFlashing(): boolean {
        // Arcade has specific flash counts, but we'll use a threshold for now
        // matches frightenedFlashes * specific flash duration
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
        this.levelData = getArcadeLevelData(this.level);
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
        
        while (this.phaseIndex < SCATTER_CHASE_TABLE.length) {
            const currentPhase = SCATTER_CHASE_TABLE[this.phaseIndex];
            const durationFrames = currentPhase.duration === Infinity ? Infinity : currentPhase.duration * 60;
            
            if (this.timer >= durationFrames) {
                this.timer -= durationFrames;
                this.phaseIndex++;
                if (this.phaseIndex < SCATTER_CHASE_TABLE.length) {
                    const nextMode = SCATTER_CHASE_TABLE[this.phaseIndex].mode;
                    this.ghostMode = nextMode === 'SCATTER' ? GhostMode.SCATTER : GhostMode.CHASE;
                }
            } else {
                this.ghostMode = currentPhase.mode === 'SCATTER' ? GhostMode.SCATTER : GhostMode.CHASE;
                break;
            }
        }
    }
}