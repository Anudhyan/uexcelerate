import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const getCodespacesPortUrl = (port) => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // Codespaces forwarded ports use a dedicated subdomain:
  //   https://<codespaceName>-3000.app.github.dev  (frontend)
  //   https://<codespaceName>-5000.app.github.dev  (backend)
  const match = hostname.match(/^(.*)-(\d+)\.app\.github\.dev$/);
  if (match) {
    return `${protocol}//${match[1]}-${port}.app.github.dev`;
  }

  // Fallback for local/non-Codespaces
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://localhost:${port}`;
  }
  return `${protocol}//${hostname}:${port}`;
};

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || getCodespacesPortUrl(5000);

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 20000,
    });

    socketInstance.on('connect', () => {
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    socketInstance.on('connect_error', () => {
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, []);

  return { socket, connected };
};
