
export const GRAVITY = 0.6;
export const FRICTION = 0.8;
export const MOVE_SPEED = 5;
export const JUMP_FORCE = -14;
export const MAX_FALL_SPEED = 12;

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// SVG Data for a more detailed, ogre-like Shrek without external image files
const OGRE_SVG = `
<svg width="50" height="80" viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg">
  <!-- Shadow -->
  <ellipse cx="25" cy="75" rx="18" ry="5" fill="rgba(0,0,0,0.25)" />

  <!-- Legs -->
  <rect x="14" y="52" width="8" height="18" fill="#3b2f2f" rx="2" />
  <rect x="28" y="52" width="8" height="18" fill="#3b2f2f" rx="2" />
  <!-- Boots -->
  <rect x="12" y="68" width="12" height="4" fill="#1b1b1b" rx="1" />
  <rect x="26" y="68" width="12" height="4" fill="#1b1b1b" rx="1" />

  <!-- Tunic -->
  <rect x="11" y="30" width="28" height="26" fill="#f5f5dc" rx="6" />
  <path d="M11 32 Q25 44 39 32 L39 52 Q25 60 11 52 Z" fill="#e8e2c8" opacity="0.95" />

  <!-- Belt -->
  <rect x="11" y="46" width="28" height="5" fill="#5d4037" />
  <rect x="21" y="46" width="8" height="5" fill="#795548" />
  <rect x="22" y="47" width="6" height="3" fill="#d7ccc8" />

  <!-- Arms -->
  <rect x="6" y="32" width="8" height="18" fill="#f5f5dc" rx="4" />
  <rect x="36" y="32" width="8" height="18" fill="#f5f5dc" rx="4" />
  <!-- Hands -->
  <circle cx="10" cy="52" r="3" fill="#65a30d" />
  <circle cx="40" cy="52" r="3" fill="#65a30d" />

  <!-- Head -->
  <circle cx="25" cy="20" r="15" fill="#65a30d" />

  <!-- Ears (ogre horns) -->
  <rect x="6" y="11" width="5" height="10" fill="#65a30d" rx="2" transform="rotate(-18 6 11)" />
  <rect x="39" y="11" width="5" height="10" fill="#65a30d" rx="2" transform="rotate(18 44 11)" />

  <!-- Eyebrows -->
  <path d="M18 16 Q21 14 23 16" stroke="#2e2e2e" stroke-width="2" stroke-linecap="round" />
  <path d="M27 16 Q29 14 32 16" stroke="#2e2e2e" stroke-width="2" stroke-linecap="round" />

  <!-- Eyes -->
  <circle cx="20" cy="19" r="3" fill="white" />
  <circle cx="30" cy="19" r="3" fill="white" />
  <circle cx="20.5" cy="19" r="1.5" fill="black" />
  <circle cx="29.5" cy="19" r="1.5" fill="black" />

  <!-- Nose -->
  <path d="M24 20 Q25 23 26 20" stroke="#2e2e2e" stroke-width="1.5" fill="none" />

  <!-- Mouth -->
  <path d="M20 25 Q25 29 30 25" stroke="#2e2e2e" stroke-width="2" fill="none" />
  <path d="M21 25 Q25 27.5 29 25" stroke="#8bc34a" stroke-width="1.5" fill="none" />

  <!-- Chin shadow -->
  <ellipse cx="25" cy="28" rx="7" ry="2.5" fill="rgba(0,0,0,0.18)" />
</svg>
`;

export const ASSETS = {
  BACKGROUND_LEVEL_1: 'https://picsum.photos/id/10/800/600',
  BACKGROUND_LEVEL_2: 'https://picsum.photos/id/16/800/600',
  BACKGROUND_LEVEL_3: 'https://picsum.photos/id/54/800/600',
  // Use encoded SVG for Shrek
  SHREK_IDLE: `data:image/svg+xml;base64,${btoa(OGRE_SVG)}`,
  FIONA: 'https://picsum.photos/id/338/50/80',
  PLATFORM_STONE: '#5d4037',
  LAVA: '#e53935',
  COIN: '#ffeb3b',
};

export const AUDIO_SOURCES = {
  // Cartoon "Boing" for jumping
  JUMP: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  // Magical chime for coins
  COIN: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  // Cartoon "Burp" for damage/hazards - fits the Shrek theme humorously
  DAMAGE: 'https://assets.mixkit.co/active_storage/sfx/2692/2692-preview.mp3',
  // Fanfare for victory
  VICTORY: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'
};

// Colors
export const COLORS = {
  UI_BG: 'rgba(0, 0, 0, 0.85)',
  TEXT_PRIMARY: '#fcd34d', // Gold/Yellow
  TEXT_SECONDARY: '#fff',
  BUTTON_BG: '#4d7c0f', // Ogre Green
  BUTTON_HOVER: '#3f6212',
};
