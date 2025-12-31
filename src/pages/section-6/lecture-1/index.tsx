import { useRef, useState } from 'react';

export default function RequestIdleCallbackExample() {
  const [count, setCount] = useState(0);
  const idleIdRef = useRef<number | null>(null);
  const intervalIdRef = useRef<number | null>(null);

  const tick = (deadline: IdleDeadline) => {
    console.log(
      'deadline',
      deadline.timeRemaining(), // milliseconds remaining in the current idle period
      deadline.didTimeout, // the callback is being executed because of the timeout
    );

    setCount((c) => c + 1); // task

    idleIdRef.current = requestIdleCallback(tick, {
      timeout: 1000,
    });
  };

  const handleStart = () => {
    if (idleIdRef.current === null) {
      idleIdRef.current = requestIdleCallback(tick);
    }
  };

  const handleStop = () => {
    if (idleIdRef.current !== null) {
      cancelIdleCallback(idleIdRef.current);
      idleIdRef.current = null;
    }
  };

  const runBusyWaiting = () => {
    const start = performance.now();
    while (performance.now() - start < 2000) {
      // busy waiting
    }
  };

  const handleStartIntervalWork = () => {
    if (intervalIdRef.current === null) {
      intervalIdRef.current = setInterval(() => {
        // heavy work
        let sum = 0;
        for (let i = 0; i < 1e8; i++) {
          sum += i;
        }
        console.log('interval sum:', sum);
      }, 5);
    }
  };

  const handleStopIntervalWork = () => {
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <h1>requestIdleCallback</h1>
      <p>idle count: {count}</p>
      <button onClick={handleStart}>
        Start IdleCallback
      </button>
      <button onClick={handleStop}>
        Stop IdleCallback
      </button>
      <button onClick={runBusyWaiting}>
        Occupy Main Thread (2000ms)
      </button>
      <button onClick={handleStartIntervalWork}>
        Start Interval Work
      </button>
      <button onClick={handleStopIntervalWork}>
        Stop Interval Work
      </button>
    </div>
  );
}
