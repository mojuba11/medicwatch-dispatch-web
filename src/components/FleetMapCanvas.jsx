import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useDispatch } from '../context/DispatchContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default marker asset paths so they don't break under Vite builds
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom engine interceptor to dynamically focus/pan the map frame when an incident is selected
function MapViewAutoCenter({ coordinates }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates) {
      map.flyTo(coordinates, 14, { animate: true, duration: 1.5 });
    }
  }, [coordinates, map]);
  return null;
}

export default function FleetMapCanvas() {
  const { selectedIncident } = useDispatch();

  // Baseline map anchor coordinates (Defaulting near Lagos/West Africa operations grid)
  const defaultCenterCoordinates = [6.5244, 3.3792];
  
  // Extract active coordinates if available on selected incident schema
  const activeIncidentCoordinates = selectedIncident?.location?.coordinates 
    ? [selectedIncident.location.coordinates[1], selectedIncident.location.coordinates[0]] // [lat, lng]
    : null;

  const currentFocusNode = activeIncidentCoordinates || defaultCenterCoordinates;

  return (
    <div className="flex-1 h-full relative bg-slate-950 z-10">
      <MapContainer 
        center={currentFocusNode} 
        zoom={11} 
        style={{ height: '100%', width: '100%', background: '#090d16' }}
        zoomControl={false}
      >
        {/* CartoDB Dark Matter Custom Tile Server to match the high-end dark dashboard theme */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Render a tracking marker indicator if an active incident target is focused */}
        {activeIncidentCoordinates && (
          <Marker position={activeIncidentCoordinates}>
            <Popup>
              <div className="text-xs p-1 font-sans text-slate-900">
                <p className="font-bold border-b border-slate-200 pb-1 mb-1 text-rose-600 uppercase">ACTIVE EMERGENCY GRID</p>
                <p className="font-mono text-[10px] text-slate-600">ID: {selectedIncident._id}</p>
                <p className="mt-1 text-slate-700 font-medium">Status: <span className="font-bold text-amber-600">{selectedIncident.status}</span></p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Auto-re-centering vector script injection */}
        <MapViewAutoCenter coordinates={activeIncidentCoordinates} />
      </MapContainer>

      {/* Floating HUD overlay on map canvas frame */}
      <div className="absolute top-4 right-4 z-[400] bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-2xl backdrop-blur-md max-w-xs pointer-events-auto">
        <div className="flex flex-col space-y-1">
          <label className="text-[9px] font-mono font-black text-rose-500 tracking-widest uppercase">TACTICAL MATRIX FEED</label>
          <p className="text-[11px] font-bold text-slate-200">
            {selectedIncident ? 'LOCK ON TARGET COORDINATES' : 'STREAMING GLOBAL FLEET TELEMETRY'}
          </p>
          <p className="text-[9px] font-medium text-slate-400 leading-relaxed mt-0.5">
            {selectedIncident 
              ? `Auto-tracking telemetry nodes localized to system intersection marker.` 
              : 'Vector tracking mesh online. Displaying baseline tactical zone bounds.'}
          </p>
        </div>
      </div>
    </div>
  );
}