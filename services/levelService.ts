import { Entity, EntityType, LevelData } from '../types';
import { CANVAS_HEIGHT } from '../constants';

export const generateLevel1 = (): LevelData => {
  const floorY = CANVAS_HEIGHT - 60;
  
  const entities: Entity[] = [
    // Ground Segments (Gaps included)
    { id: 'floor-1', type: EntityType.PLATFORM, x: 0, y: floorY, width: 600, height: 60, isStatic: true, color: '#4a5d23' },
    { id: 'floor-2', type: EntityType.PLATFORM, x: 750, y: floorY, width: 400, height: 60, isStatic: true, color: '#4a5d23' },
    { id: 'floor-3', type: EntityType.PLATFORM, x: 1300, y: floorY, width: 800, height: 60, isStatic: true, color: '#4a5d23' },

    // Lava/Hazards in gaps
    { id: 'lava-1', type: EntityType.HAZARD, x: 600, y: CANVAS_HEIGHT - 20, width: 150, height: 20, isStatic: true, color: '#ef4444', properties: { damage: 1 } },
    { id: 'lava-2', type: EntityType.HAZARD, x: 1150, y: CANVAS_HEIGHT - 20, width: 150, height: 20, isStatic: true, color: '#ef4444', properties: { damage: 1 } },

    // Platforms
    { id: 'plat-1', type: EntityType.PLATFORM, x: 300, y: floorY - 100, width: 100, height: 20, isStatic: true, color: '#78350f' },
    { id: 'plat-2', type: EntityType.PLATFORM, x: 500, y: floorY - 200, width: 100, height: 20, isStatic: true, color: '#78350f' },
    { id: 'plat-3', type: EntityType.PLATFORM, x: 800, y: floorY - 150, width: 100, height: 20, isStatic: true, color: '#78350f' },

    // Collectibles
    { id: 'coin-1', type: EntityType.COLLECTIBLE, x: 330, y: floorY - 140, width: 20, height: 20, isStatic: true, color: '#fbbf24', properties: { scoreValue: 10 } },
    { id: 'coin-2', type: EntityType.COLLECTIBLE, x: 530, y: floorY - 240, width: 20, height: 20, isStatic: true, color: '#fbbf24', properties: { scoreValue: 10 } },
    { id: 'coin-3', type: EntityType.COLLECTIBLE, x: 900, y: floorY - 40, width: 20, height: 20, isStatic: true, color: '#fbbf24', properties: { scoreValue: 10 } },

    // Moving Platform (Mockup for now, logic in engine)
    { id: 'plat-mov-1', type: EntityType.PLATFORM, x: 1000, y: floorY - 250, width: 120, height: 20, isStatic: true, color: '#a16207' },

    // Castle Structure
    { id: 'castle-base', type: EntityType.DECORATION, x: 1800, y: floorY - 200, width: 200, height: 200, isStatic: true, color: '#4a5568' },
    { id: 'castle-tower-left', type: EntityType.DECORATION, x: 1820, y: floorY - 350, width: 60, height: 150, isStatic: true, color: '#2d3748' },
    { id: 'castle-tower-right', type: EntityType.DECORATION, x: 1920, y: floorY - 350, width: 60, height: 150, isStatic: true, color: '#2d3748' },
    
    // Castle Gate (will animate open)
    { id: 'castle-gate', type: EntityType.CASTLE_GATE, x: 1880, y: floorY - 80, width: 40, height: 140, isStatic: true, color: '#78350f', properties: { gateOpen: false } },
    
    // Goal (inside the gate)
    { id: 'goal', type: EntityType.GOAL, x: 1900, y: floorY - 80, width: 60, height: 140, isStatic: true, color: '#ec4899' } // Fiona's Tower Entrance
  ];

  return {
    id: 1,
    name: 'The Castle Gate',
    description: 'Training Stage',
    width: 2000, // Long level
    height: CANVAS_HEIGHT,
    startPos: { x: 50, y: floorY - 100 },
    entities,
    tutorialZones: [
      { xStart: 0, xEnd: 200, text: "Welcome! Use Arrow Keys to MOVE." },
      { xStart: 250, xEnd: 450, text: "Press SPACE to JUMP over obstacles." },
      { xStart: 550, xEnd: 700, text: "Watch out for LAVA! Fall and you restart." },
      { xStart: 800, xEnd: 1100, text: "Collect COINS for points and use PLATFORMS to climb." },
      { xStart: 1700, xEnd: 1950, text: "Reach the CASTLE GATE to enter!" }
    ]
  };
};

