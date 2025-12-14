import { useRef, useState, useEffect } from 'react';
import useBroadcastChannel from './useBroadcastChannel';

const CHANNEL_NAME = 'tab-broadcast';

export default function BroadcastExample() {
  const channelRef = useRef<BroadcastChannel | null>(null);

  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  // Create and listen for BroadcastChannel events
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;
    channel.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
    return () => {
      channel.close();
    };
  }, []);

  // Send message to all tabs via BroadcastChannel
  const sendBroadcastMessage = () => {
    channelRef.current?.postMessage(input);
    setMessages((prev) => [...prev, input]);
    setInput('');
  };

  return (
    <>
      <div className="container">
        <h1>BroadcastChannel Example</h1>
        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter message"
            className="input"
          />
          <button
            onClick={sendBroadcastMessage}
            className="button"
          >
            Send Message
          </button>
        </div>
        <div className="messages">
          <b>Messages received in all tabs:</b>
          <ul className="message-list">
            {messages.map((message, i) => (
              <li key={i} className="message-item">
                {message}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <A />
          <B />
        </div>
      </div>
      <style>{`
      .container {
        padding: 24px;
      }
      .input-group {
        margin-bottom: 16px;
      }
      .input {
        width: 220px;
        margin-right: 8px;
      }
      .button {
      }
      .messages {
        margin-bottom: 16px;
        min-height: 80px;
        border: 1px solid #eee;
        padding: 8px;
      }
      .message-list {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .message-item {
        margin-bottom: 4px;
      }
      `}</style>
    </>
  );
}

function A() {
  const {
    sendMessage: sendMessageA,
    subscribe: subscribeA,
  } = useBroadcastChannel(CHANNEL_NAME);

  useEffect(() => {
    subscribeA((msg) => {
      console.log('A received message:', msg);
    });
  }, [subscribeA]);

  return (
    <button onClick={() => sendMessageA('Hello from A')}>
      A
    </button>
  );
}

function B() {
  const {
    sendMessage: sendMessageB,
    subscribe: subscribeB,
  } = useBroadcastChannel(CHANNEL_NAME);

  useEffect(() => {
    subscribeB((msg) => {
      console.log('B received message:', msg);
    });
  }, [subscribeB]);

  return (
    <button onClick={() => sendMessageB('Hello from B')}>
      B
    </button>
  );
}
