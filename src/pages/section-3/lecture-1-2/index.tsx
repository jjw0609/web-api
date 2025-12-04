import { useEffect, useRef, useState } from 'react';

const WS_URL = 'ws://localhost:8080';

export default function WebSocketDemo() {
  const [status, setStatus] = useState(
    'Connecting to server...',
  );
  const [received, setReceived] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => setStatus('Connected to server!');
      ws.onmessage = (event) =>
        setReceived((prev) => [...prev, event.data]);
      ws.onclose = () => setStatus('Connection closed.');
      ws.onerror = () =>
        setStatus('Failed to connect to server.');
    } catch {
      setStatus('WebSocket creation failed!');
    }

    return () => {
      ws?.close();
    };
  }, []);

  const sendMessage = () => {
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      input
    ) {
      wsRef.current.send(input);
      setInput('');
    }
  };

  return (
    <div>
      <h1>WebSocket Session Demo</h1>
      <p>Status: {status}</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        onKeyDown={(e) => {
          if (e.key === 'Enter') sendMessage();
        }}
      />
      <button
        onClick={sendMessage}
        style={{ marginLeft: 8 }}
      >
        Send
      </button>
      <div style={{ marginTop: 24 }}>
        <strong>Received messages:</strong>
        <ul>
          {received.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
