const express = require('express');
const router = express.Router();

// City status and control routes
module.exports = (citySimulation) => {
    
    // Get overall city status
    router.get('/status', (req, res) => {
        try {
            const status = citySimulation.getCityStatus();
            res.json({
                success: true,
                data: status
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get all devices
    router.get('/devices', (req, res) => {
        try {
            const devices = citySimulation.devices.map(device => ({
                id: device.id,
                type: device.type.name,
                location: device.location,
                networkType: device.networkType,
                status: device.status,
                batteryLevel: device.batteryLevel,
                energyDraw: device.energyDraw,
                connectedEdgeNode: device.connectedEdgeNode,
                lastUpdate: device.lastUpdate
            }));
            
            res.json({
                success: true,
                data: devices
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get devices by type
    router.get('/devices/:type', (req, res) => {
        try {
            const { type } = req.params;
            const devices = citySimulation.devices
                .filter(device => device.type.name.toLowerCase() === type.toLowerCase())
                .map(device => ({
                    id: device.id,
                    type: device.type.name,
                    location: device.location,
                    networkType: device.networkType,
                    status: device.status,
                    batteryLevel: device.batteryLevel,
                    energyDraw: device.energyDraw,
                    connectedEdgeNode: device.connectedEdgeNode,
                    lastUpdate: device.lastUpdate
                }));
            
            res.json({
                success: true,
                data: devices
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get specific device data
    router.get('/device/:id', (req, res) => {
        try {
            const { id } = req.params;
            const device = citySimulation.devices.find(d => d.id === id);
            
            if (!device) {
                return res.status(404).json({
                    success: false,
                    error: 'Device not found'
                });
            }

            const deviceData = {
                id: device.id,
                type: device.type.name,
                location: device.location,
                networkType: device.networkType,
                status: device.status,
                batteryLevel: device.batteryLevel,
                energyDraw: device.energyDraw,
                connectedEdgeNode: device.connectedEdgeNode,
                lastUpdate: device.lastUpdate,
                currentData: device.generateData()
            };
            
            res.json({
                success: true,
                data: deviceData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get all edge nodes
    router.get('/edge-nodes', (req, res) => {
        try {
            const edgeNodes = citySimulation.edgeNodes.map(node => node.getStatus());
            res.json({
                success: true,
                data: edgeNodes
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get specific edge node
    router.get('/edge-node/:id', (req, res) => {
        try {
            const { id } = req.params;
            const edgeNode = citySimulation.edgeNodes.find(node => node.id === id);
            
            if (!edgeNode) {
                return res.status(404).json({
                    success: false,
                    error: 'Edge node not found'
                });
            }

            res.json({
                success: true,
                data: edgeNode.getStatus()
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get energy statistics
    router.get('/energy', (req, res) => {
        try {
            res.json({
                success: true,
                data: citySimulation.energyStats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get security status
    router.get('/security', (req, res) => {
        try {
            const securityStatus = citySimulation.securityService.getSecurityStatus();
            res.json({
                success: true,
                data: securityStatus
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get active emergency alerts
    router.get('/alerts', (req, res) => {
        try {
            res.json({
                success: true,
                data: citySimulation.emergencyAlerts
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Control simulation
    router.post('/simulation/start', (req, res) => {
        try {
            if (citySimulation.isRunning) {
                return res.json({
                    success: true,
                    message: 'Simulation is already running'
                });
            }
            
            // Note: This would need the socketIO instance to be passed
            // For now, just return success
            res.json({
                success: true,
                message: 'Simulation start command received'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.post('/simulation/stop', (req, res) => {
        try {
            citySimulation.stopSimulation();
            res.json({
                success: true,
                message: 'Simulation stopped'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Trigger emergency scenarios for demo
    router.post('/emergency/:scenario', (req, res) => {
        try {
            const { scenario } = req.params;
            const validScenarios = ['traffic_accident', 'pollution_spike', 'security_breach', 'device_failure'];
            
            if (!validScenarios.includes(scenario)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid scenario type',
                    validScenarios: validScenarios
                });
            }

            citySimulation.triggerEmergencyScenario(scenario);
            res.json({
                success: true,
                message: `Emergency scenario '${scenario}' triggered`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Clear specific alert
    router.delete('/alert/:id', (req, res) => {
        try {
            const { id } = req.params;
            citySimulation.clearAlert(id);
            res.json({
                success: true,
                message: 'Alert cleared'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Analytics endpoints
    router.get('/analytics/traffic', (req, res) => {
        try {
            const trafficSensors = citySimulation.devices.filter(d => d.type.name === 'TrafficSensor');
            const trafficData = trafficSensors.map(sensor => {
                const data = sensor.generateData();
                return {
                    location: sensor.location,
                    vehicleCount: data.traffic.vehicleCount,
                    averageSpeed: data.traffic.averageSpeed,
                    congestionLevel: data.traffic.congestionLevel,
                    timestamp: new Date()
                };
            });

            res.json({
                success: true,
                data: trafficData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/analytics/pollution', (req, res) => {
        try {
            const pollutionSensors = citySimulation.devices.filter(d => d.type.name === 'PollutionSensor');
            const pollutionData = pollutionSensors.map(sensor => {
                const data = sensor.generateData();
                return {
                    location: sensor.location,
                    aqi: data.airQuality.aqi,
                    pm25: data.airQuality.pm25,
                    pm10: data.airQuality.pm10,
                    no2: data.airQuality.no2,
                    timestamp: new Date()
                };
            });

            res.json({
                success: true,
                data: pollutionData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/analytics/energy', (req, res) => {
        try {
            const deviceTypes = {};
            const edgeNodeEnergy = {};
            
            // Group device energy by type
            citySimulation.devices.forEach(device => {
                const type = device.type.name;
                if (!deviceTypes[type]) {
                    deviceTypes[type] = {
                        count: 0,
                        totalEnergy: 0,
                        avgEnergy: 0
                    };
                }
                deviceTypes[type].count++;
                deviceTypes[type].totalEnergy += device.energyDraw;
            });

            // Calculate averages
            Object.keys(deviceTypes).forEach(type => {
                deviceTypes[type].avgEnergy = deviceTypes[type].totalEnergy / deviceTypes[type].count;
            });

            // Edge node energy consumption
            citySimulation.edgeNodes.forEach(node => {
                edgeNodeEnergy[node.id] = {
                    name: node.name || node.id,
                    energyConsumption: node.energyConsumption,
                    cpuUsage: node.cpuUsage,
                    connectedDevices: node.connectedDevices.length,
                    dataSaved: node.cloudDataSaved
                };
            });

            res.json({
                success: true,
                data: {
                    deviceTypes,
                    edgeNodes: edgeNodeEnergy,
                    totalStats: citySimulation.energyStats
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    return router;
};
