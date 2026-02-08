import { Application } from 'pixi.js';
import { MazeRenderer } from './mazeRenderer';
import { MAZE_DATA, MazeTile } from './mazeData';
import { PacMan } from './pacman';
import { Ghost } from './ghost';
import { Direction } from './types';
import { TILE_SIZE } from './constants';
import { GameState, GhostMode } from './gameState';
import { getBlinkyTarget, getPinkyTarget, getInkyTarget, getClydeTarget } from './ghostTargeting';
import { checkCollision } from './collision';
import { MazeState } from './mazeState';
import { ScoringEngine } from './scoring';
import { ScoringUI } from './scoringUI';

async function init() {
    const app = new Application();

    await app.init({
        width: 224,
        height: 288,
        backgroundColor: 0x000000,
        antialias: false,
        resolution: window.devicePixelRatio || 1,
    });

    app.canvas.style.imageRendering = 'pixelated';
    document.getElementById('app')?.appendChild(app.canvas);

    const gameState = new GameState();
    const scoringEngine = new ScoringEngine();
    const scoringUI = new ScoringUI();
    scoringUI.addTo(app.stage);

    const mazeState = new MazeState(MAZE_DATA);
    const mazeRenderer = new MazeRenderer();
    mazeRenderer.render(mazeState.getData());
    mazeRenderer.addTo(app.stage);

    const pacman = new PacMan(13.5 * TILE_SIZE, 26 * TILE_SIZE);
    app.stage.addChild(pacman.container);

    const blinky = new Ghost(13.5 * TILE_SIZE, 14 * TILE_SIZE, 0xff0000);
    const pinky = new Ghost(13.5 * TILE_SIZE, 17 * TILE_SIZE, 0xffb8ff);
    const inky = new Ghost(11.5 * TILE_SIZE, 17 * TILE_SIZE, 0x00ffff);
    const clyde = new Ghost(15.5 * TILE_SIZE, 17 * TILE_SIZE, 0xffb852);

    const ghosts = [blinky, pinky, inky, clyde];
    app.stage.addChild(...ghosts.map(g => g.container));

    const resetPositions = () => {
        pacman.x = 13.5 * TILE_SIZE;
        pacman.y = 26 * TILE_SIZE;
        pacman.direction = Direction.NONE;
        pacman.nextDirection = Direction.NONE;

        blinky.x = 13.5 * TILE_SIZE; blinky.y = 14 * TILE_SIZE;
        pinky.x = 13.5 * TILE_SIZE; pinky.y = 17 * TILE_SIZE;
        inky.x = 11.5 * TILE_SIZE; inky.y = 17 * TILE_SIZE;
        clyde.x = 15.5 * TILE_SIZE; clyde.y = 17 * TILE_SIZE;

        ghosts.forEach(g => {
            g.direction = Direction.NONE;
            g.setHouseTimer(60); // 1 second wait
        });
    };

    resetPositions();

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') pacman.setNextDirection(Direction.UP);
        if (e.key === 'ArrowDown') pacman.setNextDirection(Direction.DOWN);
        if (e.key === 'ArrowLeft') pacman.setNextDirection(Direction.LEFT);
        if (e.key === 'ArrowRight') pacman.setNextDirection(Direction.RIGHT);
    });

    app.ticker.add((ticker) => {
        gameState.update(ticker.deltaTime);
        pacman.update(ticker.deltaTime, mazeState.getData());

        const eaten = pacman.eat(mazeState);
        if (eaten !== MazeTile.EMPTY) {
            mazeRenderer.renderItems(mazeState.getData());
            if (eaten === MazeTile.POWER_PELLET) {
                gameState.startFrightenedMode();
                ghosts.forEach(g => g.setFrightened(true));
                scoringEngine.addPowerPellet();
                scoringEngine.resetGhostMultiplier();
            } else if (eaten === MazeTile.DOT) {
                scoringEngine.addDot();
            }
            scoringEngine.updateHighScore();
            scoringUI.update(scoringEngine.getScore(), scoringEngine.getHighScore());
        }

        // Handle FRIGHTENED mode ending
        if (gameState.ghostMode !== GhostMode.FRIGHTENED) {
            ghosts.forEach(g => {
                if (g.isFrightened()) {
                    g.setFrightened(false);
                }
            });
        }

        // Update Ghost AI Targets
        if (gameState.ghostMode === GhostMode.CHASE) {
            blinky.setTarget(getBlinkyTarget({ x: pacman.x, y: pacman.y }));
            pinky.setTarget(getPinkyTarget({ x: pacman.x, y: pacman.y }, pacman.direction));
            inky.setTarget(getInkyTarget({ x: pacman.x, y: pacman.y }, pacman.direction, { x: blinky.x, y: blinky.y }));
            clyde.setTarget(getClydeTarget({ x: clyde.x, y: clyde.y }, { x: pacman.x, y: pacman.y }));
        } else if (gameState.ghostMode === GhostMode.SCATTER) {
            blinky.setTarget({ x: 25 * TILE_SIZE, y: -2 * TILE_SIZE }); // Top Right
            pinky.setTarget({ x: 2 * TILE_SIZE, y: -2 * TILE_SIZE });  // Top Left
            inky.setTarget({ x: 27 * TILE_SIZE, y: 34 * TILE_SIZE }); // Bottom Right
            clyde.setTarget({ x: 0, y: 34 * TILE_SIZE });             // Bottom Left
        }

        ghosts.forEach((ghost, index) => {
            ghost.update(mazeState.getData());
            if (checkCollision(pacman, ghost)) {
                if (ghost.isFrightened()) {
                    console.log('Ghost eaten!');
                    scoringEngine.addGhost();
                    scoringEngine.updateHighScore();
                    scoringUI.update(scoringEngine.getScore(), scoringEngine.getHighScore());
                    
                    const startPositions = [
                        { x: 13.5 * TILE_SIZE, y: 14 * TILE_SIZE },
                        { x: 13.5 * TILE_SIZE, y: 17 * TILE_SIZE },
                        { x: 11.5 * TILE_SIZE, y: 17 * TILE_SIZE },
                        { x: 15.5 * TILE_SIZE, y: 17 * TILE_SIZE }
                    ];
                    const pos = startPositions[index];
                    ghost.reset(pos.x, pos.y);
                } else {
                    console.log('Pac-Man caught!');
                    resetPositions();
                }
            }
        });
    });

    console.log('Pac-Man engine initialized');
}

init();
