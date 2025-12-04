let ws: WebSocket | undefined;
const ports: MessagePort[] = [];

self.onconnect = function (event: MessageEvent) {
  const port = event.ports[0];
  ports.push(port);

  // debug: chrome://inspect/#workers
  console.log('event.ports', event.ports);
  console.log('ports', ports);

  if (!ws) {
    ws = new WebSocket('ws://localhost:8080');

    ws.onopen = function () {
      ports.forEach((p) =>
        p.postMessage('WebSocket connected'),
      );
    };

    ws.onmessage = function (message: MessageEvent) {
      ports.forEach((p) => p.postMessage(message.data));
    };

    ws.onclose = function () {
      ports.forEach((p) =>
        p.postMessage('WebSocket closed'),
      );
    };

    ws.onerror = function () {
      ports.forEach((p) =>
        p.postMessage('WebSocket error'),
      );
    };
  }

  port.onmessage = function (message: MessageEvent) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message.data);
    }
  };
};

interface SharedWorkerGlobalScope extends EventTarget {
  onconnect:
    | ((
        this: SharedWorkerGlobalScope,
        ev: MessageEvent,
      ) => void)
    | null;
}

declare let self: SharedWorkerGlobalScope;
