import { useCallback, useEffect, useRef } from 'react';

const DISTANCE = 200;
const ROTATE = 1.3; // turn
const DURATION = 2000;

export default function EmojiAnimation() {
  const emojiRef = useRef<HTMLDivElement>(null);
  const animState = useRef<'idle' | 'move' | 'fade'>(
    'idle',
  );
  const easingRef = useRef<'ease-in-out' | 'linear'>(
    'ease-in-out',
  );

  const startMove = () => {
    const node = emojiRef.current;
    if (!node) return;
    animState.current = 'move';
    node.style.animation = `move ${DURATION}ms ${easingRef.current} 1 normal forwards`;
    node.style.animationPlayState = 'running';
  };

  const startFade = useCallback(() => {
    const node = emojiRef.current;
    if (!node) return;
    animState.current = 'fade';
    node.style.animation = `fade ${DURATION}ms ${easingRef.current} 1 normal forwards`;
    node.style.animationPlayState = 'running';
    // node.style.animationDelay = '2000ms'; // Can only add delay when an animation starts
  }, []);

  const handleAnimationEnd = useCallback(() => {
    const node = emojiRef.current;
    if (
      animState.current === 'move' &&
      node?.style.animationDirection === 'normal'
    ) {
      startFade();
    }
  }, [startFade]);

  const handleStop = () => {
    const node = emojiRef.current;
    if (!node) return;
    node.style.animationPlayState = 'paused';
  };

  const handleResume = () => {
    const node = emojiRef.current;
    if (!node) return;
    node.style.animationPlayState = 'running';
  };

  const handleEasingChange = () => {
    const node = emojiRef.current;
    if (!node) return;
    easingRef.current = 'linear';
    node.style.animationTimingFunction = 'linear';
  };

  const handleReverse = () => {
    const node = emojiRef.current;
    if (!node) return;
    // Toggle animationDirection
    node.style.animationDirection =
      node.style.animationDirection === 'reverse'
        ? 'normal'
        : 'reverse';
  };

  const handleStart = () => {
    const node = emojiRef.current;
    if (!node) return;
    // Reset animation
    node.style.animation = '';
    node.style.transform = '';
    node.style.opacity = '';
    easingRef.current = 'ease-in-out';
    node.style.animationTimingFunction = 'ease-in-out';
    startMove();
  };

  useEffect(() => {
    const node = emojiRef.current;
    if (!node) return;
    node.addEventListener(
      'animationend',
      handleAnimationEnd,
    );
    return () => {
      node.removeEventListener(
        'animationend',
        handleAnimationEnd,
      );
    };
  }, [handleAnimationEnd]);

  return (
    <>
      <div className="container">
        <div ref={emojiRef} className="emoji">
          🤣
        </div>
        <div className="button-container">
          <button onClick={handleStart}>start</button>
          <button onClick={handleEasingChange}>
            easing(linear)
          </button>
          <button onClick={handleStop}>stop</button>
          <button onClick={handleResume}>resume</button>
          <button onClick={handleReverse}>reverse</button>
        </div>
      </div>
      <style>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #fff;
        }
        .emoji {
          font-size: 64px;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        .button-container {
          margin-top: 32px;
          display: flex;
          gap: 10px;
        }

        @keyframes move {
          from {
            transform: translateX(0px) rotate(0turn);
          }
          to {
            transform: translateX(${DISTANCE}px) rotate(${ROTATE}turn);
          }
        }
          
        @keyframes fade {
          from {
            opacity: 1;
            transform: translateX(${DISTANCE}px) rotate(${ROTATE}turn);
          }
          to {
            opacity: 0.1;
            transform: translateX(${DISTANCE}px) rotate(${ROTATE}turn);
          }
        }
      `}</style>
    </>
  );
}
