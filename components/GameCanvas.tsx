
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

// Helper function to draw realistic castle tower
const drawCastleTower = (ctx: CanvasRenderingContext2D, tower: Entity) => {
  const x = tower.x;
  const y = tower.y;
  const w = tower.width;
  const h = tower.height;
  
  // Tower base
  ctx.fillStyle = '#2d3748';
  ctx.fillRect(x, y, w, h);
  
  // Stone blocks on tower
  ctx.strokeStyle = '#1a202c';
  ctx.lineWidth = 1.5;
  const blockSize = 15;
  for (let row = 0; row < Math.floor(h / blockSize); row++) {
    for (let col = 0; col < Math.floor(w / blockSize); col++) {
      const bx = x + col * blockSize;
      const by = y + row * blockSize;
      ctx.strokeRect(bx, by, blockSize, blockSize);
    }
  }
  
  // Battlements (top crenellations)
  const battlementHeight = 15;
  const battlementWidth = 12;
  ctx.fillStyle = '#2d3748';
  for (let i = 0; i < Math.floor(w / battlementWidth); i++) {
    const bx = x + i * battlementWidth;
    ctx.fillRect(bx, y - battlementHeight, battlementWidth - 2, battlementHeight);
  }
  
  // Windows
  ctx.fillStyle = '#1a202c';
  // Left window
  ctx.fillRect(x + 8, y + 20, 12, 18);
  // Right window
  ctx.fillRect(x + w - 20, y + 20, 12, 18);
  // Window crosses
  ctx.strokeStyle = '#0f1419';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 20);
  ctx.lineTo(x + 14, y + 38);
  ctx.moveTo(x + 8, y + 29);
  ctx.lineTo(x + 20, y + 29);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + w - 14, y + 20);
  ctx.lineTo(x + w - 14, y + 38);
  ctx.moveTo(x + w - 20, y + 29);
  ctx.lineTo(x + w - 8, y + 29);
  ctx.stroke();
  
  // Torch/light in window
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(x + 14, y + 29, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + w - 14, y + 29, 3, 0, Math.PI * 2);
  ctx.fill();
};

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
  const gateOpenRef = useRef(false);
  const gateAnimationRef = useRef(0); // 0 = closed, 1 = fully open

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

  // Reset logic when levelData changes (level transitions)
  useEffect(() => {
    // Update entities when levelData changes
    entitiesRef.current = JSON.parse(JSON.stringify(levelData.entities));
    
    // Reset player position to level start position
    playerRef.current.x = levelData.startPos.x;
    playerRef.current.y = levelData.startPos.y;
    if (playerRef.current.velocity) {
      playerRef.current.velocity.vx = 0;
      playerRef.current.velocity.vy = 0;
    }
    
    // Reset camera
    cameraRef.current.x = 0;
    
    // Reset gate state
    gateOpenRef.current = false;
    gateAnimationRef.current = 0;
    
    // Reset ending state
    isEndingRef.current = false;
    isGroundedRef.current = false;
  }, [levelData.id]); // Watch levelData.id to detect level changes

  // Reset logic when game starts
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      isEndingRef.current = false;
      gateOpenRef.current = false;
      gateAnimationRef.current = 0;
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

    // Handle falling walls (inside castle, Level 2)
    entitiesRef.current.forEach(entity => {
      if (entity.type === EntityType.HAZARD && entity.properties?.isFalling) {
        // Trigger falling when player is horizontally close
        if (!entity.properties.hasStarted) {
          const triggerDistance = 120;
          const centerX = entity.x + entity.width / 2;
          const distanceX = Math.abs(player.x + player.width / 2 - centerX);
          if (distanceX < triggerDistance) {
            entity.properties.hasStarted = true;
            entity.velocity = { vx: 0, vy: 2 };
          }
        }

        // Apply falling movement
        if (entity.properties.hasStarted && entity.velocity) {
          entity.velocity.vy += GRAVITY * 0.4; // Slight gravity
          entity.y += entity.velocity.vy;

          const floorY = CANVAS_HEIGHT - 60;
          // When wall hits the floor, turn it into a static platform to jump over
          if (entity.y + entity.height >= floorY) {
            entity.y = floorY - entity.height;
            entity.type = EntityType.PLATFORM;
            entity.isStatic = true;
            entity.velocity = undefined;
            if (entity.properties) {
              entity.properties.isFalling = false;
              entity.properties.hasStarted = false;
              // Remove damage so it's no longer deadly once on the floor
              entity.properties.damage = 0;
            }
          }
        }
      }
    });

    // Handle fireballs - moving hazards that bounce back and forth
    entitiesRef.current.forEach(entity => {
      if (entity.type === EntityType.HAZARD && entity.properties?.isFireball) {
        // Initialize velocity if not set
        if (!entity.velocity) {
          const speed = entity.properties.speed || 3;
          const direction = entity.properties.direction || 1;
          entity.velocity = { vx: speed * direction, vy: 0 };
          // Store initial position if not already stored
          if (entity.properties.initialX === undefined) {
            entity.properties.initialX = entity.x;
          }
        }
        
        // Move fireball
        entity.x += entity.velocity.vx;
        
        // Bounce fireball when it reaches its range limits
        const initialX = entity.properties.initialX || entity.x;
        const range = 200; // Fireball moves 200 pixels in each direction
        const speed = Math.abs(entity.properties.speed || 3);
        
        if (entity.x >= initialX + range) {
          entity.velocity.vx = -speed;
          entity.properties.direction = -1;
        } else if (entity.x <= initialX - range) {
          entity.velocity.vx = speed;
          entity.properties.direction = 1;
        }
      }
    });

    const isLevel2 = levelData.id === 2;

    // Physics
    player.velocity.vy += GRAVITY;
    if (player.velocity.vy > MAX_FALL_SPEED) player.velocity.vy = MAX_FALL_SPEED;

    const moveSpeed = isLevel2 ? MOVE_SPEED * 1.3 : MOVE_SPEED;

    if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
      player.velocity.vx = moveSpeed;
    } else if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
      player.velocity.vx = -moveSpeed;
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

    // Check if player is near the outer gate (Level 1 only) to open it
    if (!isLevel2) {
      const gateEntity = entitiesRef.current.find(e => e.type === EntityType.CASTLE_GATE);
      if (gateEntity && !gateOpenRef.current) {
        const distanceToGate = Math.abs(player.x - (gateEntity.x + gateEntity.width / 2));
        if (distanceToGate < 150) { // Open gate when player is within 150 pixels
          gateOpenRef.current = true;
          playSound('victory');
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
          if (isLevel2) {
            // Level 2: reaching the first step of the ladder completes the level
            playSound('victory');
            isEndingRef.current = true;
            onVictory();
          } else {
            // Level 1: Only trigger if castle gate is mostly open
            if (gateOpenRef.current && gateAnimationRef.current >= 0.7) {
              playSound('victory');
              isEndingRef.current = true;
              onVictory();
            }
          }
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

    // Gate opening animation
    if (gateOpenRef.current && gateAnimationRef.current < 1) {
      gateAnimationRef.current = Math.min(1, gateAnimationRef.current + 0.02); // Smooth opening
    }

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

  }, [gameState, levelData.id, levelData.width, levelData.tutorialZones, currentTutorial, onGameOver, onScoreUpdate, onVictory, playSound]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.save();
    ctx.translate(-cameraRef.current.x, 0);

    // Background
    if (levelData.id === 2) {
      // Warm interior castle tones
      const gradient = ctx.createLinearGradient(
        cameraRef.current.x, 0,
        cameraRef.current.x, CANVAS_HEIGHT
      );
      gradient.addColorStop(0, '#431407');   // dark warm ceiling
      gradient.addColorStop(0.4, '#7c2d12'); // warm walls
      gradient.addColorStop(1, '#1c1917');   // dark floor
      ctx.fillStyle = gradient;
    } else if (levelData.id === 3) {
      // Dark, stressful Dragon's Lair - almost black with subtle red hints
      const gradient = ctx.createLinearGradient(
        cameraRef.current.x, 0,
        cameraRef.current.x, CANVAS_HEIGHT
      );
      gradient.addColorStop(0, '#000000');   // pure black ceiling
      gradient.addColorStop(0.3, '#0a0000'); // very dark with red hint
      gradient.addColorStop(0.6, '#1a0000'); // slightly lighter dark
      gradient.addColorStop(1, '#000000');   // pure black floor
      ctx.fillStyle = gradient;
    } else {
      // Outside sky for Level 1
      ctx.fillStyle = '#87ceeb';
    }
    ctx.fillRect(cameraRef.current.x, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw castle structure first (behind other entities) - only relevant for Level 1 exterior
    const castleBase = entitiesRef.current.find(e => e.id === 'castle-base');
    const towerLeft = entitiesRef.current.find(e => e.id === 'castle-tower-left');
    const towerRight = entitiesRef.current.find(e => e.id === 'castle-tower-right');
    
    if (castleBase) {
      // Draw realistic castle base with stone texture
      const baseX = castleBase.x;
      const baseY = castleBase.y;
      const baseW = castleBase.width;
      const baseH = castleBase.height;
      
      // Main base structure with stone blocks
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(baseX, baseY, baseW, baseH);
      
      // Stone block pattern
      ctx.strokeStyle = '#2d3748';
      ctx.lineWidth = 2;
      const blockSize = 20;
      for (let row = 0; row < Math.floor(baseH / blockSize); row++) {
        for (let col = 0; col < Math.floor(baseW / blockSize); col++) {
          const x = baseX + col * blockSize;
          const y = baseY + row * blockSize;
          ctx.strokeRect(x, y, blockSize, blockSize);
          // Add slight variation in color for realism
          if ((row + col) % 2 === 0) {
            ctx.fillStyle = '#5a6578';
            ctx.fillRect(x + 1, y + 1, blockSize - 2, blockSize - 2);
          }
        }
      }
      
      // Draw archway opening for gate
      ctx.fillStyle = '#1a202c';
      ctx.beginPath();
      ctx.arc(baseX + baseW / 2, baseY + baseH, baseW / 3, 0, Math.PI, true);
      ctx.fill();
      
      // Draw gate archway detail
      ctx.strokeStyle = '#2d3748';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(baseX + baseW / 2, baseY + baseH, baseW / 3, 0, Math.PI, true);
      ctx.stroke();
    }
    
    if (towerLeft) {
      drawCastleTower(ctx, towerLeft);
    }
    
    if (towerRight) {
      drawCastleTower(ctx, towerRight);
    }
    
    // Entities
    entitiesRef.current.forEach(entity => {
      if (entity.type === EntityType.DECORATION) {
        // Skip - already drawn above
      } else if (entity.type === EntityType.CASTLE_GATE) {
        // Draw realistic castle gate with opening animation
        const gateOpenAmount = gateAnimationRef.current;
        const gateWidth = entity.width;
        const gateHeight = entity.height;
        const gateX = entity.x;
        const gateY = entity.y;
        
        // Left gate panel
        const leftPanelX = gateX - gateOpenAmount * gateWidth * 1.5;
        ctx.fillStyle = '#5d4037'; // Dark wood
        ctx.fillRect(leftPanelX, gateY, gateWidth / 2, gateHeight);
        
        // Right gate panel
        const rightPanelX = gateX + gateWidth / 2 + gateOpenAmount * gateWidth * 1.5;
        ctx.fillRect(rightPanelX, gateY, gateWidth / 2, gateHeight);
        
        // Wood grain texture and planks
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 2;
        const plankHeight = gateHeight / 6;
        for (let i = 0; i < 6; i++) {
          const plankY = gateY + i * plankHeight;
          // Left panel planks
          ctx.strokeRect(leftPanelX, plankY, gateWidth / 2, plankHeight);
          // Right panel planks
          ctx.strokeRect(rightPanelX, plankY, gateWidth / 2, plankHeight);
          
          // Wood grain lines
          ctx.strokeStyle = '#4e342e';
          ctx.lineWidth = 1;
          for (let j = 0; j < 3; j++) {
            const grainX = leftPanelX + (gateWidth / 2 / 4) * (j + 1);
            ctx.beginPath();
            ctx.moveTo(grainX, plankY);
            ctx.lineTo(grainX, plankY + plankHeight);
            ctx.stroke();
          }
          for (let j = 0; j < 3; j++) {
            const grainX = rightPanelX + (gateWidth / 2 / 4) * (j + 1);
            ctx.beginPath();
            ctx.moveTo(grainX, plankY);
            ctx.lineTo(grainX, plankY + plankHeight);
            ctx.stroke();
          }
          ctx.strokeStyle = '#3e2723';
          ctx.lineWidth = 2;
        }
        
        // Metal bands/straps on gate
        ctx.fillStyle = '#424242';
        ctx.fillRect(leftPanelX + 5, gateY + gateHeight / 3, gateWidth / 2 - 10, 8);
        ctx.fillRect(leftPanelX + 5, gateY + gateHeight * 2 / 3, gateWidth / 2 - 10, 8);
        ctx.fillRect(rightPanelX + 5, gateY + gateHeight / 3, gateWidth / 2 - 10, 8);
        ctx.fillRect(rightPanelX + 5, gateY + gateHeight * 2 / 3, gateWidth / 2 - 10, 8);
        
        // Rivets on metal bands
        ctx.fillStyle = '#212121';
        for (let i = 0; i < 3; i++) {
          const rivetX = leftPanelX + 10 + (gateWidth / 2 - 20) / 2 * i;
          ctx.beginPath();
          ctx.arc(rivetX, gateY + gateHeight / 3 + 4, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(rivetX, gateY + gateHeight * 2 / 3 + 4, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        for (let i = 0; i < 3; i++) {
          const rivetX = rightPanelX + 10 + (gateWidth / 2 - 20) / 2 * i;
          ctx.beginPath();
          ctx.arc(rivetX, gateY + gateHeight / 3 + 4, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(rivetX, gateY + gateHeight * 2 / 3 + 4, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Gate handle/ring (only when closed)
        if (gateOpenAmount < 0.3) {
          ctx.fillStyle = '#d4af37';
          ctx.strokeStyle = '#b8941f';
          ctx.lineWidth = 2;
          // Left panel handle
          ctx.beginPath();
          ctx.arc(leftPanelX + gateWidth / 2 - 8, gateY + gateHeight / 2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Right panel handle
          ctx.beginPath();
          ctx.arc(rightPanelX + 8, gateY + gateHeight / 2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      } else if (entity.type === EntityType.GOAL) {
        if (levelData.id === 2) {
          // Draw stairs to Fiona's room for Level 2
          const stairsX = entity.x;
          const stairsBaseY = entity.y + entity.height;
          const stairsHeight = 200;
          const stepWidth = 50;
          const stepHeight = 20;
          const stepCount = 10;

          // Draw each step going upward
          ctx.fillStyle = '#78350f'; // Brown wood/stone
          for (let i = 0; i < stepCount; i++) {
            const stepX = stairsX + (stepWidth * i);
            const stepY = stairsBaseY - (stepHeight * (i + 1));
            ctx.fillRect(stepX, stepY, stepWidth, stepHeight);
            
            // Add step edge/highlight
            ctx.fillStyle = '#92400e';
            ctx.fillRect(stepX, stepY, stepWidth, 3);
            ctx.fillStyle = '#78350f';
          }
        }
        // Level 1 goal remains invisible (no drawing) so player just passes through gate
      } else if (entity.type === EntityType.HAZARD && entity.properties?.isFireball) {
        // Draw fireball with glow effect
        const fbX = entity.x + entity.width / 2;
        const fbY = entity.y + entity.height / 2;
        const radius = entity.width / 2;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(fbX, fbY, 0, fbX, fbY, radius * 2);
        gradient.addColorStop(0, '#ffaa00');
        gradient.addColorStop(0.5, '#ff6b00');
        gradient.addColorStop(1, 'rgba(255, 107, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(fbX, fbY, radius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Core fireball
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(fbX, fbY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner bright core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(fbX - radius * 0.3, fbY - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = entity.color || '#888';
        ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
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
  }, [playerSprite, levelData.id]);

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
