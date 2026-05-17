import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from '../context/DispatchContext';

export function useCentralSocket() {
  const socketRef = useRef(null);
  const { addOrUpdateIncident, updateResponderTelemetry } = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('dispatch_token');
    if (!token) return;

    socketRef.current = io('https://medicwatch-core-backend.onrender.com', {
      auth: { token },
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Central Command Console linked to backend socket cluster.');
    });

    // Handle new incoming emergency triggers
    socket.on('event:incident_raised', (incidentData) => {
      addOrUpdateIncident(incidentData);
      // Play system-level notification tone
      const klaxon = new Audio('/audio/alert_klaxon.mp3');
      klaxon.play().catch(() => {});
    });

    // Handle real-time telemetry updates from paramedic field clients
    socket.on('event:responder_telemetry', (telemetryData) => {
      updateResponderTelemetry(telemetryData);
    });

    // Handle updates when status drops or mutates
    socket.on('event:dispatch_sync_update', (mutatedIncident) => {
      addOrUpdateIncident(mutatedIncident);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [addOrUpdateIncident, updateResponderTelemetry]);

  return socketRef.current;
}