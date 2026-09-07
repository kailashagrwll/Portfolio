import React from 'react';
import { soundManager } from '../../audio/soundManager';
import { X, Volume2, VolumeX, RotateCcw, Navigation, Check } from 'lucide-react';

export function SettingsModal({
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
  onResetPosition
}) {
  if (!isOpen) return null;

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    soundManager.setVolume(val);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="settings-window glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Controls & Audio Settings</h3>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body custom-scrollbar">
          {/* Audio Controls */}
          <div className="settings-section">
            <h4>Audio System</h4>
            <div className="settings-row">
              <span>Master Sound</span>
              <button
                onClick={onToggleMute}
                className="btn-secondary-glass"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>
            </div>

            <div className="settings-row">
              <span>Volume Level</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                defaultValue="0.35"
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="settings-section">
            <h4>Campus Actions</h4>
            <div className="settings-buttons-grid">
              <button
                onClick={() => {
                  onResetPosition();
                  onClose();
                }}
                className="btn-secondary-glass"
              >
                <RotateCcw size={16} />
                <span>Respawn at Center</span>
              </button>
            </div>
          </div>

          {/* Controls Legend */}
          <div className="settings-section">
            <h4>Keyboard & Mouse Controls</h4>
            <div className="controls-legend-grid">
              <div className="legend-row">
                <span className="key-cap">W / A / S / D</span>
                <span>Move character</span>
              </div>
              <div className="legend-row">
                <span className="key-cap">Shift</span>
                <span>Sprint speed boost</span>
              </div>
              <div className="legend-row">
                <span className="key-cap">Space</span>
                <span>Jump</span>
              </div>
              <div className="legend-row">
                <span className="key-cap">E</span>
                <span>Interact with station</span>
              </div>
              <div className="legend-row">
                <span className="key-cap">Mouse</span>
                <span>Look around character</span>
              </div>
              <div className="legend-row">
                <span className="key-cap">Esc</span>
                <span>Close menus</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-primary-glow full-width">
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
