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

    // Goal
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
      { xStart: 1700, xEnd: 1950, text: "Reach the TOWER to save Fiona!" }
    ]
  };
};