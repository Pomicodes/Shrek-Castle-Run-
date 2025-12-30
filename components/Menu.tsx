import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { COLORS } from '../constants';

interface MenuProps {
  onStart: () => void;
  onShowLevels: () => void;
}

export const MainMenu: React.FC<MenuProps> = ({ onStart, onShowLevels }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-cover bg-center overflow-hidden" 
       style={{ 
         backgroundColor: COLORS.UI_BG,
         // Cinematic dark castle
         backgroundImage: 'url("https://images.unsplash.com/photo-1533158388470-9a56699990c6?q=80&w=1200")',
         backgroundBlendMode: 'multiply'
       }}>
    {/* Floating Particles/Dust effect overlay could go here */}
    <div className="absolute inset-0 bg-black/40" />

    <div className="relative z-10 bg-stone-900/90 p-12 rounded-xl border-4 border-yellow-600 text-center shadow-2xl max-w-lg w-full animate-fade-in">
      <h1 className="text-6xl font-bold mb-4 text-yellow-500 tracking-wider drop-shadow-md font-medieval">Shrek's Castle Run</h1>
      <p className="text-stone-300 mb-8 text-xl">Rescue Fiona from the Dragon!</p>
      
      <div className="space-y-4">
        <button 
          onClick={onStart}
          className="w-full py-4 text-2xl font-bold text-white rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg border-2 border-green-800 hover:border-green-400"
          style={{ backgroundColor: COLORS.BUTTON_BG }}
        >
          START STORY
        </button>
        
        <button 
          onClick={onShowLevels}
          className="w-full py-3 text-xl font-bold text-stone-200 bg-stone-700 rounded-lg hover:bg-stone-600 border-2 border-stone-500"
        >
          LEVELS
        </button>
      </div>

      <div className="mt-8 text-stone-500 text-sm">
        Use Arrow Keys Move & Jump
      </div>
    </div>
    <style>{`
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .animate-fade-in { animation: fadeIn 1.5s ease-out; }
      .font-medieval { font-family: 'MedievalSharp', cursive; }
    `}</style>
  </div>
);

