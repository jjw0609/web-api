import { useRef, useState } from 'react';

export default function MutationObserverExample() {
  const observerRef = useRef<MutationObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const [isObserving, setIsObserving] = useState(false);
  const [childCount, setChildCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const handleMutations: MutationCallback = (mutations) => {
    const newLogs = mutations.map((mutation) => {
      switch (mutation.type) {
        case 'attributes':
          return formatAttributeMutation(mutation);
        case 'characterData':
          return formatCharacterDataMutation(mutation);
        case 'childList':
          return formatChildListMutation(mutation);
        default:
          return `[${mutation.type}]`;
      }
    });

    setLogs((prev) => [...newLogs, ...prev]);
  };

  const startObserving = () => {
    if (observerRef.current)
      observerRef.current.disconnect();

    const options: MutationObserverInit = {
      attributes: true, // Detect attribute changes
      attributeOldValue: true, // Record old value on attribute changes
      // attributeFilter: ['class'], // Only observe specified attributes
      characterData: true, // Detect text node changes
      characterDataOldValue: true, // Record old value on text changes
      childList: true, // Detect child node additions/removals
      subtree: true, // Detect changes in all descendant nodes
    };

    observerRef.current = new MutationObserver(
      handleMutations,
    );

    if (targetRef.current) {
      observerRef.current.observe(
        targetRef.current,
        options,
      );
      setIsObserving(true);
      setLogs((prev) => [
        `[Observer started] Options: ${JSON.stringify(options)}`,
        ...prev,
      ]);
    }
  };

  const stopObserving = () => {
    observerRef.current?.disconnect();
    setIsObserving(false);
    setLogs((prev) => ['[Observer stopped]', ...prev]);
  };

  const changeId = () => {
    const value = `id-${Math.random().toString(36).slice(2, 10)}`;
    targetRef.current?.setAttribute('id', value);
  };

  const changeClass = () => {
    const value = `class-${Math.random().toString(36).slice(2, 10)}`;
    targetRef.current?.setAttribute('class', value);
  };

  const setColorRed = () => {
    if (targetRef.current) {
      targetRef.current.style.color = 'red';
    }
  };

  const removeColor = () => {
    if (targetRef.current) {
      targetRef.current.style.removeProperty('color');
    }
  };

  const addChild = () => {
    if (targetRef.current) {
      const el = document.createElement('span');
      el.textContent = `Child ${childCount + 1}`;
      el.style.marginLeft = '8px';
      targetRef.current.appendChild(el);
      setChildCount((count) => count + 1);
    }
  };

  const removeChild = () => {
    if (targetRef.current && targetRef.current.lastChild) {
      targetRef.current.removeChild(
        targetRef.current.lastChild,
      );
      setChildCount((count) => (count > 0 ? count - 1 : 0));
    }
  };

  const insertChildInMiddle = () => {
    if (
      targetRef.current &&
      targetRef.current.children.length > 0
    ) {
      const el = document.createElement('span');
      el.textContent = `Middle-Insert-${childCount + 1}`;
      el.style.marginLeft = '8px';
      targetRef.current.insertBefore(
        el,
        targetRef.current.children[1],
      );
      setChildCount((count) => count + 1);
    }
  };

  const addNodeToFirstChild = () => {
    if (targetRef.current && targetRef.current.firstChild) {
      const span = targetRef.current
        .firstChild as HTMLElement;
      span.appendChild(
        document.createTextNode('(SubText)'),
      );
    }
  };

  const changeFirstChildText = () => {
    if (targetRef.current && targetRef.current.firstChild) {
      const span = targetRef.current
        .firstChild as HTMLElement;
      if (
        span.firstChild &&
        span.firstChild.nodeType === Node.TEXT_NODE
      ) {
        span.firstChild.textContent = `(Changed Text - ${Math.random().toString(36).slice(2, 10)})`;
      }
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        maxWidth: 900,
        padding: '0 32px',
        boxSizing: 'border-box',
      }}
    >
      <h1>MutationObserver Example</h1>
      <div>
        <div
          ref={targetRef}
          style={{
            height: 100,
            marginBottom: 8,
            padding: 16,
            boxSizing: 'border-box',
            border: '2px solid #888',
          }}
        ></div>
        <button onClick={changeId}>Change ID</button>
        <button onClick={changeClass}>Change Class</button>
        <button onClick={setColorRed}>Change Style</button>
        <button onClick={removeColor}>Remove Style</button>
        <br />
        <button onClick={addChild}>Add Child</button>
        <button onClick={removeChild}>Remove Child</button>
        <button onClick={insertChildInMiddle}>
          Insert Child in Middle
        </button>
        <button onClick={addNodeToFirstChild}>
          Add Text to First Child
        </button>
        <button onClick={changeFirstChildText}>
          Change First Child Text
        </button>
        <br />
        <br />
        <button
          onClick={startObserving}
          disabled={isObserving}
        >
          Start Observing
        </button>
        <button
          onClick={stopObserving}
          disabled={!isObserving}
        >
          Stop Observing
        </button>
      </div>
      <div
        style={{
          background: '#222',
          color: '#eee',
          padding: 16,
          borderRadius: 8,
          height: 200,
          overflowY: 'auto',
          fontFamily: 'monospace',
          margin: '24px 0',
        }}
      >
        {logs.length === 0 ? (
          <div>No logs</div>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>
    </div>
  );
}

/* Logging functions */
function formatAttributeMutation(
  mutation: MutationRecord,
): string {
  let message = `[attributes] Attribute: ${mutation.attributeName}`;
  if (mutation.oldValue !== null) {
    message += ` (Old value: ${mutation.oldValue})`;
  }
  if (
    mutation.attributeName === 'id' ||
    mutation.attributeName === 'class'
  ) {
    const currentValue = (
      mutation.target as HTMLElement
    ).getAttribute(mutation.attributeName!);
    message += ` (Current value: ${currentValue})`;
  }
  return message;
}

function formatCharacterDataMutation(
  mutation: MutationRecord,
): string {
  return (
    `[characterData] Text changed` +
    (mutation.oldValue !== null
      ? ` (Old value: ${mutation.oldValue})`
      : '')
  );
}

function formatChildListMutation(
  mutation: MutationRecord,
): string {
  const added = Array.from(mutation.addedNodes).map(
    (node) => node.textContent || '',
  );
  const removed = Array.from(mutation.removedNodes).map(
    (node) => node.textContent || '',
  );
  let message = '[childList] ';
  if (added.length === 0 && removed.length === 0) {
    message += 'No changes in child nodes';
  } else {
    if (added.length > 0) {
      message += `Added nodes: ${added.join(', ')}. `;
    }
    if (removed.length > 0) {
      message += `Removed nodes: ${removed.join(', ')}. `;
    }
  }
  if (mutation.previousSibling || mutation.nextSibling) {
    message += '(';
    if (mutation.previousSibling) {
      message += `Previous sibling: ${mutation.previousSibling.textContent || ''}`;
    }
    if (mutation.previousSibling && mutation.nextSibling) {
      message += ', ';
    }
    if (mutation.nextSibling) {
      message += `Next sibling: ${mutation.nextSibling.textContent || ''}`;
    }
    message += ')';
  }
  return message.trim();
}
