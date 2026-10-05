# Lost Temple — Phase 1 Game Design

## Status
Phase 1 (Game Design) is complete. This document is the source of truth for the first playable release.

## Core concept
A 2D mobile adventure/puzzle game in which explorer Arin becomes trapped inside a mysterious jungle temple.

**Core loop:** Explore → solve a puzzle → avoid/defeat a trap or enemy → collect an artifact → earn coins/gems → upgrade → continue.

**Target:** Android mobile  
**Level duration:** 2–3 minutes  
**Launch story:** 10 levels

## Story pillars
- Three major secrets
- One betrayal
- Hidden rooms
- A Guardian that initially appears hostile
- Arin's grandfather connection
- Final twist: Arin's bloodline is tied to the Guardian's purpose

## Characters
### Arin
Explorer and player character. Enters the temple looking for an ancient civilization and gradually discovers his family connection.

### Mira
Arin's expedition partner. Initially helpful, later revealed to be using Arin to unlock the temple.

### The Guardian
Ancient protector. It is not simply a boss; it protects the outside world from the temple's dangerous power.

## 10-level story outline

### Level 1 — The Entrance
- Jungle temple entrance
- Basic movement and pressure plate puzzle
- Falling rock trap
- Artifact: Broken Sun Medallion
- Inscription: “THE ONE WHO ENTERS MUST REMEMBER.”
- Mira begins to behave suspiciously.

### Level 2 — The Three Levers
- Moon → Sun → Snake lever sequence
- Wrong sequence triggers darts
- Artifact: Moon Shard
- A mural depicts an explorer being sealed inside.

### Level 3 — The Hungry Temple
- Dark tunnels
- Torch-radius mechanic
- First creatures
- Artifact: Amber Eye
- Secret 1: the Guardian was not built to protect treasure.

### Level 4 — The False Path
- Gold/Stone/Roots maze
- Gold path is trapped
- Artifact: Ancient Compass
- Mira gives Arin knowingly dangerous advice.
- Compass points toward Arin rather than north.

### Level 5 — The Locked Library
- Pattern-lock puzzle
- Ancient records
- Mira takes the Moon Shard and escapes
- Betrayal is confirmed.

### Level 6 — The Broken Bridge
- Moving platforms and falling rocks
- Artifact: Guardian Key
- Mira reveals Arin's grandfather had entered the temple before.

### Level 7 — The Hidden Room
- Four-artifact placement puzzle
- Hidden portrait resembles Arin
- Artifact: Bloodstone
- Secret 2: Arin's family has a direct connection to the Guardian.

### Level 8 — The Guardian
- Guardian arena
- Dodge attacks and redirect energy instead of killing the Guardian
- Artifact: Guardian Heart
- Guardian identifies Arin as different from the thief.
- Mira reveals she needs Arin's bloodline to unlock the temple.

### Level 9 — The Last Secret
- Temple core
- Combined lever, pattern and artifact puzzle
- Secret 3: the temple contains dangerous power capable of changing/destroying the outside world.
- Mira activates the core.

### Level 10 — The Choice
- Final timed escape
- Arin uses the Guardian Heart and destroys the core
- Guardian stays behind
- Arin escapes
- Final twist: his grandfather expected him to return, and Arin was never meant to inherit the temple — he was meant to become its Guardian.

## Economy

### Currencies
- **Coins:** normal upgrade currency.
- **Gems:** rare premium-style currency earned through play, achievements and special rewards.

### Upgrade categories
| Upgrade | L1 | L2 | L3 | L4 | L5 |
|---|---:|---:|---:|---:|---:|
| Speed | 100 | 200 | 350 | 550 | 800 |
| Health | 150 | 300 | 500 | 750 | 1,050 |
| Torch Radius | 100 | 225 | 400 | 650 | 950 |
| Hint Power | 150 | 300 | 500 | 750 | 1,100 |

Effects:
- Speed: +5% movement speed per level
- Health: +1 max HP per level
- Torch: +12% visibility radius per level
- Hint: -10% hint cooldown/cost per level

### Base level rewards
| Level | Coins | Gems |
|---|---:|---:|
| 1 | 80 | 0 |
| 2 | 100 | 1 |
| 3 | 120 | 1 |
| 4 | 140 | 1 |
| 5 | 165 | 2 |
| 6 | 190 | 2 |
| 7 | 220 | 2 |
| 8 | 250 | 3 |
| 9 | 300 | 4 |
| 10 | 400 | 5 |

Base coins across the story: **1,965**. Additional exploration/chest/enemy rewards are separate.

## Difficulty
| Level | Difficulty | Focus |
|---|---|---|
| 1 | ★ | Movement |
| 2 | ★ | Lever puzzle |
| 3 | ★★ | Darkness/enemies |
| 4 | ★★ | Maze |
| 5 | ★★★ | Pattern puzzle |
| 6 | ★★★ | Timing |
| 7 | ★★★ | Multi-step puzzle |
| 8 | ★★★★ | Guardian |
| 9 | ★★★★ | Combined puzzle |
| 10 | ★★★★★ | Final escape |

Difficulty should rise gradually; each level introduces or combines a manageable mechanic.

## One-page product direction
- Short 2–3 minute sessions
- Simple touch controls
- Clear visual objectives
- Story mystery between levels
- Free-to-finish progression
- Optional future rewarded ads for convenience, never required for progress
- Future content: Challenge Mode after Level 10 and two new levels per month

## Phase 1 acceptance checklist
- [x] Concept
- [x] Core loop
- [x] 10-level story
- [x] Dialogue/story beats
- [x] 3 secrets
- [x] Betrayal
- [x] Hidden-room concept
- [x] Final twist
- [x] Economy and exact upgrade prices
- [x] Difficulty curve
- [x] One-page design direction

**Phase 2 is intentionally not started on this branch.**
