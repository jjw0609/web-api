import { useState } from 'react';

const FIB_NUM = 45;

export default function FibonacciCalculator() {
  const [status, setStatus] = useState(
    'Before calculation...',
  );
  const [result, setResult] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const startCalculation = () => {
    setIsCalculating(true);
    setStatus('Calculating... (UI is responsive)');
    setResult(null);

    // initialize Web Worker
    const worker = new Worker(
      new URL('./worker.ts', import.meta.url),
    );

    worker.onmessage = function (event) {
      const { result } = event.data;
      setResult(`Result: ${result}`);
      setStatus(
        `Calculation complete! Fibonacci: ${result}`,
      );
      setIsCalculating(false);
      worker.terminate();
    };

    worker.postMessage({ num: FIB_NUM });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>
        Fibonacci Number Calculation (Web Worker Example)
      </h1>
      <button
        onClick={startCalculation}
        disabled={isCalculating}
        style={{ padding: '8px 16px', fontSize: 16 }}
      >
        Start Fibonacci Calculation
      </button>
      <p id="status">{status}</p>
      <p id="result">{result}</p>
      <input type="text" />
    </div>
  );
}