export const generateLevel2 = (): LevelData => {
  const floorY = CANVAS_HEIGHT - 60;
  
  const entities: Entity[] = [
    // Interior stone floor segments (inside the castle) - warm tones
    { id: 'floor-1', type: EntityType.PLATFORM, x: 0, y: floorY, width: 600, height: 60, isStatic: true, color: '#7c2d12' },
    { id: 'floor-2', type: EntityType.PLATFORM, x: 800, y: floorY, width: 600, height: 60, isStatic: true, color: '#7c2d12' },
    { id: 'floor-3', type: EntityType.PLATFORM, x: 1600, y: floorY, width: 600, height: 60, isStatic: true, color: '#7c2d12' },
    { id: 'floor-4', type: EntityType.PLATFORM, x: 2300, y: floorY, width: 400, height: 60, isStatic: true, color: '#7c2d12' },
    { id: 'floor-5', type: EntityType.PLATFORM, x: 2800, y: floorY, width: 300, height: 60, isStatic: true, color: '#7c2d12' },

    // Lava pools the player must jump over
    { id: 'lava-1', type: EntityType.HAZARD, x: 650, y: CANVAS_HEIGHT - 20, width: 180, height: 20, isStatic: true, color: '#ef4444', properties: { damage: 1 } },
    { id: 'lava-2', type: EntityType.HAZARD, x: 1400, y: CANVAS_HEIGHT - 20, width: 220, height: 20, isStatic: true, color: '#ef4444', properties: { damage: 1 } },

    // Platforms over lava
    { id: 'plat-lava-1', type: EntityType.PLATFORM, x: 680, y: floorY - 140, width: 80, height: 20, isStatic: true, color: '#92400e' },
    { id: 'plat-lava-2', type: EntityType.PLATFORM, x: 780, y: floorY - 230, width: 80, height: 20, isStatic: true, color: '#92400e' },
    { id: 'plat-lava-3', type: EntityType.PLATFORM, x: 1430, y: floorY - 120, width: 90, height: 20, isStatic: true, color: '#92400e' },
    { id: 'plat-lava-4', type: EntityType.PLATFORM, x: 1560, y: floorY - 210, width: 90, height: 20, isStatic: true, color: '#92400e' },

    // Fireballs - moving hazards
    { 
      id: 'fireball-1', 
      type: EntityType.HAZARD, 
      x: 400, 
      y: floorY - 100, 
      width: 30, 
      height: 30, 
      isStatic: false, 
      color: '#ff6b00', 
      velocity: { vx: 3, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: 1, speed: 3, initialX: 400 }
    },
    { 
      id: 'fireball-2', 
      type: EntityType.HAZARD, 
      x: 1000, 
      y: floorY - 150, 
      width: 30, 
      height: 30, 
      isStatic: false, 
      color: '#ff6b00', 
      velocity: { vx: -3.5, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: -1, speed: 3.5, initialX: 1000 }
    },
    { 
      id: 'fireball-3', 
      type: EntityType.HAZARD, 
      x: 1500, 
      y: floorY - 80, 
      width: 30, 
      height: 30, 
      isStatic: false, 
      color: '#ff6b00', 
      velocity: { vx: 4, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: 1, speed: 4, initialX: 1500 }
    },
    { 
      id: 'fireball-4', 
      type: EntityType.HAZARD, 
      x: 2100, 
      y: floorY - 120, 
      width: 30, 
      height: 30, 
      isStatic: false, 
      color: '#ff6b00', 
      velocity: { vx: -3, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: -1, speed: 3, initialX: 2100 }
    },

    // Extra collectibles inside the castle
    { id: 'coin-1', type: EntityType.COLLECTIBLE, x: 200, y: floorY - 140, width: 20, height: 20, isStatic: true, color: '#facc15', properties: { scoreValue: 25 } },
    { id: 'coin-2', type: EntityType.COLLECTIBLE, x: 900, y: floorY - 260, width: 20, height: 20, isStatic: true, color: '#facc15', properties: { scoreValue: 25 } },
    { id: 'coin-3', type: EntityType.COLLECTIBLE, x: 1700, y: floorY - 260, width: 20, height: 20, isStatic: true, color: '#facc15', properties: { scoreValue: 25 } },

    // Stairs to Fiona's room at the very end
    // The GOAL represents the first step of the stairs
    { id: 'stairs-base', type: EntityType.GOAL, x: 2900, y: floorY - 40, width: 50, height: 40, isStatic: true, color: '#78350f' }
  ];

  return {
    id: 2,
    name: 'Inside the Castle',
    description: 'Lava Halls',
    width: 3200,
    height: CANVAS_HEIGHT,
    startPos: { x: 50, y: floorY - 100 },
    entities,
    tutorialZones: [
      { xStart: 0, xEnd: 250, text: "You are INSIDE the castle now!" },
      { xStart: 260, xEnd: 800, text: "Warm torchlight and deadly LAVA ahead." },
      { xStart: 850, xEnd: 1500, text: "Use platforms to navigate over lava!" },
      { xStart: 1550, xEnd: 2150, text: "Jump carefully over lava pools!" },
      { xStart: 2200, xEnd: 2800, text: "Watch out for FIREBALLS! They move!" },
      { xStart: 2850, xEnd: 3100, text: "Reach the STAIRS to Fiona's room!" }
    ]
  };
};