export const StorySequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  // Using images that evoke the Shrek movie aesthetic (Swamp, Castle, Dragon Eye)
  const stories = [
    {
      text: "Once upon a time, in a swamp...",
      subtext: "An ogre named Shrek lived in solitude, until his peace was disturbed.",
      // A misty, green forest/swamp
      bg: "https://images.unsplash.com/photo-1440557653017-487629599554?q=80&w=1200"
    },
    {
      text: "A Deal was Struck!",
      subtext: "To get his swamp back, Shrek must rescue Princess Fiona from the Dragon's Keep.",
      // A foreboding castle bridge/volcano look
      bg: "https://images.unsplash.com/photo-1533158388470-9a56699990c6?q=80&w=1200"
    },
    {
      text: "The Dragon Awaits...",
      subtext: "Cross the bridge, dodge the fire, and save the Princess!",
      // Extreme close up of fire/eye or lava
      bg: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=1200"
    }
  ];

  const handleNext = () => {
    if (step < stories.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="absolute inset-0 z-20 overflow-hidden bg-black font-medieval">
      {/* Storybook Border Overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none border-[20px] border-stone-800 rounded-none shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]" />

      {/* Animated Background Layer */}
      <div 
        key={`bg-${step}`} 
        className="absolute inset-0 bg-cover bg-center animate-pan-zoom"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url(${stories[step].bg})`,
        }} 
      />
      
      {/* Content Layer */}
      <div className="relative z-40 flex flex-col items-center justify-center h-full text-center px-8">
        {/* Parchment/Scroll container */}
        <div className="max-w-4xl px-16 py-12 bg-[#f4e4bc] text-stone-900 rounded-sm border-8 border-[#8b5a2b] shadow-2xl transform rotate-1 transition-all duration-500">
          
          <h2 
            key={`title-${step}`} 
            className="text-5xl font-bold text-[#5d4037] mb-6 drop-shadow-sm font-serif opacity-0 animate-slide-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            {stories[step].text}
          </h2>
          
          <div 
            key={`line-${step}`} 
            className="w-full h-1 bg-[#8b5a2b] mb-6 opacity-0 animate-slide-up" 
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }} 
          />
          
          <p 
            key={`text-${step}`} 
            className="text-3xl text-[#3e2723] mb-10 font-serif italic leading-relaxed opacity-0 animate-slide-up" 
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            {stories[step].subtext}
          </p>
          
          <button 
            onClick={handleNext}
            className="px-10 py-3 bg-[#4d7c0f] text-[#fefce8] text-2xl font-bold rounded hover:bg-[#3f6212] border-4 border-[#365314] transition-all transform hover:scale-105 shadow-xl opacity-0 animate-fade-in"
            style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
          >
            {step === stories.length - 1 ? "ENTER CASTLE" : "NEXT PAGE ➡"}
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
        .font-medieval {
          font-family: 'MedievalSharp', cursive;
        }
        
        /* Ken Burns Effect */
        @keyframes panZoom {
          0% { transform: scale(1.0) translate(0, 0); }
          100% { transform: scale(1.1) translate(-2%, -1%); }
        }
        .animate-pan-zoom {
          animation: panZoom 12s ease-out forwards;
        }

        /* Text Animations */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }

        @keyframes fadeInSimple {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeInSimple 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export const LevelsView: React.FC<{ onBack: () => void; onSelectLevel: (level: number) => void }> = ({ onBack, onSelectLevel }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-stone-900 text-white p-8">
    <div className="max-w-4xl w-full h-full overflow-y-auto pr-4">
      <div className="flex justify-between items-center mb-6 border-b border-stone-600 pb-4">
        <h2 className="text-4xl font-bold text-yellow-500">Select Level</h2>
        <button onClick={onBack} className="text-stone-400 hover:text-white underline">Back to Menu</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LevelCard 
          level={1}
          name="The Castle Gate"
          description="Training Stage"
          onSelect={() => onSelectLevel(1)}
        />
        <LevelCard 
          level={2}
          name="Inside the Castle"
          description="Lava Halls"
          onSelect={() => onSelectLevel(2)}
        />
        <LevelCard 
          level={3}
          name="Dragon's Lair"
          description="Final Boss"
          onSelect={() => onSelectLevel(3)}
        />
      </div>
    </div>
  </div>
);

const LevelCard: React.FC<{level: number, name: string, description: string, onSelect: () => void}> = ({ level, name, description, onSelect }) => (
  <div className="bg-stone-800 p-6 rounded-lg border border-stone-600 shadow-md hover:border-yellow-500 transition-all cursor-pointer" onClick={onSelect}>
    <div className="flex justify-between items-baseline mb-3">
      <h3 className="text-2xl font-bold text-yellow-500">Level {level}</h3>
      <span className="text-stone-400 text-sm italic">{description}</span>
    </div>
    <h4 className="text-xl font-semibold text-green-400 mb-4">{name}</h4>
    <button 
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      className="w-full py-2 text-lg font-bold text-white bg-green-700 rounded hover:bg-green-600 border-2 border-green-800 transition-transform hover:scale-105"
    >
      Play Level {level}
    </button>
  </div>
);

export const GameOverScreen: React.FC<{ onRestart: () => void; onBackToMenu: () => void; isVictory: boolean; score: number; level: number }> = ({ onRestart, onBackToMenu, isVictory, score, level }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80 animate-fade-in">
     <div className={`p-10 rounded-xl text-center border-8 ${isVictory ? 'border-yellow-400 bg-stone-800' : 'border-red-800 bg-stone-900'} shadow-2xl`}>
        <h2 className={`text-6xl font-bold mb-4 ${isVictory ? 'text-yellow-400' : 'text-red-600'} drop-shadow-lg`}>
          {isVictory 
            ? (level === 3 
                ? 'VICTORY! FIONA RESCUED!' 
                : level === 2 
                  ? 'LEVEL 2 COMPLETED!' 
                  : 'LEVEL COMPLETED!') 
            : 'GAME OVER'}
        </h2>
        <p className="text-white text-3xl mb-6">Final Score: {score}</p>
        <p className="text-stone-400 italic mb-8 text-xl">
          {isVictory 
            ? (level === 3 
                ? "Donkey: \"You did it Shrek! Fiona is free!\"" 
                : level === 2 
                  ? "Donkey: \"Almost there Shrek!\"" 
                  : "Donkey: \"Half way done, you did it!\"") 
            : "The Dragon got you..."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onRestart}
            className="px-8 py-3 text-xl font-bold bg-white text-black rounded hover:bg-gray-200 transition-transform hover:scale-105"
          >
            {isVictory ? 'Next Level' : 'Try Again'}
          </button>
          {!isVictory && (
            <button
              onClick={onBackToMenu}
              className="px-6 py-3 text-lg font-semibold bg-stone-800 text-stone-100 rounded border border-stone-500 hover:bg-stone-700 transition-transform hover:scale-105"
            >
              Back to Menu
            </button>
          )}
        </div>
     </div>
  </div>
);

export const HUD: React.FC<{ score: number, level: string }> = ({ score, level }) => (
  <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none text-white drop-shadow-md z-30">
    <div className="flex items-center space-x-4">
      <div className="flex -space-x-1">
        {/* Hearts */}
        <span className="text-3xl text-red-500 drop-shadow-sm">♥</span>
        <span className="text-3xl text-red-500 drop-shadow-sm">♥</span>
        <span className="text-3xl text-red-500 drop-shadow-sm">♥</span>
      </div>
      <div className="bg-stone-900/50 px-3 py-1 rounded border border-stone-600 backdrop-blur-sm">
        <span className="text-stone-300 text-xs tracking-widest uppercase">Level</span>
        <div className="text-xl font-bold text-yellow-400">{level}</div>
      </div>
    </div>
    
    <div className="flex flex-col items-end">
      <div className="bg-stone-900/50 px-4 py-2 rounded border border-stone-600 backdrop-blur-sm">
        <span className="text-yellow-500 font-bold text-2xl font-mono">{score.toString().padStart(6, '0')}</span>
      </div>
    </div>
  </div>
);