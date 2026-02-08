# Specification: Ghost Eaten Mechanics & House Return

## Overview
Implement the full lifecycle of a ghost after being eaten by Pac-Man. This includes the momentary freeze-frame, score display, the "eyes" state (EATEN) with rapid return to the ghost house, and the regeneration process.

## Functional Requirements

### 1. Ghost States
- **EATEN State:**
    - Triggered upon collision between Pac-Man and a Frightened ghost.
    - Ghost visual changes to eyes only.
    - Movement speed increases significantly (e.g., 200% or 300% of base speed).
    - Navigation targets the ghost house entrance tile (14, 14).
- **ENTERING_HOUSE State:**
    - Triggered when the "eyes" reach the entrance tile.
    - Ghost moves from the entrance to its designated start position inside the house.
- **REGENERATING State:**
    - Brief transition inside the house where the ghost returns to its normal appearance.
    - Transitions back to the standard Ghost state (Normal or Frightened depending on current GameState).

### 2. Eaten Interaction (The "Freeze-Frame")
- **Pause Mechanic:**
    - Upon collision, the entire game engine `update` loop must pause for 60 frames (1 second).
- **Visuals during Pause:**
    - Pac-Man and the caught ghost are hidden.
    - A score popup (200, 400, 800, or 1600) is displayed at the collision coordinates.
- **Post-Pause:**
    - Pac-Man reappears.
    - The caught ghost reappears as "eyes" and begins its return journey.
    - Other ghosts resume movement from their frozen positions.

### 3. Navigation & Speed
- Eaten ghosts must use the shortest path to tile (14, 14).
- Movement must be restricted to the same maze constraints as normal ghosts (no reversing directions except upon state change).

## Acceptance Criteria
- [ ] Collision with a blue ghost triggers a 1-second game-wide freeze.
- [ ] Score popup displays correctly during the freeze (doubling for each ghost caught in one power pellet cycle).
- [ ] After the freeze, only eyes move back to the ghost house entrance at high speed.
- [ ] Once eyes reach the house, the ghost regenerates and resumes its normal behavior.
- [ ] All other ghosts and Pac-Man stop and start correctly during the freeze.

## Out of Scope
- Implementation of the "Intermission" animations.
- Changes to the Power Pellet duration or flashing logic (already implemented).
