import React, { createContext, useContext, useState, useCallback } from 'react';

const DispatchContext = createContext(null);

export function DispatchProvider({ children }) {
  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState({});
  const [selectedIncident, setSelectedIncident] = useState(null);

  const addOrUpdateIncident = useCallback((incident) => {
    setIncidents((prev) => {
      const exists = prev.find((i) => i._id === incident._id);
      if (exists) {
        return prev.map((i) => (i._id === incident._id ? incident : i));
      }
      return [incident, ...prev];
    });

    setSelectedIncident((prev) => {
      if (prev && prev._id === incident._id) return incident;
      return prev;
    });
  }, []);

  const updateResponderTelemetry = useCallback((telemetry) => {
    // telemetry shape: { responderId, latitude, longitude, activeIncidentId }
    setResponders((prev) => ({
      ...prev,
      [telemetry.responderId]: {
        id: telemetry.responderId,
        coords: [telemetry.latitude, telemetry.longitude],
        lastUpdate: Date.now(),
        activeIncidentId: telemetry.activeIncidentId,
      },
    }));
  }, []);

  return (
    <DispatchContext.Provider value={{
      incidents,
      setIncidents,
      responders,
      selectedIncident,
      setSelectedIncident,
      addOrUpdateIncident,
      updateResponderTelemetry,
    }}>
      {children}
    </DispatchContext.Provider>
  );
}

export const useDispatch = () => useContext(DispatchContext);