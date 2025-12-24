import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import { MainMenu, GameOverScreen, HUD, RoadmapView, StorySequence } from './components/Menu';
import { GameState, LevelData } from './types';
import { generateLevel1, generateLevel2 } from './services/levelService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentLevelData, setCurrentLevelData] = useState<LevelData>(generateLevel1());

  const startStory = () => {
    setGameState(GameState.INTRO);
  };

  const startGame = () => {
    setScore(0);
    setCurrentLevel(1);
    setCurrentLevelData(generateLevel1());
    setGameState(GameState.PLAYING);
  };

  const handleGameOver = () => {
    setGameState(GameState.GAME_OVER);
  };

  const handleVictory = () => {
    // Show victory screen for the current level
    setGameState(GameState.VICTORY);
  };

  const restartLevel2 = () => {
    setScore(0);
    setCurrentLevel(2);
    setCurrentLevelData(generateLevel2());
    setGameState(GameState.PLAYING);
  };

  const handleNextLevel = () => {
    if (currentLevel === 1) {
      // Move from Level 1 (outside) into Level 2 (inside castle)
      setScore(0);
      setCurrentLevel(2);
      setCurrentLevelData(generateLevel2());
      setGameState(GameState.PLAYING);
    } else {
      // After Level 2, loop back to Level 1 for now
      setScore(0);
      setCurrentLevel(1);
      setCurrentLevelData(generateLevel1());
      setGameState(GameState.PLAYING);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" 
         style={{ backgroundColor: '#2d3748' }}>
      
      {/* Game Container */}
      <div className="relative shadow-2xl rounded-lg overflow-hidden" style={{ width: 800, height: 600 }}>
        
        {/* Game Render Layer */}
        {(gameState === GameState.PLAYING || gameState === GameState.PAUSED) && (
          <>
            <GameCanvas 
              levelData={currentLevelData}
              onGameOver={handleGameOver}
              onVictory={handleVictory}
              onScoreUpdate={setScore}
              setGameState={setGameState}
              gameState={gameState}
            />
            <HUD score={score} level={`${currentLevel} - ${currentLevelData.name.toUpperCase()}`} />
          </>
        )}

        {/* UI Overlay Layers */}
        {gameState === GameState.MENU && (
          <MainMenu 
            onStart={startStory} 
            onShowRoadmap={() => setGameState(GameState.ROADMAP)} 
          />
        )}

        {gameState === GameState.INTRO && (
          <StorySequence onComplete={startGame} />
        )}

        {gameState === GameState.ROADMAP && (
          <RoadmapView onBack={() => setGameState(GameState.MENU)} />
        )}

        {(gameState === GameState.GAME_OVER || gameState === GameState.VICTORY) && (
          <GameOverScreen 
            onRestart={
              gameState === GameState.VICTORY
                ? handleNextLevel
                : currentLevel === 2
                  ? restartLevel2
                  : startGame
            }
            onBackToMenu={() => {
              setScore(0);
              setGameState(GameState.MENU);
            }}
            isVictory={gameState === GameState.VICTORY}
            score={score}
            level={currentLevel}
          />
        )}

        {gameState === GameState.PAUSED && (
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
             <div className="text-center">
               <h2 className="text-white text-4xl font-bold mb-4">PAUSED</h2>
               <button 
                onClick={() => setGameState(GameState.PLAYING)}
                className="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-600"
               >
                 RESUME
               </button>
             </div>
           </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="absolute bottom-4 text-stone-500 text-xs font-mono">
        v0.2.0 PROTOTYPE | Shrek's Castle Run
      </div>
    </div>
  );
};

export default App;