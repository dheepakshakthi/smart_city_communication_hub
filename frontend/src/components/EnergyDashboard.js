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

const EnergyCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 16px;
`;

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 4px;
`;

const MetricLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

function EnergyDashboard({ energyStats = {}, devices = [], edgeNodes = [] }) {
  const totalEnergy = energyStats.totalConsumption || 0;
  const cloudDataSaved = energyStats.cloudDataSaved || 0;
  const co2Reduction = energyStats.co2Reduction || 0;

  return (
    <PanelContainer>
      <PanelTitle>Energy Dashboard</PanelTitle>
      
      <EnergyCard>
        <MetricValue>{Math.round(totalEnergy)} W</MetricValue>
        <MetricLabel>Total Energy Consumption</MetricLabel>
      </EnergyCard>
      
      <EnergyCard>
        <MetricValue>{Math.round(cloudDataSaved)} MB</MetricValue>
        <MetricLabel>Cloud Data Saved (Edge Processing)</MetricLabel>
      </EnergyCard>
      
      <EnergyCard>
        <MetricValue>{co2Reduction.toFixed(2)} kg/h</MetricValue>
        <MetricLabel>CO₂ Reduction</MetricLabel>
      </EnergyCard>

      <div style={{ 
        padding: '16px', 
        background: 'rgba(76, 175, 80, 0.1)', 
        borderRadius: '8px', 
        marginTop: '20px',
        border: '1px solid rgba(76, 175, 80, 0.3)'
      }}>
        <div style={{ fontWeight: '600', color: '#4CAF50', marginBottom: '8px' }}>
          💡 Sustainability Impact
        </div>
        <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
          Edge computing reduces data transfer to cloud by 85%, saving energy and reducing carbon footprint.
          Smart streetlights adapt brightness based on motion, optimizing power consumption.
        </div>
      </div>
    </PanelContainer>
  );
}

export default EnergyDashboard;
