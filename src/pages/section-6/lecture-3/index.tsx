import { useState, useEffect, useRef } from 'react';

export default function PerformanceObserverExample() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isObserving, setIsObserving] = useState(false);
  const observerRef = useRef<PerformanceObserver | null>(
    null,
  );

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString('en-US')}: ${message}`,
    ]);
  };

  const clearLogs = () => setLogs([]);

  const startObserving = () => {
    if (!('PerformanceObserver' in window)) {
      addLog('PerformanceObserver not supported');
      return;
    }

    observerRef.current = new PerformanceObserver(
      (list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'largest-contentful-paint': {
              const lcpEntry = entry as PerformanceEntry & {
                element?: Element;
                size?: number;
              };
              addLog(
                `LCP: ${lcpEntry.startTime.toFixed(2)}ms (element: ${lcpEntry.element?.tagName || 'null'})`,
              );
              break;
            }
            case 'longtask':
              addLog(
                `Long Task: ${entry.duration.toFixed(2)}ms (start: ${entry.startTime.toFixed(2)}ms)`,
              );
              break;
          }
        }
      },
    );

    // Observe LCP and Long Task
    try {
      observerRef.current.observe({
        type: 'largest-contentful-paint',
        buffered: true, // buffered: true means already occurred events are also retrieved
      });
      observerRef.current.observe({
        type: 'longtask',
        buffered: true,
      });
      addLog(
        'Observer started - watching LCP and Long Task (buffered: true)',
      );
      setIsObserving(true);
    } catch (e) {
      addLog(`Unsupported type: ${e}`);
    }
  };

  const stopObserving = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
      setIsObserving(false);
      addLog('Observer stopped');
    }
  };

  const simulateLongTask = () => {
    addLog('Starting Long Task simulation...');
    const start = performance.now();
    // Block the main thread for 60ms
    while (performance.now() - start < 60) {
      // busy waiting
    }
    addLog(
      'Long Task simulation completed (60ms blocking)',
    );
  };

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Performance API - Navigation Timing measurement
  // const measureNavigationTiming = () => {
  //   const entries =
  //     performance.getEntriesByType('navigation');
  //   if (entries.length > 0) {
  //     const entry =
  //       entries[0] as PerformanceNavigationTiming;
  //     console.log(entry);
  //     addLog('=== Performance API (Navigation Timing) ===');
  //     addLog(
  //       `DOM Content Loaded: ${(entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart).toFixed(2)}ms`,
  //     );
  //     addLog(
  //       `Load Event: ${(entry.loadEventEnd - entry.loadEventStart).toFixed(2)}ms`,
  //     );
  //     addLog(
  //       `Total Load Time: ${(entry.loadEventEnd - entry.fetchStart).toFixed(2)}ms`,
  //     );
  //   } else {
  //     addLog('No navigation timing data available');
  //   }
  // };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h1>Performance Observer Demo</h1>

      {/* Performance API Test */}
      {/* <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ccc',
        }}
      >
        <h2>Performance API Test</h2>
        <button
          onClick={measureNavigationTiming}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Measure Navigation Timing
        </button>
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            marginTop: '10px',
            marginBottom: 0,
          }}
        >
          Traditional Performance API - DOM load time
          measurement
        </p>
      </section> */}

      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ccc',
        }}
      >
        <h2>Observer Control</h2>
        <div style={{ marginBottom: '10px' }}>
          <button
            onClick={startObserving}
            disabled={isObserving}
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              backgroundColor: isObserving
                ? '#ccc'
                : '#007acc',
              color: 'white',
              border: 'none',
              cursor: isObserving
                ? 'not-allowed'
                : 'pointer',
            }}
          >
            Start Observer
          </button>
          <button
            onClick={stopObserving}
            disabled={!isObserving}
            style={{
              padding: '8px 16px',
              backgroundColor: !isObserving
                ? '#ccc'
                : '#dc3545',
              color: 'white',
              border: 'none',
              cursor: !isObserving
                ? 'not-allowed'
                : 'pointer',
            }}
          >
            Stop Observer
          </button>
        </div>
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            margin: 0,
          }}
        >
          Start Observer to detect LCP with buffered: true
          option
        </p>
      </section>

      {/* Long Task Test */}
      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ccc',
        }}
      >
        <h2>Long Task Test</h2>
        <button
          onClick={simulateLongTask}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff6b35',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Simulate Long Task (60ms)
        </button>
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            marginTop: '10px',
            marginBottom: 0,
          }}
        >
          Tasks over 50ms blocking main thread are detected
          as Long Tasks
        </p>
      </section>

      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ccc',
        }}
      >
        <h2>Real-time Logs</h2>
        <button
          onClick={clearLogs}
          style={{
            marginBottom: '15px',
            padding: '6px 12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Clear Logs
        </button>

        <div
          style={{
            height: '300px',
            overflow: 'auto',
            backgroundColor: '#f8f9fa',
            padding: '15px',
            fontSize: '13px',
            border: '1px solid #dee2e6',
            fontFamily:
              'Consolas, Monaco, "Courier New", monospace',
          }}
        >
          {logs.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: '4px',
                padding: '2px 0',
                borderBottom: '1px solid #e9ecef',
              }}
            >
              {log}
            </div>
          ))}
          {logs.length === 0 && (
            <div
              style={{
                color: '#6c757d',
                fontStyle: 'italic',
              }}
            >
              Performance Observer logs will appear here...
              <br />
              1. Click "Start Observer" button
              <br />
              2. Test with "Simulate Long Task" button
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
