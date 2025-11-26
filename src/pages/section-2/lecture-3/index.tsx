import { useCallback, useEffect, useRef } from 'react';
import RemainingTime from './RemainingTime';

const points = [
  { x: 100, y: 100, label: 'A' },
  { x: 300, y: 100, label: 'B' },
  { x: 500, y: 100, label: 'C' },
  { x: 700, y: 100, label: 'D' },
  { x: 900, y: 100, label: 'E' },
  { x: 900, y: 300, label: 'F' },
  { x: 700, y: 300, label: 'G' },
  { x: 500, y: 300, label: 'H' },
  { x: 300, y: 300, label: 'I' },
  { x: 100, y: 300, label: 'J' },
];

export default function PageVisibilityExample() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentIndex = useRef(0);
  const lastTime = useRef<number | null>(null);

  const intervalId = useRef<number | null>(null);

  const drawPoint = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
  ) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawLabel = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    label: string,
  ) => {
    ctx.font = '32px Arial';
    ctx.fillText(label, x - 10, y + 50);
  };

  const drawLine = (
    ctx: CanvasRenderingContext2D,
    start: { x: number; y: number; label: string },
    end: { x: number; y: number; label: string },
  ) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  };

  const drawNextLine = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // for logging
      const now = Date.now();
      if (lastTime.current !== null) {
        const diff = now - lastTime.current;
        console.log(`Actual delay: ${diff} ms`);
      }
      lastTime.current = now;

      if (currentIndex.current < points.length - 1) {
        drawLine(
          ctx,
          points[currentIndex.current],
          points[currentIndex.current + 1],
        );
        currentIndex.current++;
      } else {
        drawLine(
          ctx,
          points[currentIndex.current],
          points[0],
        );
        if (intervalId.current) {
          clearInterval(intervalId.current);
          intervalId.current = null;
        }
      }
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adjust canvas size
    const scaleFactor = window.devicePixelRatio || 1;
    canvas.width = 1000 * scaleFactor;
    canvas.height = 1000 * scaleFactor;
    ctx.scale(scaleFactor, scaleFactor);

    // Draw points and labels
    points.forEach((point) => {
      drawPoint(ctx, point.x, point.y);
      drawLabel(ctx, point.x, point.y, point.label);
    });

    // Start drawing lines
    intervalId.current = setInterval(
      () => drawNextLine(ctx),
      1000,
    );

    // visibilitychange event handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Inactive: stop interval
        if (intervalId.current) {
          clearInterval(intervalId.current);
          intervalId.current = null;
          lastTime.current = null; // for logging
        }
        console.log('Tab hidden: Timer stopped');
      } else {
        // Active: restart setInterval
        if (currentIndex.current < points.length && ctx) {
          if (!intervalId.current) {
            intervalId.current = setInterval(
              () => drawNextLine(ctx),
              1000,
            );
            lastTime.current = Date.now(); // for logging
            console.log('Tab visible: Timer restarted');
          }
        }
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    };
  }, [drawNextLine]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '1000px', height: '1000px' }}
      />
      <RemainingTime />
    </div>
  );
}
