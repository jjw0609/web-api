import { useRef } from 'react';

const INIT_VELOCITY = 0; // Initial speed
const ACCELERATION = 0.000001; // Acceleration
const MAX_VELOCITY = 0.01; // Maximum speed
const DURATION = 4000; // Total animation time
const RADIUS = 40; // Emoji radius
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function EmojiAnimation() {
  const emojiRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef(0); // Accumulated rotation
  const velocityRef = useRef(INIT_VELOCITY); // Rotation speed
  const prevTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const modeRef = useRef<'ease' | 'linear'>('ease');
  const elapsedRef = useRef(0);

  // Animation frame
  const animate = (timestamp: number) => {
    if (prevTimeRef.current === null)
      prevTimeRef.current = timestamp;
    const deltaTime = timestamp - prevTimeRef.current;
    // deltaTime = Math.min(deltaTime, 100); // Limit maximum deltaTime to 100ms
    prevTimeRef.current = timestamp;
    elapsedRef.current += deltaTime;

    if (modeRef.current === 'ease') {
      // Acceleration: speed increases at the beginning, decreases in the middle
      const t = elapsedRef.current / DURATION;
      const acc = t < 0.5 ? ACCELERATION : -ACCELERATION;
      velocityRef.current += acc * deltaTime;
      velocityRef.current = Math.min(
        velocityRef.current,
        MAX_VELOCITY,
      );
      velocityRef.current = Math.max(
        velocityRef.current,
        0,
      );
    }
    // In linear mode, velocityRef.current is maintained as is

    // Accumulated rotation
    rotateRef.current += velocityRef.current * deltaTime;
    // Accumulated movement: rotation × circumference
    const translate = rotateRef.current * CIRCUMFERENCE;

    // Apply style
    if (emojiRef.current) {
      emojiRef.current.style.transform = `translateX(${translate}px) rotate(${rotateRef.current}turn)`;
    }

    rafIdRef.current = requestAnimationFrame(animate);
  };

  const handleStart = () => {
    if (rafIdRef.current)
      cancelAnimationFrame(rafIdRef.current);
    // reset all the values
    prevTimeRef.current = null;
    rotateRef.current = 0;
    velocityRef.current = INIT_VELOCITY;
    modeRef.current = 'ease';
    elapsedRef.current = 0;
    if (emojiRef.current) {
      emojiRef.current.style.transform =
        'translateX(0) rotate(0)';
    }
    rafIdRef.current = requestAnimationFrame(animate);
  };

  const handleLinear = () => {
    modeRef.current = 'linear';
  };

  const handleCancel = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
  };

  return (
    <>
      <div className="container">
        <div ref={emojiRef} className="emoji">
          🤣
        </div>
        <div className="button-container">
          <button onClick={handleStart}>start</button>
          <button onClick={handleLinear}>linear</button>
          <button onClick={handleCancel}>cancel</button>
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
          margin-left: -1000px;
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
      `}</style>
    </>
  );
}
