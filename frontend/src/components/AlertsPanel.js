import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto;
`;

const PanelTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const AlertList = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const AlertItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const EmergencyControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
`;

const EmergencyButton = styled.button`
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background: #F44336;
  color: white;
  
  &:hover {
    background: #D32F2F;
    transform: translateY(-1px);
  }
`;

function AlertsPanel({ alerts = [], securityStatus = {}, onClearAlert, onTriggerEmergency }) {
  return (
    <PanelContainer>
      <PanelTitle>Alerts & Security</PanelTitle>
      
      <AlertList>
        {alerts.length === 0 ? (
          <AlertItem style={{ textAlign: 'center', color: '#666' }}>
            No active alerts
          </AlertItem>
        ) : (
          alerts.map(alert => (
            <AlertItem key={alert.id}>
              <div style={{ fontWeight: 'bold', color: '#F44336' }}>
                {alert.type}
              </div>
              <div style={{ fontSize: '14px', margin: '4px 0' }}>
                {alert.description}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {new Date(alert.timestamp).toLocaleString()}
              </div>
            </AlertItem>
          ))
        )}
      </AlertList>

      <div style={{ fontWeight: '600', marginBottom: '10px' }}>
        Emergency Scenarios (Demo)
      </div>
      <EmergencyControls>
        <EmergencyButton onClick={() => onTriggerEmergency('traffic_accident')}>
          🚗 Traffic Accident
        </EmergencyButton>
        <EmergencyButton onClick={() => onTriggerEmergency('pollution_spike')}>
          🌫️ Pollution Spike
        </EmergencyButton>
        <EmergencyButton onClick={() => onTriggerEmergency('security_breach')}>
          🛡️ Security Breach
        </EmergencyButton>
        <EmergencyButton onClick={() => onTriggerEmergency('device_failure')}>
          📱 Device Failure
        </EmergencyButton>
      </EmergencyControls>
    </PanelContainer>
  );
}

export default AlertsPanel;
