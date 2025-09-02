import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/DeviceIcons.css';

import Header from './components/Header';
import CityMap from './components/CityMap';
import Sidebar from './components/Sidebar';
import StatusPanel from './components/StatusPanel';
import AlertsPanel from './components/AlertsPanel';
import EnergyDashboard from './components/EnergyDashboard';
import SecurityPanel from './components/SecurityPanel';
import DeviceDetailsModal from './components/DeviceDetailsModal';
import LoadingScreen from './components/LoadingScreen';
import DepartmentDashboard from './components/DepartmentDashboard';

import { SocketService } from './services/socketService';
import { ApiService } from './services/apiService';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  background: #f0f2f5;
`;

const RightPanel = styled.div`
  width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

function App() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'departments'
  const [cityData, setCityData] = useState({
    devices: [],
    edgeNodes: [],
    energyStats: {},
    securityStatus: {},
    emergencyAlerts: []
  });
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState('status');
  const [simulationRunning, setSimulationRunning] = useState(false);

  useEffect(() => {
    initializeApp();
    
    return () => {
      SocketService.disconnect();
    };
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize API service
      await ApiService.initialize();
      
      // Initialize socket connection
      await SocketService.initialize();
      
      // Set up socket event listeners
      setupSocketListeners();
      
      // Load initial data
      await loadInitialData();
      
      setLoading(false);
      toast.success('🏙️ Smart City Hub Connected!');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      toast.error('Failed to connect to Smart City Hub');
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // Connection status
    SocketService.on('connect', () => {
      setConnected(true);
      console.log('Connected to Smart City Hub');
    });

    SocketService.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from Smart City Hub');
    });

    // City initialization
    SocketService.on('city_initialized', (data) => {
      setCityData({
        devices: data.devices || [],
        edgeNodes: data.edgeNodes || [],
        energyStats: data.energyStats || {},
        securityStatus: data.securityStatus || {},
        emergencyAlerts: data.emergencyAlerts || []
      });
      console.log('City data initialized:', data);
    });

    // Real-time device data updates
    SocketService.on('device_data', (data) => {
      // Update device in the list
      setCityData(prev => ({
        ...prev,
        devices: prev.devices.map(device => 
          device.id === data.device.id 
            ? { ...device, ...data.device }
            : device
        )
      }));
    });

    // Edge nodes status updates
    SocketService.on('edge_nodes_status', (edgeNodes) => {
      setCityData(prev => ({
        ...prev,
        edgeNodes: edgeNodes || []
      }));
    });

    // Security status updates
    SocketService.on('security_status', (securityStatus) => {
      setCityData(prev => ({
        ...prev,
        securityStatus: securityStatus || {}
      }));
    });

    // Energy statistics updates
    SocketService.on('energy_stats', (energyStats) => {
      setCityData(prev => ({
        ...prev,
        energyStats: energyStats || {}
      }));
    });

    // Emergency alerts
    SocketService.on('emergency_alert', (alert) => {
      setCityData(prev => ({
        ...prev,
        emergencyAlerts: [...prev.emergencyAlerts, alert]
      }));
      
      // Show toast notification
      const severity = alert.severity || 'medium';
      const toastType = severity === 'high' ? 'error' : 
                       severity === 'medium' ? 'warning' : 'info';
      
      toast[toastType](`🚨 ${alert.description}`);
    });

    // Alert cleared
    SocketService.on('alert_cleared', (data) => {
      setCityData(prev => ({
        ...prev,
        emergencyAlerts: prev.emergencyAlerts.filter(alert => alert.id !== data.alertId)
      }));
      toast.success('Alert cleared');
    });

    // Simulation status
    SocketService.on('simulation_started', () => {
      setSimulationRunning(true);
      toast.success('🏙️ City simulation started');
    });

    SocketService.on('simulation_stopped', () => {
      setSimulationRunning(false);
      toast.info('🛑 City simulation stopped');
    });

    // Device details response
    SocketService.on('device_details', (deviceData) => {
      setSelectedDevice(deviceData);
    });
  };

  const loadInitialData = async () => {
    try {
      const [statusRes, devicesRes, edgeNodesRes, energyRes, securityRes, alertsRes] = await Promise.all([
        ApiService.getCityStatus(),
        ApiService.getDevices(),
        ApiService.getEdgeNodes(),
        ApiService.getEnergyStats(),
        ApiService.getSecurityStatus(),
        ApiService.getAlerts()
      ]);

      setCityData({
        devices: devicesRes.data || [],
        edgeNodes: edgeNodesRes.data || [],
        energyStats: energyRes.data || {},
        securityStatus: securityRes.data || {},
        emergencyAlerts: alertsRes.data || []
      });

      setSimulationRunning(statusRes.data?.isRunning || false);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const handleDeviceClick = (deviceId) => {
    const device = cityData.devices.find(d => d.id === deviceId);
    if (device) {
      SocketService.emit('request_device_data', { deviceId });
    }
  };

  const handleEmergencyTrigger = (scenario) => {
    SocketService.emit('trigger_emergency', { scenario });
    toast.info(`Triggering ${scenario} scenario...`);
  };

  const handleClearAlert = (alertId) => {
    SocketService.emit('clear_alert', { alertId });
  };

  const toggleSimulation = () => {
    if (simulationRunning) {
      SocketService.emit('stop_simulation');
    } else {
      SocketService.emit('start_simulation');
    }
  };

  const renderRightPanel = () => {
    switch (selectedPanel) {
      case 'status':
        return (
          <StatusPanel 
            cityData={cityData}
            simulationRunning={simulationRunning}
            onToggleSimulation={toggleSimulation}
          />
        );
      case 'alerts':
        return (
          <AlertsPanel 
            alerts={cityData.emergencyAlerts}
            securityStatus={cityData.securityStatus}
            onClearAlert={handleClearAlert}
            onTriggerEmergency={handleEmergencyTrigger}
          />
        );
      case 'energy':
        return (
          <EnergyDashboard 
            energyStats={cityData.energyStats}
            devices={cityData.devices}
            edgeNodes={cityData.edgeNodes}
          />
        );
      case 'security':
        return (
          <SecurityPanel 
            securityStatus={cityData.securityStatus}
            devices={cityData.devices}
          />
        );
      default:
        return <StatusPanel cityData={cityData} />;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // Show department dashboard if requested
  if (currentView === 'departments') {
    return (
      <>
        <DepartmentDashboard />
        <button
          onClick={() => setCurrentView('dashboard')}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          ← Back to Main Dashboard
        </button>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </>
    );
  }

  return (
    <AppContainer>
      <Sidebar 
        selectedPanel={selectedPanel}
        onPanelSelect={setSelectedPanel}
        connected={connected}
        simulationRunning={simulationRunning}
        onViewDepartments={() => setCurrentView('departments')}
      />
      
      <MainContent>
        <Header 
          connected={connected}
          simulationRunning={simulationRunning}
          deviceCount={cityData.devices.length}
          alertCount={cityData.emergencyAlerts.length}
          onToggleSimulation={toggleSimulation}
          onViewDepartments={() => setCurrentView('departments')}
        />
        
        <ContentArea>
          <MapContainer>
            <CityMap 
              devices={cityData.devices}
              edgeNodes={cityData.edgeNodes}
              emergencyAlerts={cityData.emergencyAlerts}
              onDeviceClick={handleDeviceClick}
              selectedDevice={selectedDevice}
            />
          </MapContainer>
          
          <RightPanel>
            {renderRightPanel()}
          </RightPanel>
        </ContentArea>
      </MainContent>

      {selectedDevice && (
        <DeviceDetailsModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AppContainer>
  );
}

export default App;
