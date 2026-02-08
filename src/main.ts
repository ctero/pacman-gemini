import { Application } from 'pixi.js';
import { MazeRenderer } from './mazeRenderer';
import { MAZE_DATA } from './mazeData';
import { PacMan } from './pacman';
import { Ghost } from './ghost';
import { Direction } from './types';
import { TILE_SIZE } from './constants';

async function init() {
    const app = new Application();

    await app.init({
        width: 224,
        height: 288,
        backgroundColor: 0x000000,
        antialias: false,
        resolution: window.devicePixelRatio || 1,
    });

    // Set pixelated scaling for pixel art
    app.canvas.style.imageRendering = 'pixelated';
    
    document.getElementById('app')?.appendChild(app.canvas);

    const mazeRenderer = new MazeRenderer();
    mazeRenderer.render(MAZE_DATA);
    mazeRenderer.addTo(app.stage);

    // Initial Pac-Man position (centered in the path at row 26)
    const pacman = new PacMan(13.5 * TILE_SIZE, 26 * TILE_SIZE);
    app.stage.addChild(pacman.container);

    // Initial Ghost positions (in the house)
    const blinky = new Ghost(13.5 * TILE_SIZE, 14 * TILE_SIZE, 0xff0000);
    const pinky = new Ghost(13.5 * TILE_SIZE, 17 * TILE_SIZE, 0xffb8ff);
    const inky = new Ghost(11.5 * TILE_SIZE, 17 * TILE_SIZE, 0x00ffff);
    const clyde = new Ghost(15.5 * TILE_SIZE, 17 * TILE_SIZE, 0xffb852);

    app.stage.addChild(blinky.container, pinky.container, inky.container, clyde.container);

    // Keyboard handling
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') pacman.setNextDirection(Direction.UP);
        if (e.key === 'ArrowDown') pacman.setNextDirection(Direction.DOWN);
        if (e.key === 'ArrowLeft') pacman.setNextDirection(Direction.LEFT);
        if (e.key === 'ArrowRight') pacman.setNextDirection(Direction.RIGHT);
    });

    app.ticker.add((ticker) => {
        pacman.update(ticker.deltaTime, MAZE_DATA);
    });

    console.log('Pac-Man engine initialized');
}

init();
