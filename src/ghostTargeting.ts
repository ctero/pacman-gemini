import { Direction, Point } from './types';
import { TILE_SIZE } from './constants';

export function getBlinkyTarget(pacmanPos: Point): Point {
    return { ...pacmanPos };
}

export function getPinkyTarget(pacmanPos: Point, pacmanDir: Direction): Point {
    const target = { ...pacmanPos };
    const offset = 4 * TILE_SIZE;

    if (pacmanDir === Direction.UP) {
        target.y -= offset;
        // The original arcade bug: Pinky's target also includes 4 tiles left when moving up
        target.x -= offset;
    } else if (pacmanDir === Direction.DOWN) {
        target.y += offset;
    } else if (pacmanDir === Direction.LEFT) {
        target.x -= offset;
    } else if (pacmanDir === Direction.RIGHT) {
        target.x += offset;
    }

    return target;
}

export function getInkyTarget(pacmanPos: Point, pacmanDir: Direction, blinkyPos: Point): Point {
    // 1. Get tile 2 spaces ahead of Pac-Man
    const offset = 2 * TILE_SIZE;
    const pivot = { ...pacmanPos };
    if (pacmanDir === Direction.UP) {
        pivot.y -= offset;
        pivot.x -= offset; // Original bug also applies here
    } else if (pacmanDir === Direction.DOWN) {
        pivot.y += offset;
    } else if (pacmanDir === Direction.LEFT) {
        pivot.x -= offset;
    } else if (pacmanDir === Direction.RIGHT) {
        pivot.x += offset;
    }

    // 2. Vector from Blinky to pivot
    const vecX = pivot.x - blinkyPos.x;
    const vecY = pivot.y - blinkyPos.y;

    // 3. Double the vector
    return {
        x: blinkyPos.x + vecX * 2,
        y: blinkyPos.y + vecY * 2
    };
}

export function getClydeTarget(clydePos: Point, pacmanPos: Point): Point {
    const dx = pacmanPos.x - clydePos.x;
    const dy = pacmanPos.y - clydePos.y;
    const distanceSquared = dx * dx + dy * dy;

    // Clyde targets Pac-Man if he's more than 8 tiles away
    const eightTilesSquared = (8 * TILE_SIZE) * (8 * TILE_SIZE);

    if (distanceSquared > eightTilesSquared) {
        return { ...pacmanPos };
    } else {
        // Otherwise he targets his corner (bottom-left)
        return { x: 0, y: 35 * TILE_SIZE };
    }
}
