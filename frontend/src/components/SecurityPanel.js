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
  margin-bottom: 20px;
`;

const SecurityCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 16px;
`;

const ThreatLevel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => 
    props.level === 'critical' ? '#F44336' : 
    props.level === 'high' ? '#FF9800' : 
    props.level === 'medium' ? '#FFC107' : '#4CAF50'};
`;

const SecurityMetric = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

function SecurityPanel({ securityStatus = {}, devices = [] }) {
  const threatLevel = securityStatus.overallThreatLevel || 'low';
  const totalAlerts = securityStatus.totalAlerts || 0;
  const criticalAlerts = securityStatus.criticalAlerts || 0;
  const authenticatedDevices = securityStatus.authenticatedDevices || 0;

  const getThreatIcon = (level) => {
    switch (level) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🟡';
      default: return '🟢';
    }
  };

  return (
    <PanelContainer>
      <PanelTitle>Security Monitor</PanelTitle>
      
      <SecurityCard>
        <ThreatLevel level={threatLevel}>
          {getThreatIcon(threatLevel)} 
          Threat Level: {threatLevel.toUpperCase()}
        </ThreatLevel>
      </SecurityCard>
      
      <SecurityCard>
        <div style={{ fontWeight: '600', marginBottom: '12px' }}>Security Metrics</div>
        
        <SecurityMetric>
          <span>Total Alerts</span>
          <span style={{ fontWeight: '600' }}>{totalAlerts}</span>
        </SecurityMetric>
        
        <SecurityMetric>
          <span>Critical Alerts</span>
          <span style={{ fontWeight: '600', color: criticalAlerts > 0 ? '#F44336' : '#4CAF50' }}>
            {criticalAlerts}
          </span>
        </SecurityMetric>
        
        <SecurityMetric>
          <span>Authenticated Devices</span>
          <span style={{ fontWeight: '600' }}>{authenticatedDevices}</span>
        </SecurityMetric>
        
        <SecurityMetric>
          <span>Encryption Status</span>
          <span style={{ fontWeight: '600', color: '#4CAF50' }}>Active</span>
        </SecurityMetric>
      </SecurityCard>

      <div style={{ 
        padding: '16px', 
        background: 'rgba(33, 150, 243, 0.1)', 
        borderRadius: '8px', 
        border: '1px solid rgba(33, 150, 243, 0.3)'
      }}>
        <div style={{ fontWeight: '600', color: '#2196F3', marginBottom: '8px' }}>
          🛡️ Security Features
        </div>
        <ul style={{ fontSize: '14px', color: '#666', margin: 0, paddingLeft: '16px' }}>
          <li>End-to-end encryption for all device communications</li>
          <li>Real-time intrusion detection system</li>
          <li>Automated threat response protocols</li>
          <li>Device authentication and authorization</li>
        </ul>
      </div>
    </PanelContainer>
  );
}

export default SecurityPanel;
