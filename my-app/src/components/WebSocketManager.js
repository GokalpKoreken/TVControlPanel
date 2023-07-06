// WebSocketManager.js

import { useEffect, useRef } from 'react';

const WebSocketManager = () => {
  const ws = useRef(null);

  useEffect(() => {
    // Create the WebSocket connection
    ws.current = new WebSocket('ws://localhost:4000');

    // Add event listeners for message and close events
    ws.current.onmessage = event => {
      const receivedData = event.data;

      // Process the received data
      // You can update the application state or trigger actions based on the received data
    };

    ws.current.onclose = () => {
      // Handle WebSocket close event
      // You can update the application state or trigger actions based on the close event
    };

    // Clean up the WebSocket connection on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendData = data => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    }
  };

  return null;
};

export default WebSocketManager;
