import React, { useState, useEffect } from 'react';
import { portfolioData } from '../../data/portfolio';
import { soundManager } from '../../audio/soundManager';
import confetti from 'canvas-confetti';
import {
  Compass,
  Volume2,
  VolumeX,
  HelpCircle,
  Sparkles,
  MapPin,
  ChevronDown
} from 'lucide-react';

export function GameHUD({
  nearbyZone,
  onInteract,
  onOpenSettings,
  isMuted,
  onToggleMute,
  playerPosition,
  onTeleport,
  visitedZones = []
}) {
  const [fastTravelOpen, setFastTravelOpen] = useState(false);
  const [celebrated, setCelebrated] = useState(false);

  const totalZones = portfolioData.zones.length;
  const visitedCount = visitedZones.length;

  // Trigger celebration when all zones are discovered
  useEffect(() => {
    if (visitedCount >= totalZones && !celebrated) {
      setCelebrated(true);
      soundManager.playCelebration();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [visitedCount, totalZones, celebrated]);

  // Mini-map coordinate mapping (island radius ~ 36 units maps to 46% radar radius)
  const mapScale = 1.3;
  const radarRadius = 55; // pixels
  const px = playerPosition ? Math.max(-radarRadius, Math.min(radarRadius, playerPosition.x * mapScale)) : 0;
  const pz = playerPosition ? Math.max(-radarRadius, Math.min(radarRadius, playerPosition.z * mapScale)) : 0;

  const handleTeleportZone = (zone) => {
    setFastTravelOpen(false);
    onTeleport(zone.position);
  };

  return (
    <div className="game-hud-container">
      {/* ================= TOP BAR ================= */}
      <header className="hud-top-bar">
        <div className="hud-identity">
          <div className="hud-avatar-ring">
            <span className="hud-status-dot" />
            <span className="hud-pilot-tag">LVL 5</span>
          </div>
          <div>
            <div className="hud-player-name">{portfolioData.personal.name}</div>
            <div className="hud-player-role">{portfolioData.personal.title.split('&')[0]}</div>
          </div>
        </div>

        {/* Discovery Quest Log */}
        <div className="hud-quest-tracker">
          <div className="quest-label">
            <Sparkles size={14} className="neon-cyan-text" />
            <span>Exploration: {visitedCount}/{totalZones}</span>
          </div>
          <div className="quest-progress-bar">
            <div
              className="quest-progress-fill"
              style={{ width: `${(visitedCount / totalZones) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="hud-actions">
          {/* Fast travel dropdown */}
          <div className="dropdown-wrapper">
            <button
              onClick={() => setFastTravelOpen(!fastTravelOpen)}
              className="hud-action-btn"
              title="Fast Travel Teleport"
            >
              <MapPin size={16} />
              <span className="btn-text-desktop">Fast Travel</span>
              <ChevronDown size={14} />
            </button>

            {fastTravelOpen && (
              <div className="fast-travel-menu">
                <div className="fast-travel-header">Select Destination</div>
                {portfolioData.zones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => handleTeleportZone(zone)}
                    className="fast-travel-item"
                  >
                    <span
                      className="zone-indicator"
                      style={{ backgroundColor: zone.color }}
                    />
                    <div className="zone-meta">
                      <div className="zone-name">{zone.title}</div>
                      <div className="zone-sub">{zone.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Mute */}
          <button
            onClick={onToggleMute}
            className="hud-icon-btn"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Settings / Controls */}
          <button
            onClick={onOpenSettings}
            className="hud-icon-btn"
            title="Controls & Settings"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </header>

      {/* ================= RADAR / MINI-MAP ================= */}
      <div className="hud-radar-container">
        <div className="radar-header">
          <Compass size={12} />
          <span>Campus Radar</span>
        </div>
        <div className="radar-circle">
          {/* Concentric rings */}
          <div className="radar-ring inner" />
          <div className="radar-ring middle" />
          <div className="radar-crosshair-h" />
          <div className="radar-crosshair-v" />

          {/* Landmark Blips */}
          {portfolioData.zones.map((zone) => {
            const bx = zone.position[0] * mapScale;
            const bz = zone.position[2] * mapScale;
            const isDiscovered = visitedZones.includes(zone.id);

            return (
              <div
                key={zone.id}
                onClick={() => handleTeleportZone(zone)}
                className={`radar-blip ${isDiscovered ? 'visited' : ''}`}
                style={{
                  left: `calc(50% + ${bx}px)`,
                  top: `calc(50% + ${bz}px)`,
                  backgroundColor: zone.color,
                  boxShadow: `0 0 8px ${zone.color}`
                }}
                title={`Teleport to ${zone.title}`}
              />
            );
          })}

          {/* Player Blip */}
          <div
            className="radar-player-blip"
            style={{
              left: `calc(50% + ${px}px)`,
              top: `calc(50% + ${pz}px)`
            }}
          >
            <div className="player-pulse" />
          </div>
        </div>
      </div>

      {/* ================= INTERACTION PROMPT ================= */}
      {nearbyZone && (
        <div className="hud-interact-prompt-bar">
          <button
            onClick={() => onInteract(nearbyZone)}
            className="interact-prompt-btn"
            id="interact-station-btn"
            style={{ borderColor: nearbyZone.color, boxShadow: `0 0 25px ${nearbyZone.color}66` }}
          >
            <span className="interact-key-pill">[E]</span>
            <div className="interact-text-group">
              <span className="interact-action-title">
                Interact with {nearbyZone.title}
              </span>
              <span className="interact-action-desc">
                {nearbyZone.subtitle}
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
