
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Entity, EntityType, GameState, LevelData } from '../types';
import { GRAVITY, FRICTION, MOVE_SPEED, JUMP_FORCE, MAX_FALL_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT, ASSETS, AUDIO_SOURCES } from '../constants';

interface GameCanvasProps {
  levelData: LevelData;
  onGameOver: () => void;
  onVictory: () => void;
  onScoreUpdate: (score: number) => void;
  setGameState: (state: GameState) => void;
  gameState: GameState;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ levelData, onGameOver, onVictory, onScoreUpdate, setGameState, gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game State Refs
  const playerRef = useRef<Entity>({
    id: 'player',
    type: EntityType.PLAYER,
    x: levelData.startPos.x,
    y: levelData.startPos.y,
    width: 50, // Slightly wider for Shrek
    height: 80,
    isStatic: false,
    velocity: { vx: 0, vy: 0 },
    color: '#65a30d'
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const cameraRef = useRef({ x: 0 });
  const entitiesRef = useRef<Entity[]>(JSON.parse(JSON.stringify(levelData.entities)));
  const requestRef = useRef<number>();
  const scoreRef = useRef(0);
  const healthRef = useRef(3);
  const isGroundedRef = useRef(false);
  
  // Used to prevent multiple game over triggers in the same frame sequence
  const isEndingRef = useRef(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Asset Loading
  const [playerSprite, setPlayerSprite] = useState<HTMLImageElement | null>(null);
  const [currentTutorial, setCurrentTutorial] = useState<string>("");

  useEffect(() => {
    const img = new Image();
    img.src = ASSETS.SHREK_IDLE;
    img.onload = () => setPlayerSprite(img);

    // Initialize Audio
    audioRefs.current = {
      jump: new Audio(AUDIO_SOURCES.JUMP),
      coin: new Audio(AUDIO_SOURCES.COIN),
      damage: new Audio(AUDIO_SOURCES.DAMAGE),
      victory: new Audio(AUDIO_SOURCES.VICTORY)
    };
    
    // Set volumes
    audioRefs.current.jump.volume = 0.4;
    audioRefs.current.coin.volume = 0.4;
    audioRefs.current.damage.volume = 0.6;
    audioRefs.current.victory.volume = 0.5;

  }, []);

  const playSound = useCallback((key: string) => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.warn("Audio play failed (interaction needed first?)", e));
    }
  }, []);

  // Reset logic when game starts
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      isEndingRef.current = false;
      // Reset player if needed, usually managed by parent re-mounting, but here we can ensure safety
    }
  }, [gameState]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (e.code === 'Escape') {
        setGameState(GameState.PAUSED);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setGameState]);

  const checkCollision = (rect1: Entity, rect2: Entity) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const update = useCallback(() => {
    if (gameState !== GameState.PLAYING || isEndingRef.current) return;

    const player = playerRef.current;
    if (!player.velocity) return;

    // Physics
    player.velocity.vy += GRAVITY;
    if (player.velocity.vy > MAX_FALL_SPEED) player.velocity.vy = MAX_FALL_SPEED;

    if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
      player.velocity.vx = MOVE_SPEED;
    } else if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
      player.velocity.vx = -MOVE_SPEED;
    } else {
      player.velocity.vx *= FRICTION;
    }

    if ((keysRef.current['Space'] || keysRef.current['ArrowUp'] || keysRef.current['KeyW']) && isGroundedRef.current) {
      player.velocity.vy = JUMP_FORCE;
      isGroundedRef.current = false;
      playSound('jump');
    }

    // X Movement & Collision
    player.x += player.velocity.vx;
    for (const entity of entitiesRef.current) {
      if (entity.type === EntityType.PLATFORM && checkCollision(player, entity)) {
        if (player.velocity.vx > 0) {
          player.x = entity.x - player.width;
        } else if (player.velocity.vx < 0) {
          player.x = entity.x + entity.width;
        }
        player.velocity.vx = 0;
      }
    }

    // Y Movement & Collision
    player.y += player.velocity.vy;
    isGroundedRef.current = false;
    for (const entity of entitiesRef.current) {
      if (entity.type === EntityType.PLATFORM && checkCollision(player, entity)) {
        if (player.velocity.vy > 0) {
          player.y = entity.y - player.height;
          isGroundedRef.current = true;
          player.velocity.vy = 0;
        } else if (player.velocity.vy < 0) {
          player.y = entity.y + entity.height;
          player.velocity.vy = 0;
        }
      }
    }

    // Interactions
    for (let i = entitiesRef.current.length - 1; i >= 0; i--) {
      const entity = entitiesRef.current[i];
      if (checkCollision(player, entity)) {
        if (entity.type === EntityType.COLLECTIBLE) {
          scoreRef.current += (entity.properties?.scoreValue || 10);
          onScoreUpdate(scoreRef.current);
          entitiesRef.current.splice(i, 1);
          playSound('coin');
        } else if (entity.type === EntityType.HAZARD) {
           playSound('damage');
           isEndingRef.current = true;
           onGameOver();
        } else if (entity.type === EntityType.GOAL) {
          playSound('victory');
          isEndingRef.current = true;
          onVictory();
        }
      }
    }

    // Bounds
    if (player.y > CANVAS_HEIGHT) {
      playSound('damage');
      isEndingRef.current = true;
      onGameOver();
    }
    if (player.x < 0) player.x = 0;

    // Camera
    const targetCameraX = player.x - CANVAS_WIDTH / 3;
    cameraRef.current.x = Math.max(0, Math.min(targetCameraX, levelData.width - CANVAS_WIDTH));

    // Tutorial Check
    let activeTutorial = "";
    if (levelData.tutorialZones) {
      const zone = levelData.tutorialZones.find(z => player.x >= z.xStart && player.x <= z.xEnd);
      if (zone) activeTutorial = zone.text;
    }
    if (activeTutorial !== currentTutorial) {
       setCurrentTutorial(activeTutorial);
    }

  }, [gameState, levelData.width, levelData.tutorialZones, currentTutorial, onGameOver, onScoreUpdate, onVictory, playSound]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.save();
    ctx.translate(-cameraRef.current.x, 0);

    // Background
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(cameraRef.current.x, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Entities
    entitiesRef.current.forEach(entity => {
      ctx.fillStyle = entity.color || '#888';
      ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
      if (entity.type === EntityType.GOAL) {
        ctx.fillStyle = '#fff';
        ctx.font = '20px MedievalSharp';
        ctx.fillText('FIONA!', entity.x, entity.y - 10);
      }
    });

    // Player
    const player = playerRef.current;
    if (playerSprite) {
      ctx.drawImage(playerSprite, player.x, player.y, player.width, player.height);
    } else {
      // Fallback
      ctx.fillStyle = player.color || 'green';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }
    ctx.restore();
  }, [playerSprite]);

  const tick = useCallback(() => {
    update();
    draw();
    requestRef.current = requestAnimationFrame(tick);
  }, [update, draw]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [tick]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-stone-800 rounded-lg shadow-2xl bg-sky-200 block"
      />
      {/* Tutorial Overlay */}
      {currentTutorial && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/70 px-6 py-3 rounded-full border-2 border-yellow-400 animate-bounce">
          <p className="text-white text-lg font-bold tracking-wide">{currentTutorial}</p>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
