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
    // Ground Segments - More challenging layout
    { id: 'floor-1', type: EntityType.PLATFORM, x: 0, y: floorY, width: 400, height: 60, isStatic: true, color: '#4a5d23' },
    { id: 'floor-2', type: EntityType.PLATFORM, x: 500, y: floorY, width: 300, height: 60, isStatic: true, color: '#4a5d23' },
    { id: 'floor-3', type: EntityType.PLATFORM, x: 900, y: floorY, width: 400, height: 60, isStatic: true, color: '#4a5d23' },
    { id: 'floor-4', type: EntityType.PLATFORM, x: 1400, y: floorY, width: 600, height: 60, isStatic: true, color: '#4a5d23' },

    // More Lava/Hazards
    { id: 'lava-1', type: EntityType.HAZARD, x: 400, y: CANVAS_HEIGHT - 20, width: 100, height: 20, isStatic: true, color: '#ef4444', properties: { damage: 1 } },
    { id: 'lava-2', type: EntityType.HAZARD, x: 800, y: CANVAS_HEIGHT - 20, width: 100, height: 20, isStatic: true, color: '#ef4444', properties: { damage: 1 } },
    { id: 'lava-3', type: EntityType.HAZARD, x: 1300, y: CANVAS_HEIGHT - 20, width: 100, height: 20, isStatic: true, color: '#ef4444', properties: { damage: 1 } },

    // More Platforms - Higher difficulty
    { id: 'plat-1', type: EntityType.PLATFORM, x: 200, y: floorY - 120, width: 80, height: 20, isStatic: true, color: '#78350f' },
    { id: 'plat-2', type: EntityType.PLATFORM, x: 600, y: floorY - 180, width: 80, height: 20, isStatic: true, color: '#78350f' },
    { id: 'plat-3', type: EntityType.PLATFORM, x: 1000, y: floorY - 150, width: 80, height: 20, isStatic: true, color: '#78350f' },
    { id: 'plat-4', type: EntityType.PLATFORM, x: 1200, y: floorY - 220, width: 80, height: 20, isStatic: true, color: '#78350f' },
    { id: 'plat-5', type: EntityType.PLATFORM, x: 1500, y: floorY - 100, width: 100, height: 20, isStatic: true, color: '#78350f' },

    // More Collectibles
    { id: 'coin-1', type: EntityType.COLLECTIBLE, x: 230, y: floorY - 160, width: 20, height: 20, isStatic: true, color: '#fbbf24', properties: { scoreValue: 20 } },
    { id: 'coin-2', type: EntityType.COLLECTIBLE, x: 630, y: floorY - 220, width: 20, height: 20, isStatic: true, color: '#fbbf24', properties: { scoreValue: 20 } },
    { id: 'coin-3', type: EntityType.COLLECTIBLE, x: 1030, y: floorY - 190, width: 20, height: 20, isStatic: true, color: '#fbbf24', properties: { scoreValue: 20 } },
    { id: 'coin-4', type: EntityType.COLLECTIBLE, x: 1230, y: floorY - 260, width: 20, height: 20, isStatic: true, color: '#fbbf24', properties: { scoreValue: 20 } },
    { id: 'coin-5', type: EntityType.COLLECTIBLE, x: 1530, y: floorY - 140, width: 20, height: 20, isStatic: true, color: '#fbbf24', properties: { scoreValue: 20 } },

    // Moving Platform
    { id: 'plat-mov-1', type: EntityType.PLATFORM, x: 700, y: floorY - 300, width: 100, height: 20, isStatic: true, color: '#a16207' },

    // Castle Structure for Level 2
    { id: 'castle-base', type: EntityType.DECORATION, x: 1700, y: floorY - 200, width: 200, height: 200, isStatic: true, color: '#4a5568' },
    { id: 'castle-tower-left', type: EntityType.DECORATION, x: 1720, y: floorY - 350, width: 60, height: 150, isStatic: true, color: '#2d3748' },
    { id: 'castle-tower-right', type: EntityType.DECORATION, x: 1820, y: floorY - 350, width: 60, height: 150, isStatic: true, color: '#2d3748' },
    
    // Castle Gate
    { id: 'castle-gate', type: EntityType.CASTLE_GATE, x: 1780, y: floorY - 80, width: 40, height: 140, isStatic: true, color: '#78350f', properties: { gateOpen: false } },
    
    // Goal
    { id: 'goal', type: EntityType.GOAL, x: 1800, y: floorY - 80, width: 60, height: 140, isStatic: true, color: '#ec4899' }
  ];

  return {
    id: 2,
    name: 'Inside the Castle',
    description: 'The Inner Keep',
    width: 2000,
    height: CANVAS_HEIGHT,
    startPos: { x: 50, y: floorY - 100 },
    entities,
    tutorialZones: [
      { xStart: 0, xEnd: 300, text: "Level 2! More challenges ahead!" },
      { xStart: 400, xEnd: 700, text: "Watch out for more LAVA pits!" },
      { xStart: 900, xEnd: 1400, text: "Use platforms to reach higher areas!" },
      { xStart: 1600, xEnd: 1950, text: "Reach the next CASTLE GATE!" }
    ]
  };
};