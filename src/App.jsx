import React, { useState, useEffect, useCallback } from 'react';
import { GameCanvas } from './components/Game/GameCanvas';
import { StartScreen } from './components/UI/StartScreen';
import { GameHUD } from './components/UI/GameHUD';
import { InteractionModal } from './components/UI/InteractionModal';
import { SettingsModal } from './components/UI/SettingsModal';
import { MobileControls } from './components/UI/MobileControls';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { soundManager } from './audio/soundManager';
import { portfolioData } from './data/portfolio';

export default function App() {
  // Navigation state: 'start' | 'game'
  const [viewMode, setViewMode] = useState('start');
  const [isMuted, setIsMuted] = useState(false);
  const [activeModalZone, setActiveModalZone] = useState(null);
  const [nearbyZone, setNearbyZone] = useState(null);
  const [visitedZones, setVisitedZones] = useState(['spawn']);
  const [teleportTarget, setTeleportTarget] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0 });

  const { movement, setVirtualInput } = useKeyboardControls();

  // Handle Mute Toggle
  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
    if (!nextMuted && viewMode === 'game') {
      soundManager.startAmbientMusic();
    }
  }, [isMuted, viewMode]);

  // Handle Enter Game World from Start Screen
  const handleEnterGame = () => {
    setViewMode('game');
    if (!isMuted) {
      soundManager.startAmbientMusic();
    }
  };

  // Open Zone Interaction Modal
  const handleInteractZone = useCallback((zone) => {
    if (!zone) return;
    soundManager.playInteractOpen();
    setActiveModalZone(zone);

    // Track visited quest zones
    setVisitedZones((prev) => {
      if (!prev.includes(zone.id)) {
        return [...prev, zone.id];
      }
      return prev;
    });
  }, []);

  // Close Interaction Modal
  const handleCloseModal = useCallback(() => {
    soundManager.playInteractClose();
    setActiveModalZone(null);
  }, []);

  // Handle Teleport
  const handleTeleport = useCallback((coords) => {
    setTeleportTarget(coords);
  }, []);

  // Reset character to Spawn Plaza
  const handleResetPosition = useCallback(() => {
    setTeleportTarget([0, 0, 0]);
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    if (movement.escape) {
      if (activeModalZone) {
        handleCloseModal();
      } else if (settingsOpen) {
        setSettingsOpen(false);
      }
    }
  }, [movement.escape, activeModalZone, settingsOpen, handleCloseModal]);

  return (
    <div className="app-root">
      {/* 3D WebGL Canvas Layer */}
      <GameCanvas
        gameStarted={viewMode === 'game'}
        movement={activeModalZone || settingsOpen ? {} : movement}
        activeModal={activeModalZone}
        onInteractZone={handleInteractZone}
        nearbyZone={nearbyZone}
        setNearbyZone={setNearbyZone}
        onPlayerPositionChange={setPlayerPosition}
        teleportTarget={teleportTarget}
        onTeleportComplete={() => setTeleportTarget(null)}
      />

      {/* Start Screen (Cinematic Opening) */}
      {viewMode === 'start' && (
        <StartScreen
          onEnterGame={handleEnterGame}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Active Game HUD (During 'game' mode) */}
      {viewMode === 'game' && (
        <>
          <GameHUD
            nearbyZone={nearbyZone}
            onInteract={handleInteractZone}
            onOpenSettings={() => setSettingsOpen(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            playerPosition={playerPosition}
            onTeleport={handleTeleport}
            visitedZones={visitedZones}
          />

          {/* Mobile Touch Controls Overlay */}
          <MobileControls
            setVirtualInput={setVirtualInput}
            nearbyZone={nearbyZone}
            onInteract={handleInteractZone}
          />
        </>
      )}

      {/* Interactive Station Modal */}
      {activeModalZone && (
        <InteractionModal
          zone={activeModalZone}
          onClose={handleCloseModal}
        />
      )}

      {/* Settings & Help Modal */}
      {settingsOpen && (
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onResetPosition={handleResetPosition}
        />
      )}
    </div>
  );
}
