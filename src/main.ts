import { Application } from 'pixi.js';
import { MazeRenderer } from './mazeRenderer';
import { MAZE_DATA, MazeTile } from './mazeData';
import { PacMan } from './pacman';
import { Ghost } from './ghost';
import { Direction, GhostState } from './types';
import { TILE_SIZE } from './constants';
import { GameState, GhostMode, GameStatus } from './gameState';
import { getBlinkyTarget, getPinkyTarget, getInkyTarget, getClydeTarget } from './ghostTargeting';
import { checkCollision } from './collision';
import { MazeState } from './mazeState';
import { ScoringEngine } from './scoring';
import { ScoringUI } from './scoringUI';
import { AudioManager } from './audioManager';
import { FruitManager } from './fruitManager';
import { FruitRenderer } from './fruitRenderer';
import { GhostHouseManager } from './ghostHouseManager';

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

    const audioManager = new AudioManager();
    const gameState = new GameState();
    const scoringEngine = new ScoringEngine();
    const fruitManager = new FruitManager();
    const fruitRenderer = new FruitRenderer();
    const ghostHouseManager = new GhostHouseManager();
    const scoringUI = new ScoringUI();
    scoringUI.addTo(app.stage);
    scoringUI.update(0, scoringEngine.getHighScore(), gameState.lives);
    scoringUI.showReady(true);

    let mazeState = new MazeState(MAZE_DATA);
    const mazeRenderer = new MazeRenderer();
    mazeRenderer.render(mazeState.getData());
    mazeRenderer.addTo(app.stage);
    fruitRenderer.addTo(app.stage);

    const pacman = new PacMan(13.5 * TILE_SIZE, 26 * TILE_SIZE);
    const updatePacmanSpeeds = () => {
        const data = gameState.getLevelData();
        const arcadeBasePixelSpeed = (80 / 60); 
        pacman.setBaseSpeed(data.pacmanSpeed * arcadeBasePixelSpeed);
        pacman.setEatingSpeed(data.pacmanEatingSpeed * arcadeBasePixelSpeed);
    };
    updatePacmanSpeeds();
    app.stage.addChild(pacman.container);

    const blinky = new Ghost(13.5 * TILE_SIZE, 14 * TILE_SIZE, 0xff0000);
    const pinky = new Ghost(13.5 * TILE_SIZE, 17 * TILE_SIZE, 0xffb8ff);
    const inky = new Ghost(11.5 * TILE_SIZE, 17 * TILE_SIZE, 0x00ffff);
    const clyde = new Ghost(15.5 * TILE_SIZE, 17 * TILE_SIZE, 0xffb852);

    const ghosts = [blinky, pinky, inky, clyde];
    const updateGhostSpeeds = () => {
        const data = gameState.getLevelData();
        const arcadeBasePixelSpeed = (80 / 60);
        ghosts.forEach(g => {
            g.setSpeeds({
                base: data.ghostSpeed * arcadeBasePixelSpeed,
                frightened: data.ghostFrightenedSpeed * arcadeBasePixelSpeed,
                tunnel: data.ghostTunnelSpeed * arcadeBasePixelSpeed
            });
        });

        // Blinky (Red Ghost) Cruise Elroy logic
        const dotsRemaining = mazeState.getRemainingItemsCount();
        if (dotsRemaining <= data.elroy2Dots) {
            blinky.setCruiseElroySpeed(data.elroy2Speed * arcadeBasePixelSpeed);
        } else if (dotsRemaining <= data.elroy1Dots) {
            blinky.setCruiseElroySpeed(data.elroy1Speed * arcadeBasePixelSpeed);
        } else {
            blinky.setCruiseElroySpeed(null);
        }
    };
    updateGhostSpeeds();
    app.stage.addChild(...ghosts.map(g => g.container));

    // Ensure UI is on top
    scoringUI.addTo(app.stage);

    let gameStarted = false;

    const resetPositions = () => {
        pacman.reset(13.5 * TILE_SIZE, 26 * TILE_SIZE);

        blinky.reset(13.5 * TILE_SIZE, 14 * TILE_SIZE);
        pinky.reset(13.5 * TILE_SIZE, 17 * TILE_SIZE);
        inky.reset(11.5 * TILE_SIZE, 17 * TILE_SIZE);
        clyde.reset(15.5 * TILE_SIZE, 17 * TILE_SIZE);

        fruitManager.reset();

        if (gameState.lives > 0) {
            ghostHouseManager.resetForNewLife();
            scoringUI.showReady(true);
            gameState.status = GameStatus.READY;
        } else {
            scoringUI.showGameOver(true);
            gameState.status = GameStatus.GAME_OVER;
            scoringEngine.saveHighScore();
        }
        scoringUI.update(scoringEngine.getScore(), scoringEngine.getHighScore(), gameState.lives);
    };

    const startGame = () => {
        if (gameStarted && gameState.status !== GameStatus.READY) return;
        gameStarted = true;
        gameState.status = GameStatus.PLAYING;
        scoringUI.showReady(false);
        audioManager.play('intro');
        // Resume siren after intro
        setTimeout(() => {
            if (!audioManager.isPlaying('siren') && gameState.status === GameStatus.PLAYING) {
                audioManager.play('siren', true);
            }
        }, 4000);
    };

    // Initialize UI and state
    resetPositions();

    // User interaction required for audio
    window.addEventListener('keydown', () => {
        if (!gameStarted || gameState.status === GameStatus.READY) {
            startGame();
        } else if (gameState.status === GameStatus.GAME_OVER) {
            // Full reset for new game
            gameState.lives = 3;
            scoringEngine.resetGhostMultiplier();
            // score reset? usually yes for new game
            // we'd need a full reset function
            window.location.reload(); 
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') pacman.setNextDirection(Direction.UP);
        if (e.key === 'ArrowDown') pacman.setNextDirection(Direction.DOWN);
        if (e.key === 'ArrowLeft') pacman.setNextDirection(Direction.LEFT);
        if (e.key === 'ArrowRight') pacman.setNextDirection(Direction.RIGHT);
    });

    app.ticker.add((ticker) => {
        if (!gameStarted || gameState.status === GameStatus.GAME_OVER) return;

        if (gameState.status === GameStatus.LEVEL_COMPLETE) {
            // Handle flashing animation before next level
            return;
        }

        const wasPaused = gameState.isPaused();
        gameState.update(ticker.deltaTime);
        const isPaused = gameState.isPaused();

        if (wasPaused && !isPaused) {
            // Resume visibility after freeze-frame
            pacman.setVisible(true);
            ghosts.forEach(g => g.setVisible(true));
        }

        if (isPaused) return;

        if (gameState.status !== GameStatus.PLAYING) return;

        fruitManager.update(ticker.deltaTime);
        updateGhostSpeeds();

        ghosts.forEach((ghost) => {
            if (ghost.isInHouse() && ghostHouseManager.shouldReleaseGhost(ghosts.indexOf(ghost))) {
                ghost.forceExitHouse();
            }
        });

        const activeFruitForRender = fruitManager.getActiveFruit();
        fruitRenderer.render(activeFruitForRender ? activeFruitForRender.data.type : null);
        
        pacman.update(ticker.deltaTime, mazeState.getData());

        const activeFruit = fruitManager.getActiveFruit();
        if (activeFruit && fruitManager.checkCollision({ x: pacman.x, y: pacman.y })) {
            console.log(`Fruit eaten: ${activeFruit.data.type}`);
            scoringEngine.addFruit(activeFruit.data.points);
            scoringUI.showScorePopup(pacman.x, pacman.y, activeFruit.data.points);
            scoringUI.update(scoringEngine.getScore(), scoringEngine.getHighScore(), gameState.lives);
            fruitManager.clearFruit();
        }

        const eaten = pacman.eat(mazeState);
        if (eaten !== MazeTile.EMPTY) {
            mazeRenderer.renderItems(mazeState.getData());
            if (eaten === MazeTile.POWER_PELLET) {
                gameState.startFrightenedMode();
                ghosts.forEach(g => g.setFrightened(true));
                scoringEngine.addPowerPellet();
                scoringEngine.resetGhostMultiplier();
                
                audioManager.stop('siren');
                audioManager.play('power_siren', true);
            } else if (eaten === MazeTile.DOT) {
                scoringEngine.addDot();
                if (!audioManager.isPlaying('chomp')) {
                    audioManager.play('chomp');
                }
            }
            fruitManager.updateDotsEaten(scoringEngine.getDotsEaten());
            ghostHouseManager.updateDots(scoringEngine.getDotsEaten());
            scoringEngine.updateHighScore();
            scoringUI.update(scoringEngine.getScore(), scoringEngine.getHighScore(), gameState.lives);

            // Check for level completion
            if (mazeState.getRemainingItemsCount() === 0) {
                gameState.status = GameStatus.LEVEL_COMPLETE;
                audioManager.stop('siren');
                audioManager.stop('power_siren');
                
                // Flash animation sequence
                let flashCount = 0;
                const flashInterval = setInterval(() => {
                    mazeRenderer.flashWalls(mazeState.getData(), flashCount % 2 === 0);
                    flashCount++;
                    if (flashCount > 10) {
                        clearInterval(flashInterval);
                        gameState.nextLevel();
                        scoringEngine.resetDotsEaten();
                        fruitManager.setLevel(gameState.level);
                        ghostHouseManager.setLevel(gameState.level);
                        updatePacmanSpeeds();
                        updateGhostSpeeds();
                        mazeState = new MazeState(MAZE_DATA);
                        mazeRenderer.render(mazeState.getData());
                        resetPositions();
                    }
                }, 200);
            }
        }

        // Handle FRIGHTENED mode ending
        if (gameState.ghostMode !== GhostMode.FRIGHTENED) {
            if (audioManager.isPlaying('power_siren')) {
                audioManager.stop('power_siren');
                audioManager.play('siren', true);
            }
            ghosts.forEach(g => {
                if (g.isFrightened()) {
                    g.setFrightened(false);
                    g.setFlashing(false);
                }
            });
        } else if (gameState.isFlashing()) {
            ghosts.forEach(g => {
                if (g.isFrightened()) {
                    g.setFlashing(true);
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

        ghosts.forEach((ghost) => {
            ghost.update(mazeState.getData());
            if (checkCollision(pacman, ghost)) {
                if (ghost.isFrightened()) {
                    console.log('Ghost eaten!');
                    audioManager.play('eat_ghost');
                    
                    const score = 200 * scoringEngine.getGhostMultiplier();
                    scoringEngine.addGhost();
                    scoringEngine.updateHighScore();
                    scoringUI.update(scoringEngine.getScore(), scoringEngine.getHighScore(), gameState.lives);
                    scoringUI.showScorePopup(ghost.x, ghost.y, score);

                    // Freeze-frame
                    gameState.pause(60);
                    pacman.setVisible(false);
                    ghost.setVisible(false);
                    ghost.setEaten();
                } else if (ghost.getState() !== GhostState.EATEN && ghost.getState() !== GhostState.ENTERING_HOUSE) {
                    console.log('Pac-Man caught!');
                    audioManager.stop('siren');
                    audioManager.stop('power_siren');
                    audioManager.play('death');
                    gameState.loseLife();
                    resetPositions();
                }
            }
        });
    });

    console.log('Pac-Man engine initialized');
}

init();
