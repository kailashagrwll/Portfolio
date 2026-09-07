import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowUp, Zap, Sparkles, Navigation } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

export function MobileControls({ setVirtualInput, nearbyZone, onInteract }) {
  const joystickBaseRef = useRef(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);
  const [isSprintActive, setIsSprintActive] = useState(false);
  const touchIdRef = useRef(null);

  // Update joystick displacement and feed input
  const updateJoystick = useCallback((clientX, clientY) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = rect.width / 2.1;
    const dist = Math.hypot(dx, dy);

    let limitedX = dx;
    let limitedY = dy;
    if (dist > maxRadius) {
      limitedX = (dx / dist) * maxRadius;
      limitedY = (dy / dist) * maxRadius;
    }

    setKnobPos({ x: limitedX, y: limitedY });

    // Normalized analog coordinates (-1 to 1)
    const normX = limitedX / maxRadius;
    const normY = limitedY / maxRadius;

    setVirtualInput('analogVector', { x: normX, y: normY });

    // Directional thresholds for boolean fallbacks
    const deadzone = 0.25;
    setVirtualInput('forward', normY < -deadzone);
    setVirtualInput('backward', normY > deadzone);
    setVirtualInput('left', normX < -deadzone);
    setVirtualInput('right', normX > deadzone);
  }, [setVirtualInput]);

  // Touch handlers with passive: false to prevent scrolling
  useEffect(() => {
    const el = joystickBaseRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;
      setIsTouching(true);
      updateJoystick(touch.clientX, touch.clientY);
      if (navigator.vibrate) navigator.vibrate(10);
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
          break;
        }
      }
    };

    const onTouchEnd = (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          setIsTouching(false);
          setKnobPos({ x: 0, y: 0 });
          touchIdRef.current = null;
          setVirtualInput('analogVector', { x: 0, y: 0 });
          setVirtualInput('forward', false);
          setVirtualInput('backward', false);
          setVirtualInput('left', false);
          setVirtualInput('right', false);
          break;
        }
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    el.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [updateJoystick, setVirtualInput]);

  // Handle Jump Tap
  const handleJump = (e) => {
    e.preventDefault();
    if (navigator.vibrate) navigator.vibrate(15);
    setVirtualInput('jump', true);
    setTimeout(() => setVirtualInput('jump', false), 200);
  };

  // Toggle Sprint Mode
  const handleToggleSprint = (e) => {
    e.preventDefault();
    const nextState = !isSprintActive;
    setIsSprintActive(nextState);
    setVirtualInput('sprint', nextState);
    soundManager.playClick();
    if (navigator.vibrate) navigator.vibrate(nextState ? 25 : 12);
  };

  // Interact Station
  const handleInteract = (e) => {
    e.preventDefault();
    if (nearbyZone) {
      if (navigator.vibrate) navigator.vibrate(30);
      onInteract(nearbyZone);
    }
  };

  return (
    <div className="mobile-controls-overlay">
      {/* Virtual Joystick (Bottom Left) */}
      <div className="joystick-container">
        <div ref={joystickBaseRef} className="virtual-joystick-base">
          {/* Compass direction indicators */}
          <div className="joystick-dir-indicator dir-n">▲</div>
          <div className="joystick-dir-indicator dir-s">▼</div>
          <div className="joystick-dir-indicator dir-w">◀</div>
          <div className="joystick-dir-indicator dir-e">▶</div>

          <div
            className={`virtual-joystick-knob ${isTouching ? 'knob-active' : ''}`}
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
              transition: isTouching ? 'none' : 'transform 0.16s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
            }}
          >
            <div className="knob-core" />
          </div>
        </div>
        <div className="joystick-guide-label">
          <Navigation size={10} />
          <span>DRAG TO MOVE</span>
        </div>
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
