import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 80px;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`;

const ConnectionStatus = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.connected ? '#4CAF50' : '#F44336'};
  margin-bottom: 20px;
  animation: ${props => props.pulse ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const NavButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.3)' : 'transparent'};
  color: ${props => props.active ? '#667eea' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 20px;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
    transform: translateX(2px);
  }
  
  &::after {
    content: '${props => props.tooltip}';
    position: absolute;
    left: 60px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(30, 30, 30, 0.9);
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
  }
  
  &:hover::after {
    opacity: 1;
    visibility: visible;
    left: 65px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #F44336;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;

const SimulationIndicator = styled.div`
  margin-top: auto;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StatusLight = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.running ? '#4CAF50' : '#666'};
  animation: ${props => props.running ? 'blink 1.5s infinite' : 'none'};
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
  }
`;

const StatusText = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.2;
`;

const menuItems = [
  { id: 'status', icon: '📊', tooltip: 'City Status' },
  { id: 'alerts', icon: '🚨', tooltip: 'Alerts & Security' },
  { id: 'energy', icon: '⚡', tooltip: 'Energy Dashboard' },
  { id: 'security', icon: '🛡️', tooltip: 'Security Monitor' },
];

function Sidebar({ selectedPanel, onPanelSelect, connected, simulationRunning }) {
  return (
    <SidebarContainer>
      <ConnectionStatus connected={connected} pulse={!connected} />
      
      {menuItems.map(item => (
        <NavButton
          key={item.id}
          active={selectedPanel === item.id}
          tooltip={item.tooltip}
          onClick={() => onPanelSelect(item.id)}
        >
          {item.icon}
          {item.id === 'alerts' && (
            <Badge>3</Badge>
          )}
        </NavButton>
      ))}
      
      <SimulationIndicator>
        <StatusLight running={simulationRunning} />
        <StatusText>
          {simulationRunning ? 'SIM\nRUNNING' : 'SIM\nSTOPPED'}
        </StatusText>
      </SimulationIndicator>
    </SidebarContainer>
  );
}

export default Sidebar;
