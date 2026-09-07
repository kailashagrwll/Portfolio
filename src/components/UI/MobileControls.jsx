import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowUp, Zap, Sparkles, Move } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

export function MobileControls({ setVirtualInput, nearbyZone, onInteract }) {
  const movementZoneRef = useRef(null);
  const touchIdRef = useRef(null);
  const originRef = useRef({ x: 0, y: 0 });

  // Dynamic joystick position and knob displacement
  const [joystickCenter, setJoystickCenter] = useState({ x: 0, y: 0 });
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isSprintActive, setIsSprintActive] = useState(false);

  const MAX_RADIUS = 52; // pixels of maximum drag from touch origin

  // Update joystick displacement and feed input
  const processMovement = useCallback((clientX, clientY) => {
    const dx = clientX - originRef.current.x;
    const dy = clientY - originRef.current.y;
    const dist = Math.hypot(dx, dy);

    let limitedX = dx;
    let limitedY = dy;
    if (dist > MAX_RADIUS) {
      limitedX = (dx / dist) * MAX_RADIUS;
      limitedY = (dy / dist) * MAX_RADIUS;
    }

    setKnobOffset({ x: limitedX, y: limitedY });

    // Normalized analog coordinates (-1 to 1)
    const normX = limitedX / MAX_RADIUS;
    const normY = limitedY / MAX_RADIUS;

    setVirtualInput('analogVector', { x: normX, y: normY });

    // Directional thresholds for boolean fallbacks
    const deadzone = 0.22;
    setVirtualInput('forward', normY < -deadzone);
    setVirtualInput('backward', normY > deadzone);
    setVirtualInput('left', normX < -deadzone);
    setVirtualInput('right', normX > deadzone);
  }, [setVirtualInput]);

  // Touch handlers attached to the touch movement zone
  useEffect(() => {
    const zoneEl = movementZoneRef.current;
    if (!zoneEl) return;

    const onTouchStart = (e) => {
      // If already tracking a touch, ignore subsequent touches in this zone
      if (touchIdRef.current !== null) return;

      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;

      originRef.current = { x: touch.clientX, y: touch.clientY };
      setJoystickCenter({ x: touch.clientX, y: touch.clientY });
      setKnobOffset({ x: 0, y: 0 });
      setIsActive(true);

      if (navigator.vibrate) navigator.vibrate(10);
      e.preventDefault();
    };

    const onTouchMove = (e) => {
      if (touchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          processMovement(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
          e.preventDefault();
          break;
        }
      }
    };

    const onTouchEnd = (e) => {
      if (touchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          setIsActive(false);
          setKnobOffset({ x: 0, y: 0 });

          setVirtualInput('analogVector', { x: 0, y: 0 });
          setVirtualInput('forward', false);
          setVirtualInput('backward', false);
          setVirtualInput('left', false);
          setVirtualInput('right', false);
          e.preventDefault();
          break;
        }
      }
    };

    zoneEl.addEventListener('touchstart', onTouchStart, { passive: false });
    zoneEl.addEventListener('touchmove', onTouchMove, { passive: false });
    zoneEl.addEventListener('touchend', onTouchEnd, { passive: false });
    zoneEl.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      zoneEl.removeEventListener('touchstart', onTouchStart);
      zoneEl.removeEventListener('touchmove', onTouchMove);
      zoneEl.removeEventListener('touchend', onTouchEnd);
      zoneEl.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [processMovement, setVirtualInput]);

  // Handle Jump Tap
  const handleJump = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.vibrate) navigator.vibrate(15);
    setVirtualInput('jump', true);
    setTimeout(() => setVirtualInput('jump', false), 200);
  };

  // Toggle Sprint Mode
  const handleToggleSprint = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isSprintActive;
    setIsSprintActive(nextState);
    setVirtualInput('sprint', nextState);
    soundManager.playClick();
    if (navigator.vibrate) navigator.vibrate(nextState ? 25 : 12);
  };

  // Interact Station
  const handleInteract = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (nearbyZone) {
      if (navigator.vibrate) navigator.vibrate(30);
      onInteract(nearbyZone);
    }
  };

  return (
    <div className="mobile-controls-overlay">
      {/* Dynamic Touch Movement Area (Left 58% of screen) */}
      <div ref={movementZoneRef} className="touch-movement-zone">
        {/* Dynamic Joystick: Appears where the user touches */}
        {isActive ? (
          <div
            className="dynamic-joystick-base"
            style={{
              left: `${joystickCenter.x}px`,
              top: `${joystickCenter.y}px`
            }}
          >
            {/* Direction hints */}
            <div className="joystick-dir-indicator dir-n">▲</div>
            <div className="joystick-dir-indicator dir-s">▼</div>
            <div className="joystick-dir-indicator dir-w">◀</div>
            <div className="joystick-dir-indicator dir-e">▶</div>

            {/* Moving Knob */}
            <div
              className="dynamic-joystick-knob"
              style={{
                transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`
              }}
            >
              <div className="knob-core" />
            </div>
          </div>
        ) : (
          /* Subtle idle guide when not touching */
          <div className="movement-idle-guide">
            <Move size={14} className="guide-icon-pulse" />
            <span>Tap & drag anywhere here to move</span>
          </div>
        )}
      </div>

      {/* Action Buttons (Bottom Right) */}
      <div className="mobile-action-buttons">
        {/* Dynamic Station Interact Button when nearby */}
        {nearbyZone && (
          <button
            onTouchStart={handleInteract}
            onClick={handleInteract}
            className="mobile-btn mobile-btn-interact"
            style={{
              borderColor: nearbyZone.color,
              boxShadow: `0 0 24px ${nearbyZone.color}bb`,
              background: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), ${nearbyZone.color}44)`
            }}
          >
            <Sparkles size={18} style={{ color: nearbyZone.color }} />
            <div className="interact-btn-text">
              <span className="interact-station-action">OPEN</span>
              <span className="interact-station-title">{nearbyZone.title}</span>
            </div>
          </button>
        )}

        {/* Control cluster: Sprint & Jump */}
        <div className="mobile-action-cluster">
          {/* Sprint Toggle Button */}
          <button
            onTouchStart={handleToggleSprint}
            onClick={handleToggleSprint}
            className={`mobile-btn mobile-btn-sprint ${isSprintActive ? 'btn-sprint-active' : ''}`}
            title="Toggle Fast Sprint"
          >
            <Zap size={18} />
            <span>{isSprintActive ? 'FAST ON' : 'SPRINT'}</span>
          </button>

          {/* Jump Button */}
          <button
            onTouchStart={handleJump}
            onClick={handleJump}
            className="mobile-btn mobile-btn-jump"
            title="Jump"
          >
            <ArrowUp size={22} />
            <span>JUMP</span>
          </button>
        </div>
      </div>
    </div>
  );
}
