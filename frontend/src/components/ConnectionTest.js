import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [details, setDetails] = useState([]);
  const [apiStatus, setApiStatus] = useState('Testing...');

  useEffect(() => {
    const log = (msg) => setDetails(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    
    // Test 1: API Connection
    log('Testing API connection...');
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => {
        setApiStatus(`✅ API Connected - ${data.length} tasks found`);
        log(`✅ API responded with ${data.length} tasks`);
      })
      .catch(err => {
        setApiStatus(`❌ API Failed: ${err.message}`);
        log(`❌ API Error: ${err.message}`);
      });

    // Test 2: WebSocket Connection
    log('Attempting WebSocket connection to http://localhost:5000');
    
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      setStatus(`✅ Connected! Socket ID: ${socket.id}`);
      log(`✅ WebSocket connected with ID: ${socket.id}`);
      log(`Transport: ${socket.io.engine.transport.name}`);
    });

    socket.on('disconnect', (reason) => {
      setStatus(`⚠️ Disconnected: ${reason}`);
      log(`⚠️ Disconnected: ${reason}`);
    });

    socket.on('connect_error', (error) => {
      setStatus(`❌ Connection Error: ${error.message}`);
      log(`❌ Connection Error: ${error.message}`);
      log(`Error details: ${error.description || 'No details'}`);
    });

    socket.io.on('reconnect_attempt', (attempt) => {
      log(`🔄 Reconnection attempt ${attempt}...`);
    });

    socket.io.on('reconnect', (attempt) => {
      log(`✅ Reconnected after ${attempt} attempts`);
    });

    socket.io.on('reconnect_failed', () => {
      log(`❌ Reconnection failed after all attempts`);
    });

    return () => {
      log('Disconnecting socket...');
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>WebSocket Connection Test</h2>
      
      <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
        <h3>API Status:</h3>
        <p>{apiStatus}</p>
      </div>

      <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
        <h3>WebSocket Status:</h3>
        <p>{status}</p>
      </div>

      <div style={{ padding: '10px', background: '#fff', border: '1px solid #ccc' }}>
        <h3>Connection Log:</h3>
        {details.map((detail, index) => (
          <div key={index} style={{ margin: '5px 0', fontSize: '12px' }}>
            {detail}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#fff3cd' }}>
        <h4>Expected Configuration:</h4>
        <ul>
          <li>Backend URL: http://localhost:5000</li>
          <li>Backend should show: "Server is running on port 5000"</li>
          <li>Backend should show: "✅ Connected to PostgreSQL database"</li>
        </ul>
      </div>
    </div>
  );
};

export default ConnectionTest;
