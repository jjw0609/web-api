import React, { useState } from 'react';

const FIB_NUM = 45;

// Recursive Fibonacci calculation: O(2^n)
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const FibonacciCalculator: React.FC = () => {
  const [status, setStatus] = useState(
    'Before calculation...',
  );
  const [result, setResult] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const startCalculation = () => {
    setIsCalculating(true);
    setStatus('Calculating... (UI will freeze!)');
    setResult(null);

    setTimeout(() => {
      const fib = fibonacci(FIB_NUM);
      setResult(`Result: ${fib}`);
      setStatus(`Calculation complete! Fibonacci: ${fib}`);
      setIsCalculating(false);
    }, 0);
  };

  return (
    <div>
      <h1>
        Fibonacci Number Calculation (Blocking Example)
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
};

export default FibonacciCalculator;
