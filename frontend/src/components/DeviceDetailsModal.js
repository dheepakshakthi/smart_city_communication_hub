import React from 'react';
import styled from 'styled-components';

// Device type to emoji mapping for consistent icons
const deviceTypeIcons = {
  CCTV: '📹',
  TrafficSensor: '🚦',
  WasteBinSensor: '🗑️',
  SmartStreetlight: '💡',
  PollutionSensor: '🌡️',
  WaterQualitySensor: '💧',
  NoiseSensor: '🔊',
  ParkingSensor: '🅿️',
};

// Device type to friendly name mapping
const deviceTypeNames = {
  CCTV: 'CCTV Camera',
  TrafficSensor: 'Traffic Sensor',
  WasteBinSensor: 'Waste Bin Sensor',
  SmartStreetlight: 'Smart Street Light',
  PollutionSensor: 'Pollution Sensor',
  WaterQualitySensor: 'Water Quality Sensor',
  NoiseSensor: 'Noise Sensor',
  ParkingSensor: 'Parking Sensor',
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: rgba(0,0,0,0.05);
  }
`;

const DeviceDetails = styled.div`
  display: grid;
  gap: 16px;
`;

const DetailSection = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => 
    props.status === 'online' ? '#E8F5E8' : 
    props.status === 'low_battery' ? '#FFF3E0' : '#FFEBEE'};
  color: ${props => 
    props.status === 'online' ? '#4CAF50' : 
    props.status === 'low_battery' ? '#FF9800' : '#F44336'};
`;

function DeviceDetailsModal({ device, onClose }) {
  if (!device) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {deviceTypeIcons[device.type] || '📍'} {deviceTypeNames[device.type] || device.type}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <DeviceDetails>
          <DetailSection>
            <SectionTitle>Basic Information</SectionTitle>
            <DetailItem>
              <DetailLabel>Device ID</DetailLabel>
              <DetailValue>{device.id}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Type</DetailLabel>
              <DetailValue>{device.type}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Status</DetailLabel>
              <StatusBadge status={device.status}>{device.status}</StatusBadge>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Network Type</DetailLabel>
              <DetailValue>{device.networkType}</DetailValue>
            </DetailItem>
          </DetailSection>

          <DetailSection>
            <SectionTitle>Location & Power</SectionTitle>
            <DetailItem>
              <DetailLabel>Latitude</DetailLabel>
              <DetailValue>{device.location?.lat?.toFixed(6)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Longitude</DetailLabel>
              <DetailValue>{device.location?.lon?.toFixed(6)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Battery Level</DetailLabel>
              <DetailValue>{device.batteryLevel}%</DetailValue>
            </DetailItem>
          </DetailSection>

          {device.currentData && (
            <DetailSection>
              <SectionTitle>Current Sensor Data</SectionTitle>
              {Object.entries(device.currentData).map(([key, value]) => {
                if (key === 'deviceId' || key === 'timestamp' || key === 'location') return null;
                
                if (typeof value === 'object' && value !== null) {
                  return (
                    <div key={key} style={{ marginBottom: '12px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px', textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      {Object.entries(value).map(([subKey, subValue]) => (
                        <DetailItem key={subKey} style={{ marginLeft: '12px', marginBottom: '4px' }}>
                          <DetailLabel>{subKey.replace(/([A-Z])/g, ' $1')}</DetailLabel>
                          <DetailValue>
                            {typeof subValue === 'number' ? subValue.toFixed(2) : String(subValue)}
                          </DetailValue>
                        </DetailItem>
                      ))}
                    </div>
                  );
                }
                
                return (
                  <DetailItem key={key}>
                    <DetailLabel>{key.replace(/([A-Z])/g, ' $1')}</DetailLabel>
                    <DetailValue>
                      {typeof value === 'number' ? value.toFixed(2) : String(value)}
                    </DetailValue>
                  </DetailItem>
                );
              })}
            </DetailSection>
          )}
        </DeviceDetails>
      </ModalContent>
    </ModalOverlay>
  );
}

export default DeviceDetailsModal;
