import { Container, Text, TextStyle } from 'pixi.js';

export class ScoringUI {
    public scoreContainer: Container;
    private scoreText: Text;
    private highScoreText: Text;

    constructor() {
        this.scoreContainer = new Container();

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

        this.scoreContainer.addChild(oneUpLabel, this.scoreText, highScoreLabel, this.highScoreText);
    }

    public update(score: number, highScore: number) {
        this.scoreText.text = score.toString().padStart(2, '0');
        this.highScoreText.text = highScore.toString().padStart(2, '0');
    }

    public addTo(parent: Container) {
        parent.addChild(this.scoreContainer);
    }
}
