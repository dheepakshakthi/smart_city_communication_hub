import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ApiService } from '../services/apiService';

const DepartmentDashboardContainer = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    background: linear-gradient(45deg, #fff, #e0e7ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1.2rem;
    opacity: 0.9;
  }
`;

const DepartmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const DepartmentCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const DepartmentName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #fff;
`;

const ContactInfo = styled.div`
  margin-bottom: 15px;
  
  p {
    margin: 5px 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const ResponsibilitiesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0;
  
  li {
    padding: 5px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.9rem;
    opacity: 0.9;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:before {
      content: "• ";
      color: #4ade80;
      font-weight: bold;
    }
  }
`;

const DeviceStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  
  div {
    text-align: center;
    
    .number {
      font-size: 1.2rem;
      font-weight: bold;
      color: #4ade80;
    }
    
    .label {
      font-size: 0.8rem;
      opacity: 0.8;
    }
  }
`;

const DepartmentDetails = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 30px;
  margin-top: 20px;
`;

const DeviceTable = styled.table`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 20px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    background: rgba(255, 255, 255, 0.1);
    font-weight: bold;
  }
  
  .status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
    
    &.online {
      background: #10b981;
      color: white;
    }
    
    &.offline {
      background: #ef4444;
      color: white;
    }
    
    &.low_battery {
      background: #f59e0b;
      color: white;
    }
  }
`;

const AlertsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  
  h4 {
    color: #ef4444;
    margin-bottom: 15px;
  }
`;

const AlertItem = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  
  .severity {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-right: 10px;
    
    &.critical {
      background: #dc2626;
      color: white;
    }
    
    &.high {
      background: #ea580c;
      color: white;
    }
    
    &.medium {
      background: #d97706;
      color: white;
    }
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const RefreshButton = styled.button`
  background: #10b981;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
  
  &:hover {
    background: #059669;
  }
`;

const DepartmentDashboard = () => {
    const [departments, setDepartments] = useState({});
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [departmentData, setDepartmentData] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getDepartments();
            setDepartments(response.data);
        } catch (err) {
            setError('Failed to fetch departments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartmentData = async (deptId) => {
        try {
            setLoading(true);
            const [dataResponse, alertsResponse] = await Promise.all([
                ApiService.getDepartmentData(`${deptId}/dashboard`),
                ApiService.getDepartmentAlerts(deptId)
            ]);
            
            setDepartmentData(dataResponse.data);
            setAlerts(alertsResponse.data.alerts);
            setSelectedDepartment(deptId);
        } catch (err) {
            setError('Failed to fetch department data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const refreshDepartmentData = () => {
        if (selectedDepartment) {
            fetchDepartmentData(selectedDepartment);
        }
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'short',
            timeStyle: 'medium'
        });
    };

    if (loading) {
        return (
            <DepartmentDashboardContainer>
                <Header>
                    <h1>Loading Department Dashboard...</h1>
                </Header>
            </DepartmentDashboardContainer>
        );
    }

    if (error) {
        return (
            <DepartmentDashboardContainer>
                <Header>
                    <h1>Error</h1>
                    <p>{error}</p>
                </Header>
            </DepartmentDashboardContainer>
        );
    }

    if (selectedDepartment && departmentData) {
        const dept = departmentData.department;
        
        return (
            <DepartmentDashboardContainer>
                <BackButton onClick={() => setSelectedDepartment(null)}>
                    ← Back to Departments
                </BackButton>
                <RefreshButton onClick={refreshDepartmentData}>
                    🔄 Refresh Data
                </RefreshButton>
                
                <Header>
                    <h1>{dept.name}</h1>
                    <p>Real-time Department Dashboard</p>
                    <p>Last updated: {formatTimestamp(departmentData.timestamp)}</p>
                </Header>

                <DepartmentDetails>
                    <DeviceStats>
                        <div>
                            <div className="number">{departmentData.deviceCount}</div>
                            <div className="label">Total Devices</div>
                        </div>
                        <div>
                            <div className="number">{departmentData.summary.onlineDevices}</div>
                            <div className="label">Online</div>
                        </div>
                        <div>
                            <div className="number">{departmentData.summary.offlineDevices}</div>
                            <div className="label">Offline</div>
                        </div>
                        <div>
                            <div className="number">{alerts.length}</div>
                            <div className="label">Active Alerts</div>
                        </div>
                    </DeviceStats>

                    {alerts.length > 0 && (
                        <AlertsSection>
                            <h4>🚨 Active Alerts</h4>
                            {alerts.map((alert, index) => (
                                <AlertItem key={index}>
                                    <span className={`severity ${alert.severity}`}>
                                        {alert.severity.toUpperCase()}
                                    </span>
                                    <strong>{alert.message}</strong>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '5px' }}>
                                        Device: {alert.deviceId} | {formatTimestamp(alert.timestamp)}
                                    </div>
                                </AlertItem>
                            ))}
                        </AlertsSection>
                    )}

                    <DeviceTable>
                        <thead>
                            <tr>
                                <th>Device ID</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Battery</th>
                                <th>Location</th>
                                <th>Network</th>
                                <th>Last Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departmentData.devices.map(device => (
                                <tr key={device.id}>
                                    <td>{device.id}</td>
                                    <td>{device.type}</td>
                                    <td>
                                        <span className={`status ${device.status}`}>
                                            {device.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{device.batteryLevel}%</td>
                                    <td>
                                        {device.location.lat.toFixed(4)}, {device.location.lon.toFixed(4)}
                                    </td>
                                    <td>{device.networkType}</td>
                                    <td>{formatTimestamp(device.lastUpdate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </DeviceTable>
                </DepartmentDetails>
            </DepartmentDashboardContainer>
        );
    }

    return (
        <DepartmentDashboardContainer>
            <Header>
                <h1>Chennai Smart City</h1>
                <p>Department Communication Hub</p>
            </Header>

            <DepartmentGrid>
                {Object.entries(departments).map(([deptId, dept]) => (
                    <DepartmentCard key={deptId} onClick={() => fetchDepartmentData(deptId)}>
                        <DepartmentName>{dept.name}</DepartmentName>
                        
                        <ContactInfo>
                            <p><strong>📧 Email:</strong> {dept.contactInfo.email}</p>
                            <p><strong>📞 Phone:</strong> {dept.contactInfo.phone}</p>
                            <p><strong>📍 Address:</strong> {dept.contactInfo.address}</p>
                        </ContactInfo>

                        <div>
                            <strong>Responsibilities:</strong>
                            <ResponsibilitiesList>
                                {dept.responsibilities.map((resp, index) => (
                                    <li key={index}>{resp}</li>
                                ))}
                            </ResponsibilitiesList>
                        </div>

                        <div>
                            <strong>Device Types:</strong>
                            <p style={{ fontSize: '0.9rem', opacity: '0.8', marginTop: '5px' }}>
                                {dept.devices.join(', ')}
                            </p>
                        </div>
                    </DepartmentCard>
                ))}
            </DepartmentGrid>
        </DepartmentDashboardContainer>
    );
};

export default DepartmentDashboard;
