import { useState, useEffect, useRef } from 'react';

export function useKeyboardControls() {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    jump: false,
    interact: false,
    escape: false,
    analogVector: { x: 0, y: 0 }
  });

  // Touch virtual inputs
  const touchInputsRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    jump: false,
    interact: false,
    analogVector: { x: 0, y: 0 }
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture keys if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement((m) => ({ ...m, forward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement((m) => ({ ...m, backward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement((m) => ({ ...m, left: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement((m) => ({ ...m, right: true }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setMovement((m) => ({ ...m, sprint: true }));
          break;
        case 'Space':
          e.preventDefault();
          setMovement((m) => ({ ...m, jump: true }));
          break;
        case 'KeyE':
          setMovement((m) => ({ ...m, interact: true }));
          break;
        case 'Escape':
          setMovement((m) => ({ ...m, escape: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement((m) => ({ ...m, forward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement((m) => ({ ...m, backward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement((m) => ({ ...m, left: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement((m) => ({ ...m, right: false }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setMovement((m) => ({ ...m, sprint: false }));
          break;
        case 'Space':
          setMovement((m) => ({ ...m, jump: false }));
          break;
        case 'KeyE':
          setMovement((m) => ({ ...m, interact: false }));
          break;
        case 'Escape':
          setMovement((m) => ({ ...m, escape: false }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const setVirtualInput = (key, val) => {
    touchInputsRef.current[key] = val;
    setMovement((m) => ({ ...m, [key]: val }));
  };

  return { movement, setVirtualInput };
}
