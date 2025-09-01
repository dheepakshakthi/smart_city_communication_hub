import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const LogoIcon = styled.span`
  font-size: 24px;
  margin-right: 12px;
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => 
    props.status === 'connected' ? '#4CAF50' : 
    props.status === 'running' ? '#2196F3' : 
    props.status === 'warning' ? '#FF9800' : '#F44336'};
  animation: ${props => props.pulse ? 'pulse 2s infinite' : 'none'};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ControlButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: #667eea;
    color: white;
  }
  
  &.secondary {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    border: 1px solid rgba(102, 126, 234, 0.3);
  }
  
  &.danger {
    background: #F44336;
    color: white;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Badge = styled.span`
  background: ${props => 
    props.variant === 'error' ? '#F44336' : 
    props.variant === 'warning' ? '#FF9800' : 
    props.variant === 'success' ? '#4CAF50' : '#2196F3'};
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  min-width: 16px;
  text-align: center;
`;

function Header({ 
  connected, 
  simulationRunning, 
  deviceCount = 0, 
  alertCount = 0, 
  onToggleSimulation 
}) {
  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon>🏙️</LogoIcon>
        Smart City Communication Hub
      </Logo>
      
      <StatusBar>
        <StatusItem>
          <StatusIndicator 
            status={connected ? 'connected' : 'disconnected'} 
            pulse={!connected}
          />
          {connected ? 'Connected' : 'Disconnected'}
        </StatusItem>
        
        <StatusItem>
          <StatusIndicator 
            status={simulationRunning ? 'running' : 'stopped'} 
          />
          Simulation {simulationRunning ? 'Running' : 'Stopped'}
        </StatusItem>
        
        <StatusItem>
          📱 {deviceCount} Devices
        </StatusItem>
        
        <StatusItem>
          🚨 {alertCount} Alerts
          {alertCount > 0 && <Badge variant="error">{alertCount}</Badge>}
        </StatusItem>
      </StatusBar>
      
      <Controls>
        <ControlButton
          className={simulationRunning ? 'danger' : 'primary'}
          onClick={onToggleSimulation}
          disabled={!connected}
        >
          {simulationRunning ? '⏹️ Stop' : '▶️ Start'} Simulation
        </ControlButton>
      </Controls>
    </HeaderContainer>
  );
}

export default Header;
