import { useRef, useState, useEffect } from 'react';

export function TimerComparison() {
  const workerRef = useRef<Worker | null>(null);
  const [webWorkerTime, setWebWorkerTime] = useState(0);
  const [normalTime, setNormalTime] = useState(0);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./interval-worker.ts', import.meta.url),
    );
    const worker = workerRef.current;
    worker.onmessage = ({ data: { time } }) => {
      setWebWorkerTime(time);
    };
    return () => {
      worker.terminate();
    };
  }, []);

  const startWebWorkerTimer = () => {
    workerRef.current?.postMessage({});
  };

  const startNormalTimer = () => {
    setInterval(() => {
      setNormalTime((prev) => prev + 1);
    }, 100);
  };

  const handleStart = () => {
    startWebWorkerTimer();
    startNormalTimer();
  };

  return (
    <div className="container">
      <div className="button-wrapper">
        <button
          onClick={handleStart}
          className="start-button"
        >
          Start Timer
        </button>
      </div>
      <div className="timers-container">
        <div className="timer-card timer-card-blue">
          <div className="timer-value">
            {(webWorkerTime / 10).toFixed(1)}s
          </div>
          <div className="timer-label timer-label-blue">
            Web Worker Timer
          </div>
        </div>
        <div className="timer-card timer-card-orange">
          <div className="timer-value">
            {(normalTime / 10).toFixed(1)}s
          </div>
          <div className="timer-label timer-label-orange">
            Normal Timer
          </div>
        </div>
      </div>
      <style>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 60px;
          margin-bottom: 260px;
          gap: 32px;
        }
        
        .button-wrapper {
          display: flex;
          gap: 16px;
        }
        
        .start-button {
          background-color: #4f8cff;
          color: white;
          border: none;
          border-radius: 24px;
          padding: 12px 32px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(79,140,255,0.15);
          transition: background 0.2s;
        }
        
        .timers-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          width: 100%;
          max-width: 400px;
        }
        
        .timer-card {
          width: 100%;
          border-radius: 20px;
          padding: 32px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .timer-card-blue {
          background-color: #4f8cff;
          box-shadow: 0 4px 24px rgba(79,140,255,0.10);
        }
        
        .timer-card-orange {
          background-color: #ffb347;
          box-shadow: 0 4px 24px rgba(255,183,71,0.10);
        }
        
        .timer-value {
          font-size: 48px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }
        
        .timer-label {
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 1px;
        }
        
        .timer-label-blue {
          color: #e3eefe;
        }
        
        .timer-label-orange {
          color: #fff5e3;
        }
      `}</style>
    </div>
  );
}
