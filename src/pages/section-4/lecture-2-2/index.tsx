import { useRef, useState } from 'react';

const CHILD_ORIGIN = window.location.origin;
const CHILD_URL = '/child-4-2-2.html';

export default function IframeMessageExample() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [parentChannelMsg, setParentChannelMsg] =
    useState('');
  const channelRef = useRef<MessageChannel | null>(null);

  // Send message to child via MessageChannel
  const createMessageChannel = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const channel = new MessageChannel();
      channelRef.current = channel;
      // onmessage handler
      channel.port1.onmessage = (e) => {
        setParentChannelMsg(e.data);
      };
      // transfer port2 to child
      iframe.contentWindow.postMessage(
        'MessageChannel port transfer',
        CHILD_ORIGIN,
        [channel.port2],
      );
    }
  };

  const sendMessageChannel = () => {
    channelRef.current?.port1.postMessage(
      'From parent(port1): MessageChannel hello!',
    );
  };

  return (
    <>
      <div className="container">
        <h1>iframe (different window) - MessageChannel</h1>
        <div className="button-group">
          <button
            onClick={createMessageChannel}
            className="button"
          >
            Create MessageChannel
          </button>
          <button
            onClick={sendMessageChannel}
            className="button"
          >
            Send message to child
          </button>
        </div>
        <div className="parent-channel-msg">
          <strong>
            Message received by parent (MessageChannel):
          </strong>{' '}
          {parentChannelMsg}
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
        margin-right: 8px;
      }
      .parent-channel-msg {
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
