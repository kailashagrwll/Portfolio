import React from 'react';
import { portfolioData } from '../../data/portfolio';
import { soundManager } from '../../audio/soundManager';
import { Play, Volume2, VolumeX, Sparkles, Navigation } from 'lucide-react';

export function StartScreen({ onEnterGame, isMuted, onToggleMute }) {
  const { personal } = portfolioData;

  const handleEnterWorld = () => {
    soundManager.ensureContext();
    soundManager.playClick();
    if (!isMuted) {
      soundManager.startAmbientMusic();
    }
    onEnterGame();
  };

  return (
    <div className="start-screen-overlay">
      <div className="start-screen-backdrop" />

      {/* Top audio toggle */}
      <button
        onClick={onToggleMute}
        className="audio-toggle-btn"
        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        <span>{isMuted ? 'Audio Off' : 'Audio On'}</span>
      </button>

      <div className="start-screen-content">
        <div className="badge-pill">
          <Sparkles size={14} className="neon-cyan-text" />
          <span>Interactive 3D Portfolio & Exploration Game</span>
        </div>

        <h1 className="hero-title">
          {personal.name}
        </h1>

        <div className="hero-subtitle">
          {personal.title}
        </div>

        <p className="hero-description">
          {personal.tagline}
        </p>

        {/* Action Buttons */}
        <div className="start-action-group">
          <button
            onClick={handleEnterWorld}
            className="btn-primary-glow"
            id="enter-world-btn"
          >
            <Play size={18} fill="currentColor" />
            <span>Enter the 3D World</span>
          </button>
        </div>

        {/* Controls Cheatsheet Card */}
        <div className="controls-cheatsheet">
          <div className="cheatsheet-title">
            <Navigation size={14} />
            <span>Game Controls</span>
          </div>
          <div className="controls-grid">
            <div className="control-item">
              <span className="key-cap">W A S D</span>
              <span className="control-label">Move Character</span>
            </div>
            <div className="control-item">
              <span className="key-cap">Shift</span>
              <span className="control-label">Sprint (1.8x)</span>
            </div>
            <div className="control-item">
              <span className="key-cap">Space</span>
              <span className="control-label">Jump</span>
            </div>
            <div className="control-item">
              <span className="key-cap">E</span>
              <span className="control-label">Interact Station</span>
            </div>
          </div>
          <div className="cheatsheet-footer">
            Mobile touch controls & virtual joystick supported automatically.
          </div>
        </div>
      </div>
    </div>
  );
}