export const generateLevel3 = (): LevelData => {
  const floorY = CANVAS_HEIGHT - 60;
  
  const entities: Entity[] = [
    // Dark Dragon's Lair - floor segments with jumpable gaps (max ~400px with run+jump)
    { id: 'floor-1', type: EntityType.PLATFORM, x: 0, y: floorY, width: 350, height: 60, isStatic: true, color: '#1a1a1a' },
    { id: 'floor-2', type: EntityType.PLATFORM, x: 700, y: floorY, width: 300, height: 60, isStatic: true, color: '#0f0f0f' },
    { id: 'floor-3', type: EntityType.PLATFORM, x: 1400, y: floorY, width: 350, height: 60, isStatic: true, color: '#1a1a1a' },
    { id: 'floor-4', type: EntityType.PLATFORM, x: 2100, y: floorY, width: 300, height: 60, isStatic: true, color: '#0f0f0f' },
    { id: 'floor-5', type: EntityType.PLATFORM, x: 2800, y: floorY, width: 350, height: 60, isStatic: true, color: '#1a1a1a' },
    { id: 'floor-6', type: EntityType.PLATFORM, x: 3500, y: floorY, width: 300, height: 60, isStatic: true, color: '#0f0f0f' },

    // Intermediate platforms to bridge gaps and provide alternative paths
    // Section 1: Bridge from floor-1 to floor-2 (gap: 350px)
    { id: 'plat-1', type: EntityType.PLATFORM, x: 500, y: floorY - 120, width: 80, height: 20, isStatic: true, color: '#2d2d2d' },
    { id: 'plat-2', type: EntityType.PLATFORM, x: 600, y: floorY - 200, width: 80, height: 20, isStatic: true, color: '#2d2d2d' },
    
    // Section 2: Bridge from floor-2 to floor-3 (gap: 400px)
    { id: 'plat-3', type: EntityType.PLATFORM, x: 1100, y: floorY - 100, width: 100, height: 20, isStatic: true, color: '#2d2d2d' },
    { id: 'plat-4', type: EntityType.PLATFORM, x: 1200, y: floorY - 180, width: 80, height: 20, isStatic: true, color: '#2d2d2d' },
    
    // Section 3: Bridge from floor-3 to floor-4 (gap: 350px)
    { id: 'plat-5', type: EntityType.PLATFORM, x: 1900, y: floorY - 120, width: 100, height: 20, isStatic: true, color: '#2d2d2d' },
    { id: 'plat-6', type: EntityType.PLATFORM, x: 2000, y: floorY - 220, width: 80, height: 20, isStatic: true, color: '#2d2d2d' },
    
    // Section 4: Bridge from floor-4 to floor-5 (gap: 350px)
    { id: 'plat-7', type: EntityType.PLATFORM, x: 2600, y: floorY - 100, width: 100, height: 20, isStatic: true, color: '#2d2d2d' },
    { id: 'plat-8', type: EntityType.PLATFORM, x: 2700, y: floorY - 200, width: 80, height: 20, isStatic: true, color: '#2d2d2d' },
    
    // Section 5: Bridge from floor-5 to floor-6 (gap: 350px)
    { id: 'plat-9', type: EntityType.PLATFORM, x: 3300, y: floorY - 120, width: 100, height: 20, isStatic: true, color: '#2d2d2d' },
    { id: 'plat-10', type: EntityType.PLATFORM, x: 3400, y: floorY - 220, width: 80, height: 20, isStatic: true, color: '#2d2d2d' },

    // Fireballs - positioned to be dodgeable with timing, not blocking paths
    // Lower fireballs can be jumped over, higher ones can be ducked under
    { 
      id: 'fireball-1', 
      type: EntityType.HAZARD, 
      x: 200, 
      y: floorY - 60, 
      width: 35, 
      height: 35, 
      isStatic: false, 
      color: '#ff0000', 
      velocity: { vx: 5, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: 1, speed: 5, initialX: 200 }
    },
    { 
      id: 'fireball-2', 
      type: EntityType.HAZARD, 
      x: 850, 
      y: floorY - 60, 
      width: 35, 
      height: 35, 
      isStatic: false, 
      color: '#ff0000', 
      velocity: { vx: -5.5, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: -1, speed: 5.5, initialX: 850 }
    },
    { 
      id: 'fireball-3', 
      type: EntityType.HAZARD, 
      x: 1550, 
      y: floorY - 60, 
      width: 35, 
      height: 35, 
      isStatic: false, 
      color: '#ff0000', 
      velocity: { vx: 5, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: 1, speed: 5, initialX: 1550 }
    },
    { 
      id: 'fireball-4', 
      type: EntityType.HAZARD, 
      x: 2250, 
      y: floorY - 60, 
      width: 35, 
      height: 35, 
      isStatic: false, 
      color: '#ff0000', 
      velocity: { vx: -5.5, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: -1, speed: 5.5, initialX: 2250 }
    },
    { 
      id: 'fireball-5', 
      type: EntityType.HAZARD, 
      x: 2950, 
      y: floorY - 60, 
      width: 35, 
      height: 35, 
      isStatic: false, 
      color: '#ff0000', 
      velocity: { vx: 5, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: 1, speed: 5, initialX: 2950 }
    },
    { 
      id: 'fireball-6', 
      type: EntityType.HAZARD, 
      x: 3600, 
      y: floorY - 60, 
      width: 35, 
      height: 35, 
      isStatic: false, 
      color: '#ff0000', 
      velocity: { vx: -5.5, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: -1, speed: 5.5, initialX: 3600 }
    },
    // Higher fireballs on platforms - can be avoided by timing
    { 
      id: 'fireball-7', 
      type: EntityType.HAZARD, 
      x: 550, 
      y: floorY - 160, 
      width: 35, 
      height: 35, 
      isStatic: false, 
      color: '#ff0000', 
      velocity: { vx: 4.5, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: 1, speed: 4.5, initialX: 550 }
    },
    { 
      id: 'fireball-8', 
      type: EntityType.HAZARD, 
      x: 1150, 
      y: floorY - 140, 
      width: 35, 
      height: 35, 
      isStatic: false, 
      color: '#ff0000', 
      velocity: { vx: -5, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: -1, speed: 5, initialX: 1150 }
    },
    { 
      id: 'fireball-9', 
      type: EntityType.HAZARD, 
      x: 1950, 
      y: floorY - 160, 
      width: 35, 
      height: 35, 
      isStatic: false, 
      color: '#ff0000', 
      velocity: { vx: 4.5, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: 1, speed: 4.5, initialX: 1950 }
    },
    { 
      id: 'fireball-10', 
      type: EntityType.HAZARD, 
      x: 2650, 
      y: floorY - 140, 
      width: 35, 
      height: 35, 
      isStatic: false, 
      color: '#ff0000', 
      velocity: { vx: -5, vy: 0 },
      properties: { isFireball: true, damage: 1, direction: -1, speed: 5, initialX: 2650 }
    },

    // Collectibles - positioned on platforms and floors
    { id: 'coin-1', type: EntityType.COLLECTIBLE, x: 520, y: floorY - 160, width: 20, height: 20, isStatic: true, color: '#ffd700', properties: { scoreValue: 100 } },
    { id: 'coin-2', type: EntityType.COLLECTIBLE, x: 620, y: floorY - 240, width: 20, height: 20, isStatic: true, color: '#ffd700', properties: { scoreValue: 100 } },
    { id: 'coin-3', type: EntityType.COLLECTIBLE, x: 1120, y: floorY - 140, width: 20, height: 20, isStatic: true, color: '#ffd700', properties: { scoreValue: 100 } },
    { id: 'coin-4', type: EntityType.COLLECTIBLE, x: 1220, y: floorY - 220, width: 20, height: 20, isStatic: true, color: '#ffd700', properties: { scoreValue: 100 } },
    { id: 'coin-5', type: EntityType.COLLECTIBLE, x: 1920, y: floorY - 160, width: 20, height: 20, isStatic: true, color: '#ffd700', properties: { scoreValue: 100 } },
    { id: 'coin-6', type: EntityType.COLLECTIBLE, x: 2020, y: floorY - 260, width: 20, height: 20, isStatic: true, color: '#ffd700', properties: { scoreValue: 100 } },
    { id: 'coin-7', type: EntityType.COLLECTIBLE, x: 2620, y: floorY - 140, width: 20, height: 20, isStatic: true, color: '#ffd700', properties: { scoreValue: 100 } },
    { id: 'coin-8', type: EntityType.COLLECTIBLE, x: 2720, y: floorY - 240, width: 20, height: 20, isStatic: true, color: '#ffd700', properties: { scoreValue: 100 } },
    { id: 'coin-9', type: EntityType.COLLECTIBLE, x: 3320, y: floorY - 160, width: 20, height: 20, isStatic: true, color: '#ffd700', properties: { scoreValue: 100 } },
    { id: 'coin-10', type: EntityType.COLLECTIBLE, x: 3420, y: floorY - 260, width: 20, height: 20, isStatic: true, color: '#ffd700', properties: { scoreValue: 100 } },

    // Dark, ominous decorations
    { id: 'dark-1', type: EntityType.DECORATION, x: 100, y: floorY - 60, width: 40, height: 40, isStatic: true, color: '#000000' },
    { id: 'dark-2', type: EntityType.DECORATION, x: 2800, y: floorY - 80, width: 50, height: 50, isStatic: true, color: '#1a1a1a' },

    // Final goal - Princess Fiona's rescue point!
    { id: 'fiona-rescue', type: EntityType.GOAL, x: 3700, y: floorY - 100, width: 80, height: 100, isStatic: true, color: '#ec4899' }
  ];

  return {
    id: 3,
    name: "Dragon's Lair",
    description: 'Final Boss',
    width: 3900,
    height: CANVAS_HEIGHT,
    startPos: { x: 50, y: floorY - 100 },
    entities,
    tutorialZones: [
      { xStart: 0, xEnd: 200, text: "Darkness surrounds you..." },
      { xStart: 250, xEnd: 500, text: "Precision required!" },
      { xStart: 550, xEnd: 1000, text: "Fireballs everywhere!" },
      { xStart: 1050, xEnd: 1500, text: "Stay focused!" },
      { xStart: 1550, xEnd: 2200, text: "The darkness deepens..." },
      { xStart: 2250, xEnd: 2900, text: "Almost there..." },
      { xStart: 2950, xEnd: 3600, text: "Find Fiona!" },
      { xStart: 3650, xEnd: 3850, text: "RESCUE HER!" }
    ]
  };
};