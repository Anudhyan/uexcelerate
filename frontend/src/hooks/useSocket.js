import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Helper function to determine the WebSocket server URL
// Handles both local development and GitHub Codespaces environments
const getCodespacesPortUrl = (port) => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // Codespaces forwarded ports use a dedicated subdomain pattern
  // Example: https://workspace-name-3000.app.github.dev for port 3000
  const match = hostname.match(/^(.*)-(\d+)\.app\.github\.dev$/);
  if (match) {
    return `${protocol}//${match[1]}-${port}.app.github.dev`;
  }

  // Fallback for local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://localhost:${port}`;
  }

  // Default fallback using current protocol and hostname
  return `${protocol}//${hostname}:${port}`;
};

// Set the Socket.io server URL from environment or default to port 5000 (backend server)
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || getCodespacesPortUrl(5000);

// Custom hook to manage WebSocket connection
// Handles connection lifecycle and connection status
export const useSocket = () => {
  // Store the socket instance and connection status
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  // Setup Socket.io connection on component mount
  useEffect(() => {
    // Create a new Socket.io connection with configuration
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],  // Use websocket first, fallback to polling
      reconnection: true,                      // Automatically reconnect if disconnected
      reconnectionDelay: 1000,                // Initial delay before reconnection attempt
      reconnectionDelayMax: 5000,             // Max delay between reconnection attempts
      reconnectionAttempts: 10,               // Try to reconnect up to 10 times
      timeout: 20000,                          // 20 second connection timeout
    });

    // Handle successful connection
    socketInstance.on('connect', () => {
      setConnected(true);
    });

    // Handle disconnection
    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    // Handle connection errors
    socketInstance.on('connect_error', () => {
      setConnected(false);
    });

    // Store the socket instance for use in components
    setSocket(socketInstance);

    // Cleanup: disconnect socket when component unmounts
    return () => socketInstance.disconnect();
  }, []);

  // Return socket instance and connection status
  return { socket, connected };
};
