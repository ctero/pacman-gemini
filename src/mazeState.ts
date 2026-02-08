import { MazeTile } from './mazeData';

export class MazeState {
    private data: MazeTile[][];
    private itemsCount: number = 0;

    constructor(initialData: MazeTile[][]) {
        // Deep copy the maze data to track state independently
        this.data = initialData.map(row => [...row]);
        this.calculateItemsCount();
    }

    private calculateItemsCount() {
        this.itemsCount = 0;
        for (const row of this.data) {
            for (const tile of row) {
                if (tile === MazeTile.DOT || tile === MazeTile.POWER_PELLET) {
                    this.itemsCount++;
                }
            }
        }
    }

    public getTile(x: number, y: number): MazeTile {
        if (y < 0 || y >= this.data.length || x < 0 || x >= this.data[0].length) {
            return MazeTile.EMPTY;
        }
        return this.data[y][x];
    }

    public removeLevelItem(x: number, y: number) {
        if (y < 0 || y >= this.data.length || x < 0 || x >= this.data[0].length) {
            return;
        }
        const tile = this.data[y][x];
        if (tile === MazeTile.DOT || tile === MazeTile.POWER_PELLET) {
            this.data[y][x] = MazeTile.EMPTY;
            this.itemsCount--;
        }
    }

    public getRemainingItemsCount(): number {
        return this.itemsCount;
    }

    public getData(): MazeTile[][] {
        return this.data;
    }
}
