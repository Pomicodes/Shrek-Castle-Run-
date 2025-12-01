export enum GameState {
  MENU = 'MENU',
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
  ROADMAP = 'ROADMAP'
}

export enum EntityType {
  PLAYER = 'PLAYER',
  PLATFORM = 'PLATFORM',
  HAZARD = 'HAZARD', // Lava, Fireball
  COLLECTIBLE = 'COLLECTIBLE', // Coin, Potion
  GOAL = 'GOAL', // Fiona/Door
  DECORATION = 'DECORATION'
}

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Entity extends Position, Size {
  id: string;
  type: EntityType;
  color?: string;
  image?: string;
  isStatic: boolean;
  velocity?: Velocity; // Only for dynamic entities
  properties?: {
    damage?: number;
    scoreValue?: number;
    isMoving?: boolean;
    range?: number; // For moving platforms
    initialX?: number;
  };
}

export interface TutorialZone {
  xStart: number;
  xEnd: number;
  text: string;
}

export interface LevelData {
  id: number;
  name: string;
  description: string;
  width: number;
  height: number;
  entities: Entity[];
  startPos: Position;
  tutorialZones?: TutorialZone[];
}