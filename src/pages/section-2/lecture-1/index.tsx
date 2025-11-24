import { useEffect, useRef } from 'react';

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

export default function SetIntervalExample() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentIndex = useRef(0);

  const lastTime = useRef<number | null>(null);

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

    lastTime.current = performance.now();

    // Draw lines every second
    const timer = setInterval(() => {
      const now = performance.now();
      if (lastTime.current !== null) {
        const diff = now - lastTime.current;
        console.log(`Actual delay: ${diff.toFixed(2)} ms`);
      }
      lastTime.current = now;

      if (currentIndex.current >= points.length - 1) {
        drawLine(
          ctx,
          points[currentIndex.current],
          points[0],
        );
        clearInterval(timer);
        return;
      }

      drawLine(
        ctx,
        points[currentIndex.current],
        points[currentIndex.current + 1],
      );
      currentIndex.current += 1;
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '1000px', height: '1000px' }}
    />
  );
}
