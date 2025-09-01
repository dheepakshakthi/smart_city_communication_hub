import React from 'react';
import styled from 'styled-components';

// Device type icons for consistent display
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

const PanelContainer = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
`;

const PanelHeader = styled.div`
  margin-bottom: 24px;
`;

const PanelTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const PanelSubtitle = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.4;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DeviceList = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const DeviceListHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  font-weight: 600;
  color: #333;
`;

const DeviceItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const DeviceIcon = styled.span`
  font-size: 16px;
  margin-right: 12px;
`;

const DeviceInfo = styled.div`
  flex: 1;
`;

const DeviceName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
`;

const DeviceStatus = styled.div`
  font-size: 12px;
  color: ${props => 
    props.status === 'online' ? '#4CAF50' : 
    props.status === 'low_battery' ? '#FF9800' : '#F44336'};
`;

const BatteryBar = styled.div`
  width: 40px;
  height: 6px;
  background: rgba(0,0,0,0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-left: 8px;
`;

const BatteryFill = styled.div`
  height: 100%;
  background: ${props => 
    props.level > 50 ? '#4CAF50' : 
    props.level > 20 ? '#FF9800' : '#F44336'};
  width: ${props => props.level}%;
  transition: all 0.3s ease;
`;

const ControlSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(0,0,0,0.1);
`;

const ControlButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  
  &.primary {
    background: #667eea;
    color: white;
  }
  
  &.secondary {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    border: 1px solid rgba(102, 126, 234, 0.3);
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

function StatusPanel({ cityData = {}, simulationRunning = false, onToggleSimulation }) {
  const { devices = [], edgeNodes = [] } = cityData;
  
  const deviceStats = devices.reduce((acc, device) => {
    acc.total++;
    if (device.status === 'online') acc.online++;
    if (device.status === 'low_battery') acc.lowBattery++;
    if (device.status === 'offline') acc.offline++;
    return acc;
  }, { total: 0, online: 0, lowBattery: 0, offline: 0 });

  const avgBattery = devices.length > 0 
    ? devices.reduce((sum, device) => sum + device.batteryLevel, 0) / devices.length 
    : 100;

  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>City Status</PanelTitle>
        <PanelSubtitle>
          Real-time overview of all IoT devices and infrastructure components
          in the smart city network.
        </PanelSubtitle>
      </PanelHeader>

      <StatsGrid>
        <StatCard>
          <StatValue>{deviceStats.total}</StatValue>
          <StatLabel>Total Devices</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{deviceStats.online}</StatValue>
          <StatLabel>Online</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{edgeNodes.length}</StatValue>
          <StatLabel>Edge Nodes</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{Math.round(avgBattery)}%</StatValue>
          <StatLabel>Avg Battery</StatLabel>
        </StatCard>
      </StatsGrid>

      <DeviceList>
        <DeviceListHeader>
          Device Status ({devices.length} devices)
        </DeviceListHeader>
        
        {devices.slice(0, 10).map(device => (
          <DeviceItem key={device.id}>
            <DeviceIcon>{deviceTypeIcons[device.type] || '📱'}</DeviceIcon>
            <DeviceInfo>
              <DeviceName>{device.id}</DeviceName>
              <DeviceStatus status={device.status}>
                {device.status} • {device.networkType}
              </DeviceStatus>
            </DeviceInfo>
            <BatteryBar>
              <BatteryFill level={device.batteryLevel} />
            </BatteryBar>
          </DeviceItem>
        ))}
        
        {devices.length > 10 && (
          <DeviceItem style={{ justifyContent: 'center', fontStyle: 'italic', color: '#666' }}>
            ... and {devices.length - 10} more devices
          </DeviceItem>
        )}
      </DeviceList>

      <ControlSection>
        <ControlButton
          className={simulationRunning ? 'secondary' : 'primary'}
          onClick={onToggleSimulation}
        >
          {simulationRunning ? '⏹️ Stop Simulation' : '▶️ Start Simulation'}
        </ControlButton>
        
        <ControlButton className="secondary">
          📊 View Analytics
        </ControlButton>
        
        <ControlButton className="secondary">
          ⚙️ System Settings
        </ControlButton>
      </ControlSection>
    </PanelContainer>
  );
}

export default StatusPanel;
