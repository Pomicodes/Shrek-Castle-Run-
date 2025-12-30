import { Entity } from '../types';

/**
 * Helper function to draw realistic castle tower
 */
export const drawCastleTower = (ctx: CanvasRenderingContext2D, tower: Entity) => {
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

