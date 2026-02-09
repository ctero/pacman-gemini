# Specification: Ghost Eyes Entrance Bug Fix

## Overview
Fix a bug where ghost eyes, after being eaten, reach the ghost house entrance (tile 14, 14) but fail to pass through the door, instead "bouncing" or jittering at the gate.

## Functional Requirements
- **Entrance Detection:** Ensure the transition from `EATEN` state to `ENTERING_HOUSE` state occurs reliably when the ghost is within a small threshold of the entrance tile (14, 14).
- **Door Permeability:** Ensure that ghosts in the `ENTERING_HOUSE` state are not blocked by the `GHOST_HOUSE_DOOR` tile or any collision logic that prevents normal ghosts from entering the house.
- **Vertical Movement:** The ghost must be able to move vertically from Row 14 (entrance) to its specific home position in Row 17 without being pushed back by the maze logic.
- **State Priority:** Verify that the `handleEntering()` logic correctly overrides the standard `update()` movement when the ghost is entering the house.

## Acceptance Criteria
- [ ] Ghost eyes reaching tile (14, 14) must immediately transition to moving downward into the house.
- [ ] The jittering/bouncing behavior at the entrance must be eliminated.
- [ ] Ghosts must successfully reach their designated home positions and regenerate as normal ghosts.
- [ ] Automated tests must verify that `ENTERING_HOUSE` state ignores door collisions.

## Out of Scope
- Changes to the ghost house release logic (handled by `GhostHouseManager`).
- Visual changes to the eyes or ghost house.
