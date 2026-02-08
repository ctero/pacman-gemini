import { Direction, Point } from './types';
import { MazeTile } from './mazeData';
import { TILE_SIZE } from './constants';

export function chooseNextDirection(
    currentPos: Point,
    currentDir: Direction,
    targetPos: Point,
    maze: MazeTile[][]
): Direction {
    const possibleDirs = [Direction.UP, Direction.LEFT, Direction.DOWN, Direction.RIGHT];
    const oppositeDir = getOppositeDirection(currentDir);

    let bestDir = Direction.NONE;
    let minDistance = Infinity;

    // Arcade rule: Ghosts priority is UP > LEFT > DOWN > RIGHT if distances are tied
    for (const dir of possibleDirs) {
        // Cannot reverse
        if (dir === oppositeDir && currentDir !== Direction.NONE) continue;

        if (canGhostMove(currentPos, dir, maze)) {
            const nextTile = getNextTileCenter(currentPos, dir);
            const dist = getDistanceSquared(nextTile, targetPos);

            if (dist < minDistance) {
                minDistance = dist;
                bestDir = dir;
            }
        }
    }

    return bestDir;
}

function getOppositeDirection(dir: Direction): Direction {
    if (dir === Direction.UP) return Direction.DOWN;
    if (dir === Direction.DOWN) return Direction.UP;
    if (dir === Direction.LEFT) return Direction.RIGHT;
    if (dir === Direction.RIGHT) return Direction.LEFT;
    return Direction.NONE;
}

function canGhostMove(pos: Point, dir: Direction, maze: MazeTile[][]): boolean {
    const nextTile = getNextTileCoords(pos, dir);
    
    // Tunnels
    if (nextTile.x < 0 || nextTile.x >= 28) return true;
    if (nextTile.y < 0 || nextTile.y >= 36) return true;

    const tile = maze[nextTile.y][nextTile.x];
    return tile !== MazeTile.WALL;
}

function getNextTileCoords(pos: Point, dir: Direction): Point {
    const tileX = Math.round(pos.x / TILE_SIZE);
    const tileY = Math.round(pos.y / TILE_SIZE);

    if (dir === Direction.UP) return { x: tileX, y: tileY - 1 };
    if (dir === Direction.DOWN) return { x: tileX, y: tileY + 1 };
    if (dir === Direction.LEFT) return { x: tileX - 1, y: tileY };
    if (dir === Direction.RIGHT) return { x: tileX + 1, y: tileY };
    return { x: tileX, y: tileY };
}

function getNextTileCenter(pos: Point, dir: Direction): Point {
    const coords = getNextTileCoords(pos, dir);
    return {
        x: coords.x * TILE_SIZE,
        y: coords.y * TILE_SIZE
    };
}

function getDistanceSquared(p1: Point, p2: Point): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy;
}
