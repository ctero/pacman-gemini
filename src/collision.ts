import { PacMan } from './pacman';
import { Ghost } from './ghost';

export function checkCollision(pacman: PacMan, ghost: Ghost): boolean {
    const dx = pacman.x - ghost.x;
    const dy = pacman.y - ghost.y;
    const distanceSquared = dx * dx + dy * dy;
    
    // Arcade collision is usually quite forgiving, tile-center based or small radius.
    // Using a threshold of approx 4-6 pixels squared (radius of 2-3 pixels).
    const threshold = 5 * 5; 
    
    return distanceSquared < threshold;
}
