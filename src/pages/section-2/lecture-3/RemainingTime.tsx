import { useCallback, useEffect, useRef } from 'react';

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

export default function RemainingTime() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentIndex = useRef(0);

  const intervalId = useRef<number | null>(null);
  const timeoutId = useRef<number | null>(null);

  const lastVisibleTime = useRef<number>(Date.now());
  const remainingTime = useRef<number>(1000);

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
      if (currentIndex.current < points.length - 1) {
        // Draw line
        drawLine(
          ctx,
          points[currentIndex.current],
          points[currentIndex.current + 1],
        );
        currentIndex.current++;
        remainingTime.current = 1000;
        lastVisibleTime.current = Date.now();
      } else {
        // Last line (from last point to first point)
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
        // Inactive: stop interval/timeout and calculate remaining time
        if (intervalId.current) {
          clearInterval(intervalId.current);
          intervalId.current = null;
        }
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
          timeoutId.current = null;
        }
        // NOTE: calculate exact remaining time
        const elapsed =
          Date.now() - lastVisibleTime.current;
        remainingTime.current = Math.max(
          remainingTime.current - elapsed,
          0,
        );
        console.log(
          `Tab hidden: Timer paused, remaining time: ${remainingTime.current}ms`,
        );
      } else {
        // Active: restart setInterval after remaining time
        lastVisibleTime.current = Date.now();
        if (currentIndex.current < points.length && ctx) {
          console.log(
            `Tab visible: Timer resumed, remaining time: ${remainingTime.current}ms`,
          );
          timeoutId.current = setTimeout(() => {
            drawNextLine(ctx);
            intervalId.current = setInterval(
              () => drawNextLine(ctx),
              1000,
            );
          }, remainingTime.current);
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
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    };
  }, [drawNextLine]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '1000px', height: '1000px' }}
    />
  );
}
