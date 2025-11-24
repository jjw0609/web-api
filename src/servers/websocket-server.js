import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 }); // Server runs on port 8080

wss.on('connection', (ws) => {
  console.log('New tab connected');
  console.log(`Current connected clients: ${wss.clients.size}`);

  // When a message is received from a client, broadcast it to all clients
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`From server: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    console.log(`Current connected clients: ${wss.clients.size}`);
  });

  // Send a welcome message to the connected client
  ws.send('Connected to server!');
});
