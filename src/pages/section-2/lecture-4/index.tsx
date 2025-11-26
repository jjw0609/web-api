import { useEffect, useRef } from 'react';
import { TimerComparison } from './TimerComparison';

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

export default function WebWorkerExample() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
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

    // Create Web Worker
    workerRef.current = new Worker(
      new URL('./timeout-worker.ts', import.meta.url),
    );
    const worker = workerRef.current;

    worker.onmessage = (event) => {
      const { index } = event.data;
      // for logging
      const now = performance.now();
      if (lastTime.current !== null) {
        const diff = now - lastTime.current;
        console.log(`Actual delay: ${diff.toFixed(2)} ms`);
      }
      lastTime.current = now;
      if (index < points.length - 1) {
        drawLine(ctx, points[index], points[index + 1]);
        currentIndex.current = index + 1;
        worker.postMessage({ index: currentIndex.current });
      } else {
        // Last line (from last point to first point)
        drawLine(ctx, points[index], points[0]);
        worker.terminate();
      }
    };

    // First request
    worker.postMessage({ index: 0 });

    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ width: '1000px', height: '1000px' }}
      />
      <TimerComparison />
    </>
  );
}
