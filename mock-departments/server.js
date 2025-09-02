const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const path = require('path');

// Create all department servers in one file for simplicity
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Store received data for each department
const departmentData = {
    police: { lastUpdate: null, data: null, history: [] },
    cleaning: { lastUpdate: null, data: null, history: [] },
    environment: { lastUpdate: null, data: null, history: [] },
    municipal: { lastUpdate: null, data: null, history: [] }
};

// Chennai Police Department Routes
app.get('/police', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chennai Police Department - Smart City Dashboard</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    color: white;
                    min-height: 100vh;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 30px;
                    backdrop-filter: blur(10px);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
                    padding-bottom: 20px;
                }
                .logo {
                    font-size: 3em;
                    margin-bottom: 10px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .stat-card {
                    background: rgba(255, 255, 255, 0.15);
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .stat-number {
                    font-size: 2em;
                    font-weight: bold;
                    color: #4ade80;
                }
                .data-section {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 20px;
                }
                .refresh-btn {
                    background: #4ade80;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }
                .refresh-btn:hover {
                    background: #059669;
                }
                .last-update {
                    color: #94a3b8;
                    font-size: 0.9em;
                }
                pre {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🚔</div>
                    <h1>Chennai Police Department</h1>
                    <h2>Smart City Communication Dashboard</h2>
                    <p>Traffic Control & Security Monitoring</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number" id="deviceCount">--</div>
                        <div>Total Devices</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="onlineDevices">--</div>
                        <div>Online Devices</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="alertCount">--</div>
                        <div>Active Alerts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="incidentCount">--</div>
                        <div>Incidents Today</div>
                    </div>
                </div>

                <div style="text-align: center; margin: 20px 0;">
                    <button class="refresh-btn" onclick="refreshData()">🔄 Refresh Data</button>
                </div>

                <div class="data-section">
                    <h3>📊 Real-time Data from Smart City Hub</h3>
                    <div class="last-update" id="lastUpdate">No data received yet</div>
                    <pre id="dataDisplay">Waiting for data from Smart City Communication Hub...</pre>
                </div>

                <div class="data-section">
                    <h3>📈 Recent Activity</h3>
                    <div id="recentActivity">No recent activity</div>
                </div>
            </div>

            <script>
                async function refreshData() {
                    try {
                        const response = await fetch('/api/police/data');
                        const result = await response.json();
                        
                        if (result.data) {
                            const data = result.data;
                            
                            // Update stats
                            document.getElementById('deviceCount').textContent = data.deviceCount || '--';
                            document.getElementById('onlineDevices').textContent = data.summary?.onlineDevices || '--';
                            document.getElementById('alertCount').textContent = data.alerts?.length || '--';
                            document.getElementById('incidentCount').textContent = Math.floor(Math.random() * 10);
                            
                            // Update last update time
                            document.getElementById('lastUpdate').textContent = 
                                'Last updated: ' + new Date(result.lastUpdate).toLocaleString();
                            
                            // Update data display
                            document.getElementById('dataDisplay').textContent = 
                                JSON.stringify(data, null, 2);
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                }

                // Auto-refresh every 30 seconds
                setInterval(refreshData, 30000);
                
                // Initial load
                refreshData();
            </script>
        </body>
        </html>
    `);
});

// Cleaning Department Routes
app.get('/cleaning', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Urbaser Sumeet Cleaning Services - Smart City Dashboard</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%);
                    color: white;
                    min-height: 100vh;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 30px;
                    backdrop-filter: blur(10px);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
                    padding-bottom: 20px;
                }
                .logo {
                    font-size: 3em;
                    margin-bottom: 10px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .stat-card {
                    background: rgba(255, 255, 255, 0.15);
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .stat-number {
                    font-size: 2em;
                    font-weight: bold;
                    color: #4ade80;
                }
                .data-section {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 20px;
                }
                .refresh-btn {
                    background: #4ade80;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }
                .refresh-btn:hover {
                    background: #059669;
                }
                .last-update {
                    color: #94a3b8;
                    font-size: 0.9em;
                }
                pre {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🗑️</div>
                    <h1>Urbaser Sumeet Cleaning Services</h1>
                    <h2>Smart Waste Management Dashboard</h2>
                    <p>Waste Collection & Route Optimization</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number" id="deviceCount">--</div>
                        <div>Total Waste Bins</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="onlineDevices">--</div>
                        <div>Online Bins</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="alertCount">--</div>
                        <div>Collection Needed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="collectionsToday">--</div>
                        <div>Collections Today</div>
                    </div>
                </div>

                <div style="text-align: center; margin: 20px 0;">
                    <button class="refresh-btn" onclick="refreshData()">🔄 Refresh Data</button>
                </div>

                <div class="data-section">
                    <h3>📊 Real-time Data from Smart City Hub</h3>
                    <div class="last-update" id="lastUpdate">No data received yet</div>
                    <pre id="dataDisplay">Waiting for data from Smart City Communication Hub...</pre>
                </div>
            </div>

            <script>
                async function refreshData() {
                    try {
                        const response = await fetch('/api/cleaning/data');
                        const result = await response.json();
                        
                        if (result.data) {
                            const data = result.data;
                            
                            // Update stats
                            document.getElementById('deviceCount').textContent = data.deviceCount || '--';
                            document.getElementById('onlineDevices').textContent = data.summary?.onlineDevices || '--';
                            document.getElementById('alertCount').textContent = data.alerts?.length || '--';
                            document.getElementById('collectionsToday').textContent = Math.floor(Math.random() * 50) + 20;
                            
                            // Update last update time
                            document.getElementById('lastUpdate').textContent = 
                                'Last updated: ' + new Date(result.lastUpdate).toLocaleString();
                            
                            // Update data display
                            document.getElementById('dataDisplay').textContent = 
                                JSON.stringify(data, null, 2);
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                }

                // Auto-refresh every 30 seconds
                setInterval(refreshData, 30000);
                
                // Initial load
                refreshData();
            </script>
        </body>
        </html>
    `);
});

// Environment Department Routes
app.get('/environment', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tamil Nadu Pollution Control Board - Smart City Dashboard</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #0f4c75 0%, #3282b8 100%);
                    color: white;
                    min-height: 100vh;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 30px;
                    backdrop-filter: blur(10px);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
                    padding-bottom: 20px;
                }
                .logo {
                    font-size: 3em;
                    margin-bottom: 10px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .stat-card {
                    background: rgba(255, 255, 255, 0.15);
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .stat-number {
                    font-size: 2em;
                    font-weight: bold;
                    color: #4ade80;
                }
                .aqi-high {
                    color: #ef4444 !important;
                }
                .data-section {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 20px;
                }
                .refresh-btn {
                    background: #4ade80;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }
                .refresh-btn:hover {
                    background: #059669;
                }
                .last-update {
                    color: #94a3b8;
                    font-size: 0.9em;
                }
                pre {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🌱</div>
                    <h1>Tamil Nadu Pollution Control Board</h1>
                    <h2>Environmental Monitoring Dashboard</h2>
                    <p>Air Quality & Environmental Protection</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number" id="deviceCount">--</div>
                        <div>Total Sensors</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="onlineDevices">--</div>
                        <div>Online Sensors</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="alertCount">--</div>
                        <div>Active Alerts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="aqiValue">--</div>
                        <div>Average AQI</div>
                    </div>
                </div>

                <div style="text-align: center; margin: 20px 0;">
                    <button class="refresh-btn" onclick="refreshData()">🔄 Refresh Data</button>
                </div>

                <div class="data-section">
                    <h3>📊 Real-time Data from Smart City Hub</h3>
                    <div class="last-update" id="lastUpdate">No data received yet</div>
                    <pre id="dataDisplay">Waiting for data from Smart City Communication Hub...</pre>
                </div>
            </div>

            <script>
                async function refreshData() {
                    try {
                        const response = await fetch('/api/environment/data');
                        const result = await response.json();
                        
                        if (result.data) {
                            const data = result.data;
                            
                            // Update stats
                            document.getElementById('deviceCount').textContent = data.deviceCount || '--';
                            document.getElementById('onlineDevices').textContent = data.summary?.onlineDevices || '--';
                            document.getElementById('alertCount').textContent = data.alerts?.length || '--';
                            
                            // Calculate average AQI from devices
                            let avgAqi = '--';
                            if (data.devices && data.devices.length > 0) {
                                const aqiValues = data.devices
                                    .filter(d => d.pollution && d.pollution.aqi)
                                    .map(d => d.pollution.aqi);
                                if (aqiValues.length > 0) {
                                    avgAqi = Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length);
                                    document.getElementById('aqiValue').className = avgAqi > 150 ? 'stat-number aqi-high' : 'stat-number';
                                }
                            }
                            document.getElementById('aqiValue').textContent = avgAqi;
                            
                            // Update last update time
                            document.getElementById('lastUpdate').textContent = 
                                'Last updated: ' + new Date(result.lastUpdate).toLocaleString();
                            
                            // Update data display
                            document.getElementById('dataDisplay').textContent = 
                                JSON.stringify(data, null, 2);
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                }

                // Auto-refresh every 30 seconds
                setInterval(refreshData, 30000);
                
                // Initial load
                refreshData();
            </script>
        </body>
        </html>
    `);
});

// Municipal Department Routes
app.get('/municipal', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Greater Chennai Corporation - Smart City Dashboard</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #6a4c93 0%, #c06c84 100%);
                    color: white;
                    min-height: 100vh;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 30px;
                    backdrop-filter: blur(10px);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
                    padding-bottom: 20px;
                }
                .logo {
                    font-size: 3em;
                    margin-bottom: 10px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .stat-card {
                    background: rgba(255, 255, 255, 0.15);
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .stat-number {
                    font-size: 2em;
                    font-weight: bold;
                    color: #4ade80;
                }
                .data-section {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 20px;
                }
                .refresh-btn {
                    background: #4ade80;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }
                .refresh-btn:hover {
                    background: #059669;
                }
                .last-update {
                    color: #94a3b8;
                    font-size: 0.9em;
                }
                pre {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🏛️</div>
                    <h1>Greater Chennai Corporation</h1>
                    <h2>Municipal Infrastructure Dashboard</h2>
                    <p>Street Lighting & Public Infrastructure</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number" id="deviceCount">--</div>
                        <div>Total Devices</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="onlineDevices">--</div>
                        <div>Online Devices</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="energyConsumption">--</div>
                        <div>Energy Usage (kW)</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number" id="maintenanceRequests">--</div>
                        <div>Maintenance Requests</div>
                    </div>
                </div>

                <div style="text-align: center; margin: 20px 0;">
                    <button class="refresh-btn" onclick="refreshData()">🔄 Refresh Data</button>
                </div>

                <div class="data-section">
                    <h3>📊 Real-time Data from Smart City Hub</h3>
                    <div class="last-update" id="lastUpdate">No data received yet</div>
                    <pre id="dataDisplay">Waiting for data from Smart City Communication Hub...</pre>
                </div>
            </div>

            <script>
                async function refreshData() {
                    try {
                        const response = await fetch('/api/municipal/data');
                        const result = await response.json();
                        
                        if (result.data) {
                            const data = result.data;
                            
                            // Update stats
                            document.getElementById('deviceCount').textContent = data.deviceCount || '--';
                            document.getElementById('onlineDevices').textContent = data.summary?.onlineDevices || '--';
                            
                            // Calculate total energy consumption
                            let totalEnergy = 0;
                            if (data.devices && data.devices.length > 0) {
                                data.devices.forEach(device => {
                                    if (device.lighting && device.lighting.energyConsumption) {
                                        totalEnergy += device.lighting.energyConsumption;
                                    }
                                });
                            }
                            document.getElementById('energyConsumption').textContent = 
                                totalEnergy > 0 ? (totalEnergy / 1000).toFixed(2) : '--';
                            
                            document.getElementById('maintenanceRequests').textContent = 
                                Math.floor(Math.random() * 20) + 5;
                            
                            // Update last update time
                            document.getElementById('lastUpdate').textContent = 
                                'Last updated: ' + new Date(result.lastUpdate).toLocaleString();
                            
                            // Update data display
                            document.getElementById('dataDisplay').textContent = 
                                JSON.stringify(data, null, 2);
                        }
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                }

                // Auto-refresh every 30 seconds
                setInterval(refreshData, 30000);
                
                // Initial load
                refreshData();
            </script>
        </body>
        </html>
    `);
});

// API routes for data access
app.get('/api/:department/data', (req, res) => {
    const department = req.params.department;
    const data = departmentData[department];
    
    if (data) {
        res.json({
            success: true,
            department: department,
            lastUpdate: data.lastUpdate,
            data: data.data
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'Department not found'
        });
    }
});

// Webhook endpoints to receive data from Smart City Hub
app.post('/smart-city-webhook/:department', (req, res) => {
    const department = req.params.department;
    const data = req.body;
    
    console.log(`📥 Received data for ${department.toUpperCase()} department:`, {
        timestamp: new Date().toISOString(),
        deviceCount: data.data?.deviceCount || 0,
        alertCount: data.data?.alerts?.length || 0
    });
    
    // Store the data
    if (departmentData[department]) {
        departmentData[department].lastUpdate = new Date().toISOString();
        departmentData[department].data = data.data;
        departmentData[department].history.push({
            timestamp: new Date().toISOString(),
            data: data.data
        });
        
        // Keep only last 10 history entries
        if (departmentData[department].history.length > 10) {
            departmentData[department].history.shift();
        }
    }
    
    res.json({
        success: true,
        message: `Data received for ${department} department`,
        timestamp: new Date().toISOString()
    });
});

// Default route
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Smart City Department Portals</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    text-align: center;
                }
                .header {
                    margin-bottom: 40px;
                }
                .departments-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }
                .department-card {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 30px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: transform 0.3s ease;
                }
                .department-card:hover {
                    transform: translateY(-5px);
                }
                .department-icon {
                    font-size: 3em;
                    margin-bottom: 15px;
                }
                .department-link {
                    display: inline-block;
                    background: #4ade80;
                    color: white;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin-top: 15px;
                    transition: background 0.3s ease;
                }
                .department-link:hover {
                    background: #059669;
                }
                .info-section {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏙️ Smart City Department Portals</h1>
                    <p>Mock Department Websites for Chennai Smart City Communication Hub</p>
                </div>
                
                <div class="departments-grid">
                    <div class="department-card">
                        <div class="department-icon">🚔</div>
                        <h3>Chennai Police Department</h3>
                        <p>Traffic Control & Security Monitoring</p>
                        <a href="/police" class="department-link">Access Dashboard</a>
                    </div>
                    
                    <div class="department-card">
                        <div class="department-icon">🗑️</div>
                        <h3>Urbaser Sumeet Cleaning</h3>
                        <p>Waste Management & Collection</p>
                        <a href="/cleaning" class="department-link">Access Dashboard</a>
                    </div>
                    
                    <div class="department-card">
                        <div class="department-icon">🌱</div>
                        <h3>TN Pollution Control Board</h3>
                        <p>Environmental Monitoring</p>
                        <a href="/environment" class="department-link">Access Dashboard</a>
                    </div>
                    
                    <div class="department-card">
                        <div class="department-icon">🏛️</div>
                        <h3>Greater Chennai Corporation</h3>
                        <p>Municipal Infrastructure</p>
                        <a href="/municipal" class="department-link">Access Dashboard</a>
                    </div>
                </div>
                
                <div class="info-section">
                    <h3>📡 Webhook Information</h3>
                    <p>These mock department websites receive real-time data from the Smart City Communication Hub.</p>
                    <p><strong>Server running on:</strong> http://localhost:4000</p>
                    <p><strong>Webhook endpoints:</strong></p>
                    <ul style="list-style: none; padding: 0;">
                        <li>POST /smart-city-webhook/police</li>
                        <li>POST /smart-city-webhook/cleaning</li>
                        <li>POST /smart-city-webhook/environment</li>
                        <li>POST /smart-city-webhook/municipal</li>
                    </ul>
                </div>
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🏢 Mock Department Servers running on port ${PORT}`);
    console.log(`🌐 Department Portals:`);
    console.log(`   • Police: http://localhost:${PORT}/police`);
    console.log(`   • Cleaning: http://localhost:${PORT}/cleaning`);
    console.log(`   • Environment: http://localhost:${PORT}/environment`);
    console.log(`   • Municipal: http://localhost:${PORT}/municipal`);
    console.log(`📡 Ready to receive webhooks from Smart City Hub`);
});
