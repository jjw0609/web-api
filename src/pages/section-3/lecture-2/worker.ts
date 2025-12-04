// Fibonacci calculation function
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

self.onmessage = function (event) {
  console.log('worker.ts');
  const { num } = event.data;
  const result = fibonacci(num);
  // Send the result to the main thread
  self.postMessage({ result });
};
