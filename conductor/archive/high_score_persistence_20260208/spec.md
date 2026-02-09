# Specification - High Score Functionality

## Overview
Implement a high score system that mimics the original Pac-Man arcade game. This system will track, display, and persist the highest score achieved across game sessions.

## Functional Requirements
- **Persistence:** The high score must be saved to the browser's `localStorage` so it persists after the browser is closed or refreshed.
- **Initialization:** On game startup, the system must retrieve the stored high score. If no score is found, it should default to 0.
- **Real-time Display:** The high score must be displayed at the top center of the game screen, labeled "HIGH SCORE".
- **Real-time Updates:** If the player's current score exceeds the high score during gameplay, the high score display must update immediately to reflect the new record.
- **Final Persistence:** The new high score must be written back to `localStorage` when the game ends (Game Over).

## Non-Functional Requirements
- **Performance:** High score updates must not impact the game's frame rate.
- **Reliability:** The system should gracefully handle cases where `localStorage` might be unavailable or restricted.

## Acceptance Criteria
- [ ] High score is loaded correctly from `localStorage` on start.
- [ ] "HIGH SCORE" is visible at the top center of the UI.
- [ ] High score updates in real-time when current score > high score.
- [ ] High score persists to `localStorage` after a "Game Over".
- [ ] Refreshing the page after a high score is set shows the correct value.

## Out of Scope
- Multi-user leaderboards or name entry.
- Server-side persistence.
- Tracking multiple top scores (Top 10, etc.).
