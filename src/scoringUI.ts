import { Container, Text, TextStyle, Graphics } from 'pixi.js';

export class ScoringUI {
    public scoreContainer: Container;
    private scoreText: Text;
    private highScoreText: Text;
    private livesContainer: Container;
    private readyText: Text;
    private gameOverText: Text;

    constructor() {
        this.scoreContainer = new Container();
        this.livesContainer = new Container();
        this.livesContainer.position.set(16, 272);

        const style = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 8,
            fill: 0xffffff,
            align: 'center',
        });

        const labelStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 8,
            fill: 0xffffff,
        });

        const readyStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 8,
            fill: 0xffff00,
        });

        const gameOverStyle = new TextStyle({
            fontFamily: 'monospace',
            fontSize: 8,
            fill: 0xff0000,
        });

        // 1UP Label
        const oneUpLabel = new Text({ text: '1UP', style: labelStyle });
        oneUpLabel.position.set(24, 0);
        
        this.scoreText = new Text({ text: '00', style });
        this.scoreText.position.set(48, 8);
        this.scoreText.anchor.set(1, 0); // Right aligned

        // HIGH SCORE Label
        const highScoreLabel = new Text({ text: 'HIGH SCORE', style: labelStyle });
        highScoreLabel.position.set(80, 0);

        this.highScoreText = new Text({ text: '00', style });
        this.highScoreText.position.set(128, 8);
        this.highScoreText.anchor.set(1, 0);

        this.readyText = new Text({ text: 'READY!', style: readyStyle });
        this.readyText.position.set(112, 160);
        this.readyText.anchor.set(0.5, 0.5);
        this.readyText.visible = false;

        this.gameOverText = new Text({ text: 'GAME  OVER', style: gameOverStyle });
        this.gameOverText.position.set(112, 160);
        this.gameOverText.anchor.set(0.5, 0.5);
        this.gameOverText.visible = false;

        this.scoreContainer.addChild(oneUpLabel, this.scoreText, highScoreLabel, this.highScoreText);
        this.scoreContainer.addChild(this.livesContainer, this.readyText, this.gameOverText);
    }

    public showReady(visible: boolean) {
        this.readyText.visible = visible;
    }

    public showGameOver(visible: boolean) {
        this.gameOverText.visible = visible;
    }

    public update(score: number, highScore: number, lives: number) {
        this.scoreText.text = score.toString().padStart(2, '0');
        this.highScoreText.text = highScore.toString().padStart(2, '0');
        this.drawLives(lives);
    }

    private drawLives(count: number) {
        this.livesContainer.removeChildren();
        for (let i = 0; i < count - 1; i++) { // -1 because current life is Pac-Man in the maze
            const icon = new Graphics();
            icon.beginPath();
            icon.moveTo(4, 4);
            icon.arc(4, 4, 4, 0.4, 2 * Math.PI - 0.4);
            icon.lineTo(4, 4);
            icon.fill(0xffff00);
            icon.position.set(i * 16, 0);
            this.livesContainer.addChild(icon);
        }
    }

    public addTo(parent: Container) {
        parent.addChild(this.scoreContainer);
    }
}
