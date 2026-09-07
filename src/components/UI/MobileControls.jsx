import React, { useRef, useState, useEffect } from 'react';
import { ArrowUp, Zap, Sparkles } from 'lucide-react';

export function MobileControls({ setVirtualInput, nearbyZone, onInteract }) {
  const joystickBaseRef = useRef(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);
  const touchIdRef = useRef(null);

  // Joystick touch handlers
  const handleTouchStart = (e) => {
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsTouching(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        setIsTouching(false);
        setKnobPos({ x: 0, y: 0 });
        touchIdRef.current = null;
        setVirtualInput('forward', false);
        setVirtualInput('backward', false);
        setVirtualInput('left', false);
        setVirtualInput('right', false);
        break;
      }
    }
  };

  const updateJoystick = (clientX, clientY) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = rect.width / 2.2;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let limitedX = dx;
    let limitedY = dy;
    if (dist > maxRadius) {
      limitedX = (dx / dist) * maxRadius;
      limitedY = (dy / dist) * maxRadius;
    }

    setKnobPos({ x: limitedX, y: limitedY });

    // Directional thresholds
    const deadzone = 12;
    setVirtualInput('forward', limitedY < -deadzone);
    setVirtualInput('backward', limitedY > deadzone);
    setVirtualInput('left', limitedX < -deadzone);
    setVirtualInput('right', limitedX > deadzone);
  };

  return (
    <div className="mobile-controls-overlay">
      {/* Virtual Joystick */}
      <div
        ref={joystickBaseRef}
        className="virtual-joystick-base"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div
          className="virtual-joystick-knob"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: isTouching ? 'none' : 'transform 0.15s ease-out'
          }}
        />
      </div>

      {/* Action Buttons (Right) */}
      <div className="mobile-action-buttons">
        {/* Interact button */}
        {nearbyZone && (
          <button
            onTouchStart={() => onInteract(nearbyZone)}
            onClick={() => onInteract(nearbyZone)}
            className="mobile-btn mobile-btn-interact"
            style={{ borderColor: nearbyZone.color, boxShadow: `0 0 16px ${nearbyZone.color}88` }}
          >
            <Sparkles size={18} />
            <span>[E]</span>
          </button>
        )}

        {/* Sprint button */}
        <button
          onTouchStart={() => setVirtualInput('sprint', true)}
          onTouchEnd={() => setVirtualInput('sprint', false)}
          className="mobile-btn mobile-btn-sprint"
        >
          <Zap size={18} />
          <span>Sprint</span>
        </button>

        {/* Jump button */}
        <button
          onTouchStart={() => {
            setVirtualInput('jump', true);
            setTimeout(() => setVirtualInput('jump', false), 150);
          }}
          className="mobile-btn mobile-btn-jump"
        >
          <ArrowUp size={20} />
          <span>Jump</span>
        </button>
      </div>
    </div>
  );
}
