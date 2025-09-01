import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  .leaflet-container {
    height: 100%;
    width: 100%;
    background: #f0f2f5;
  }
`;

const MapControls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ControlButton = styled.button`
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
  }
`;

const Legend = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-size: 12px;
  min-width: 200px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0;
  
  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => props.color};
    margin-right: 8px;
  }
`;

// Custom icons for different device types
const createCustomIcon = (type, status = 'online') => {
  const colors = {
    CCTV: status === 'online' ? '#4CAF50' : status === 'low_battery' ? '#FF9800' : '#F44336',
    TrafficSensor: status === 'online' ? '#2196F3' : status === 'low_battery' ? '#FF9800' : '#F44336',
    WasteBinSensor: status === 'online' ? '#9C27B0' : status === 'low_battery' ? '#FF9800' : '#F44336',
    SmartStreetlight: status === 'online' ? '#FFC107' : status === 'low_battery' ? '#FF9800' : '#F44336',
    PollutionSensor: status === 'online' ? '#795548' : status === 'low_battery' ? '#FF9800' : '#F44336',
  };

  const icons = {
    CCTV: '📹',
    TrafficSensor: '🚦',
    WasteBinSensor: '🗑️',
    SmartStreetlight: '💡',
    PollutionSensor: '🌡️',
  };

  return L.divIcon({
    html: `<div style="
      background: ${colors[type] || '#666'};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${icons[type] || '📍'}</div>`,
    className: 'custom-div-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createEdgeNodeIcon = () => {
  return L.divIcon({
    html: `<div style="
      background: linear-gradient(45deg, #667eea, #764ba2);
      width: 30px;
      height: 30px;
      border-radius: 4px;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    ">🏢</div>`,
    className: 'edge-node-icon',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

const createAlertIcon = (severity) => {
  const colors = {
    high: '#F44336',
    medium: '#FF9800',
    low: '#FFC107'
  };

  return L.divIcon({
    html: `<div style="
      background: ${colors[severity] || colors.medium};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    ">⚠️</div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
    </style>`,
    className: 'alert-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

function MapUpdater({ devices, edgeNodes, alerts, onDeviceClick }) {
  const map = useMap();
  const markersRef = useRef([]);

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Add device markers
    devices.forEach(device => {
      const marker = L.marker(
        [device.location.lat, device.location.lon],
        { icon: createCustomIcon(device.type, device.status) }
      );

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">${device.type}</h4>
          <p style="margin: 2px 0;"><strong>ID:</strong> ${device.id}</p>
          <p style="margin: 2px 0;"><strong>Status:</strong> 
            <span style="color: ${device.status === 'online' ? '#4CAF50' : '#F44336'};">
              ${device.status}
            </span>
          </p>
          <p style="margin: 2px 0;"><strong>Network:</strong> ${device.networkType}</p>
          <p style="margin: 2px 0;"><strong>Battery:</strong> ${device.batteryLevel}%</p>
          <button onclick="window.selectDevice('${device.id}')" 
                  style="
                    margin-top: 8px; 
                    padding: 4px 8px; 
                    background: #667eea; 
                    color: white; 
                    border: none; 
                    border-radius: 4px; 
                    cursor: pointer;
                  ">
            View Details
          </button>
        </div>
      `);

      marker.on('click', () => onDeviceClick(device.id));
      marker.addTo(map);
      markersRef.current.push(marker);
    });

    // Add edge node markers
    edgeNodes.forEach(node => {
      const marker = L.marker(
        [node.location.lat, node.location.lon],
        { icon: createEdgeNodeIcon() }
      );

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">Edge Computing Node</h4>
          <p style="margin: 2px 0;"><strong>ID:</strong> ${node.id}</p>
          <p style="margin: 2px 0;"><strong>Name:</strong> ${node.name || 'Unknown'}</p>
          <p style="margin: 2px 0;"><strong>Status:</strong> 
            <span style="color: ${node.status === 'online' ? '#4CAF50' : '#F44336'};">
              ${node.status}
            </span>
          </p>
          <p style="margin: 2px 0;"><strong>Connected Devices:</strong> ${node.connectedDevices}</p>
        </div>
      `);

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    // Add alert markers
    alerts.forEach(alert => {
      if (alert.location) {
        const marker = L.marker(
          [alert.location.lat, alert.location.lon],
          { icon: createAlertIcon(alert.severity) }
        );

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #F44336;">🚨 Emergency Alert</h4>
            <p style="margin: 2px 0;"><strong>Type:</strong> ${alert.type}</p>
            <p style="margin: 2px 0;"><strong>Severity:</strong> 
              <span style="color: ${alert.severity === 'high' ? '#F44336' : '#FF9800'};">
                ${alert.severity}
              </span>
            </p>
            <p style="margin: 2px 0;"><strong>Description:</strong> ${alert.description}</p>
            <p style="margin: 2px 0; font-size: 12px; color: #666;">
              ${new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        `);

        marker.addTo(map);
        markersRef.current.push(marker);
      }
    });

    return () => {
      markersRef.current.forEach(marker => {
        map.removeLayer(marker);
      });
      markersRef.current = [];
    };
  }, [devices, edgeNodes, alerts, map, onDeviceClick]);

  return null;
}

function CityMap({ devices = [], edgeNodes = [], emergencyAlerts = [], onDeviceClick }) {
  const mapRef = useRef();

  // Default center (NYC downtown area)
  const defaultCenter = [40.7539, -73.9791];
  const defaultZoom = 14;

  useEffect(() => {
    // Make device click handler globally available for popup buttons
    window.selectDevice = onDeviceClick;
    
    return () => {
      delete window.selectDevice;
    };
  }, [onDeviceClick]);

  const handleFitBounds = () => {
    if (mapRef.current) {
      const allLocations = [
        ...devices.map(d => [d.location.lat, d.location.lon]),
        ...edgeNodes.map(n => [n.location.lat, n.location.lon])
      ];
      
      if (allLocations.length > 0) {
        mapRef.current.fitBounds(allLocations, { padding: [20, 20] });
      }
    }
  };

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(defaultCenter, defaultZoom);
    }
  };

  return (
    <MapWrapper>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        ref={mapRef}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater
          devices={devices}
          edgeNodes={edgeNodes}
          alerts={emergencyAlerts}
          onDeviceClick={onDeviceClick}
        />
      </MapContainer>

      <MapControls>
        <ControlButton onClick={handleFitBounds}>
          📍 Fit All
        </ControlButton>
        <ControlButton onClick={handleResetView}>
          🏠 Reset View
        </ControlButton>
      </MapControls>

      <Legend>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Device Types</h4>
        <LegendItem color="#4CAF50">📹 CCTV Cameras</LegendItem>
        <LegendItem color="#2196F3">🚦 Traffic Sensors</LegendItem>
        <LegendItem color="#9C27B0">🗑️ Waste Bins</LegendItem>
        <LegendItem color="#FFC107">💡 Smart Lights</LegendItem>
        <LegendItem color="#795548">🌡️ Pollution Sensors</LegendItem>
        <LegendItem color="#667eea">🏢 Edge Nodes</LegendItem>
        {emergencyAlerts.length > 0 && (
          <LegendItem color="#F44336">⚠️ Alerts ({emergencyAlerts.length})</LegendItem>
        )}
      </Legend>
    </MapWrapper>
  );
}

export default CityMap;
