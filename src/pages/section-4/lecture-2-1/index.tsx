import { useRef, useState, useEffect } from 'react';

const CHILD_URL = '/child-4-2-1.html';

export default function IframeMessageExample() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [parentMsg, setParentMsg] = useState('');
  const [childMsg, setChildMsg] = useState('');

  // Listen for postMessage events
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (typeof event.data === 'string') {
        if (
          event.data.includes(
            '[child] postMessage (event.source)',
          )
        ) {
          setChildMsg(event.data);
        } else if (
          event.data.includes(
            '[child] postMessage (window.parent)',
          )
        ) {
          setParentMsg(event.data);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, []);

  // Send message to child via postMessage
  const sendPostMessage = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        'From parent: postMessage hello!',
        '*', // For security, always specify
      );
    }
  };

  return (
    <>
      <div className="container">
        <h1>iframe (different window) - postMessage</h1>
        <div className="button-group">
          <button
            onClick={sendPostMessage}
            className="send-button"
          >
            Send message to child via postMessage
          </button>
        </div>
        <div className="parent-msg">
          <strong>
            Message received by parent (postMessage):
          </strong>{' '}
          {parentMsg}
        </div>
        <div className="child-msg">
          <strong>
            Message received by child (postMessage):
          </strong>{' '}
          {childMsg}
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
      .send-button {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      .parent-msg {
        margin-bottom: 16px;
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
