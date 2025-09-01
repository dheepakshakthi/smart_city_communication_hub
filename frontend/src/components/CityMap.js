import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import styled from 'styled-components';
import { createCustomDeviceIcon, createEdgeNodeIcon, createAlertIcon } from './DeviceIcons';

// Enhanced legend with device-specific information
const deviceTypeInfo = {
  CCTV: { color: '#2C3E50', icon: '📹', name: 'Security Cameras' },
  TrafficSensor: { color: '#34495E', icon: '🚦', name: 'Traffic Controllers' },
  WasteBinSensor: { color: '#8E44AD', icon: '🗑️', name: 'Waste Monitors' },
  SmartStreetlight: { color: '#F39C12', icon: '💡', name: 'Smart Lighting' },
  PollutionSensor: { color: '#95A5A6', icon: '🌡️', name: 'Air Quality' },
  WaterQualitySensor: { color: '#3498DB', icon: '💧', name: 'Water Sensors' },
  NoiseSensor: { color: '#E91E63', icon: '🔊', name: 'Sound Monitors' },
  ParkingSensor: { color: '#3F51B5', icon: '🅿️', name: 'Parking Spaces' },
};

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

function MapUpdater({ devices, edgeNodes, alerts, onDeviceClick }) {
  const map = useMap();
  const markersRef = useRef([]);

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Add device markers with large, distinctive custom icons for each device type
    devices.forEach(device => {
      const marker = L.marker(
        [device.location.lat, device.location.lon],
        { icon: createCustomDeviceIcon(device.type, device.status, 40) }
      );

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">${deviceTypeInfo[device.type]?.name || device.type}</h4>
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

    // Add edge node markers with enhanced design
    edgeNodes.forEach(node => {
      const marker = L.marker(
        [node.location.lat, node.location.lon],
        { icon: createEdgeNodeIcon(40) }
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

    // Add alert markers with enhanced design
    alerts.forEach(alert => {
      if (alert.location) {
        const marker = L.marker(
          [alert.location.lat, alert.location.lon],
          { icon: createAlertIcon(alert.severity, 32) }
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
        {Object.entries(deviceTypeInfo).map(([type, info]) => (
          <LegendItem key={type} color={info.color}>
            {info.icon} {info.name}
          </LegendItem>
        ))}
        <LegendItem color="#667eea">🏢 Edge Computing Nodes</LegendItem>
        {emergencyAlerts.length > 0 && (
          <LegendItem color="#F44336">⚠️ Active Alerts ({emergencyAlerts.length})</LegendItem>
        )}
      </Legend>
    </MapWrapper>
  );
}

export default CityMap;
