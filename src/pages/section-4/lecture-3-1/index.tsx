import { useRef, useState, useEffect } from 'react';

const CHANNEL_NAME = 'lecture-3-broadcast';
const CHILD_URL = '/child-4-3-1.html';

export default function IframeBroadcastExample() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const [childMsg, setChildMsg] = useState('');

  // Create and listen for BroadcastChannel events
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;
    channel.onmessage = (event) => {
      if (event.data && event.data.from === 'child') {
        setChildMsg(event.data.message);
      }
    };
    return () => {
      channel.close();
    };
  }, []);

  // Send message to child via BroadcastChannel
  const sendBroadcastMessage = () => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        from: 'parent',
        message: 'From parent: BroadcastChannel hello!',
      });
    }
  };

  return (
    <>
      <div className="container">
        <h1>
          iframe (different window) - BroadcastChannel
        </h1>
        <div className="button-group">
          <button
            onClick={sendBroadcastMessage}
            className="button"
          >
            Send message to child via BroadcastChannel
          </button>
        </div>
        <div className="child-msg">
          <strong>Message sent by child:</strong> {childMsg}
        </div>
        <iframe
          ref={iframeRef}
          title="iframe-child"
          src={CHILD_URL}
          width={420}
          height={260}
          className="iframe"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <style>{`
      .container {
        padding: 24px;
      }
      .button-group {
        margin-bottom: 16px;
      }
      .button {
      }
      .child-msg {
        margin-bottom: 16px;
      }
      .iframe {
        border: 1px solid #aaa;
        background: #fff;
      }
      `}</style>
    </>
  );
}
