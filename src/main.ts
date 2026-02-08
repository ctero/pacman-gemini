import { Application } from 'pixi.js';

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

    console.log('Pac-Man engine initialized');
}

init();
