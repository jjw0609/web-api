import { useEffect, useRef, useState } from 'react';
// import './shadow-child'; // When importing custom element within the workspace

export default function ShadowDomCustomEventExample() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [receivedMsg, setReceivedMsg] = useState('');

  useEffect(() => {
    // Load the custom element script once (Use script tag especially when loading custom element from external source(Vue, Svelte, etc.))
    const scriptId = 'shadow-child-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '/shadow-child.js';
      document.body.appendChild(script);
    }

    // Listen for shadow dom's message
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent;
      setReceivedMsg(customEvent.detail);
    };

    const host = hostRef.current;
    if (host) {
      host.addEventListener(
        'messageFromChild',
        handler as EventListener,
      );
    }
    return () => {
      if (host) {
        host.removeEventListener(
          'messageFromChild',
          handler as EventListener,
        );
      }
    };
  }, []);

  // Parent sends message to child
  const sendMessageToChild = () => {
    const child =
      hostRef.current?.querySelector('shadow-child');
    if (child && child.shadowRoot) {
      console.log(child.shadowRoot);
      const messageEvent = new CustomEvent(
        'messageFromParent',
        {
          detail: 'Hello from parent!',
        },
      );
      child.shadowRoot.dispatchEvent(messageEvent);
    }
  };

  return (
    <>
      <div className="container">
        <h1>CustomEvent & Shadow DOM Communication</h1>
        <button
          onClick={sendMessageToChild}
          className="send-button"
        >
          Send message to child (Shadow DOM)
        </button>
        <div>
          <b>Message received from child:</b> {receivedMsg}
        </div>
        <div
          ref={hostRef}
          id="shadowHost"
          className="shadow-host"
        >
          <shadow-child />
        </div>
      </div>
      <style>{`
      .container {
        padding: 24px;
      }
      .send-button {
        margin-bottom: 12px;
      }
      .shadow-host {
        margin-top: 24px;
        border: 1px solid #aaa;
        padding: 16px;
        width: 320px;
      }
      `}</style>
    </>
  );
}
