const express = require('express');
const router = express.Router();

// Department-specific data routes
module.exports = (citySimulation, departmentService) => {

    // Get all departments info
    router.get('/departments', (req, res) => {
        try {
            const departments = departmentService.getAllDepartments();
            res.json({
                success: true,
                data: departments
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get specific department info
    router.get('/departments/:deptId', (req, res) => {
        try {
            const { deptId } = req.params;
            const department = departmentService.getDepartment(deptId);
            
            if (!department) {
                return res.status(404).json({
                    success: false,
                    error: 'Department not found'
                });
            }

            res.json({
                success: true,
                data: department
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get department-specific device data
    router.get('/departments/:deptId/devices', (req, res) => {
        try {
            const { deptId } = req.params;
            const devices = citySimulation.devices;
            const departmentData = departmentService.formatDataForDepartment(devices, deptId);
            
            if (!departmentData) {
                return res.status(404).json({
                    success: false,
                    error: 'Department not found'
                });
            }

            res.json({
                success: true,
                data: departmentData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get department-specific alerts
    router.get('/departments/:deptId/alerts', (req, res) => {
        try {
            const { deptId } = req.params;
            const devices = citySimulation.devices;
            const relevantDevices = departmentService.filterDevicesForDepartment(devices, deptId);
            const alerts = departmentService.checkDeviceAlerts(relevantDevices, deptId);
            
            res.json({
                success: true,
                data: {
                    department: deptId,
                    alertCount: alerts.length,
                    alerts: alerts
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Get real-time dashboard data for specific department
    router.get('/departments/:deptId/dashboard', (req, res) => {
        try {
            const { deptId } = req.params;
            const devices = citySimulation.devices;
            const departmentData = departmentService.formatDataForDepartment(devices, deptId);
            
            if (!departmentData) {
                return res.status(404).json({
                    success: false,
                    error: 'Department not found'
                });
            }

            // Add real-time statistics
            const dashboard = {
                ...departmentData,
                statistics: generateDepartmentStatistics(departmentData, deptId),
                recentActivity: getRecentActivity(departmentData.devices),
                performanceMetrics: getPerformanceMetrics(departmentData.devices, deptId)
            };

            res.json({
                success: true,
                data: dashboard
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Chennai Police Department specific routes
    router.get('/police', (req, res) => {
        try {
            const devices = citySimulation.devices;
            const policeData = departmentService.formatDataForDepartment(devices, 'chennai_police');
            
            res.json({
                success: true,
                data: policeData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Police traffic control data
    router.get('/police/traffic', (req, res) => {
        try {
            const devices = citySimulation.devices;
            const trafficDevices = devices.filter(device => 
                device.type === 'TrafficSensor' || device.constructor.name === 'TrafficSensor'
            );
            
            const trafficData = trafficDevices.map(device => {
                const data = device.generateData();
                return {
                    id: device.id,
                    location: device.location,
                    status: device.status,
                    ...data.traffic
                };
            });

            res.json({
                success: true,
                data: {
                    timestamp: new Date(),
                    totalSensors: trafficData.length,
                    trafficData: trafficData
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Police CCTV data
    router.get('/police/cctv', (req, res) => {
        try {
            const devices = citySimulation.devices;
            const cctvDevices = devices.filter(device => 
                device.type === 'CCTV' || device.constructor.name === 'CCTV'
            );
            
            const cctvData = cctvDevices.map(device => {
                const data = device.generateData();
                return {
                    id: device.id,
                    location: device.location,
                    status: device.status,
                    resolution: device.resolution,
                    detections: data.videoFrame?.detections || {},
                    incidents: data.videoFrame?.detections?.incidents || []
                };
            });

            res.json({
                success: true,
                data: {
                    timestamp: new Date(),
                    totalCameras: cctvData.length,
                    cctvData: cctvData
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Urbaser Cleaning Department routes
    router.get('/cleaning', (req, res) => {
        try {
            const devices = citySimulation.devices;
            const cleaningData = departmentService.formatDataForDepartment(devices, 'urbaser_cleaning');
            
            res.json({
                success: true,
                data: cleaningData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Waste collection routes
    router.get('/cleaning/waste-bins', (req, res) => {
        try {
            const devices = citySimulation.devices;
            const wasteBins = devices.filter(device => 
                device.type === 'WasteBin' || device.constructor.name === 'WasteBinSensor'
            );
            
            const wasteData = wasteBins.map(device => {
                const data = device.generateData();
                return {
                    id: device.id,
                    location: device.location,
                    status: device.status,
                    ...data.waste,
                    priority: data.waste?.needsCollection ? 'high' : 'normal'
                };
            });

            res.json({
                success: true,
                data: {
                    timestamp: new Date(),
                    totalBins: wasteData.length,
                    binsNeedingCollection: wasteData.filter(bin => bin.needsCollection).length,
                    wasteData: wasteData
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // TNPCB Environment Department routes
    router.get('/environment', (req, res) => {
        try {
            const devices = citySimulation.devices;
            const environmentData = departmentService.formatDataForDepartment(devices, 'tnpcb_environment');
            
            res.json({
                success: true,
                data: environmentData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Air quality data
    router.get('/environment/air-quality', (req, res) => {
        try {
            const devices = citySimulation.devices;
            const pollutionSensors = devices.filter(device => 
                device.type === 'PollutionSensor' || device.constructor.name === 'PollutionSensor'
            );
            
            const airQualityData = pollutionSensors.map(device => {
                const data = device.generateData();
                return {
                    id: device.id,
                    location: device.location,
                    status: device.status,
                    ...data.airQuality
                };
            });

            res.json({
                success: true,
                data: {
                    timestamp: new Date(),
                    totalSensors: airQualityData.length,
                    averageAQI: airQualityData.reduce((sum, sensor) => sum + (sensor.aqi || 0), 0) / airQualityData.length,
                    airQualityData: airQualityData
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Chennai Municipal Corporation routes
    router.get('/municipal', (req, res) => {
        try {
            const devices = citySimulation.devices;
            const municipalData = departmentService.formatDataForDepartment(devices, 'chennai_municipal');
            
            res.json({
                success: true,
                data: municipalData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Street lighting data
    router.get('/municipal/streetlights', (req, res) => {
        try {
            const devices = citySimulation.devices;
            const streetlights = devices.filter(device => 
                device.type === 'Streetlight' || device.constructor.name === 'SmartStreetlight'
            );
            
            const lightingData = streetlights.map(device => {
                const data = device.generateData();
                return {
                    id: device.id,
                    location: device.location,
                    status: device.status,
                    ...data.lighting,
                    smallCell: data.smallCell
                };
            });

            res.json({
                success: true,
                data: {
                    timestamp: new Date(),
                    totalLights: lightingData.length,
                    activeLights: lightingData.filter(light => light.brightness > 0).length,
                    totalEnergyConsumption: lightingData.reduce((sum, light) => sum + (light.energyConsumption || 0), 0),
                    lightingData: lightingData
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Webhook for departments to receive data
    router.post('/departments/:deptId/webhook', (req, res) => {
        try {
            const { deptId } = req.params;
            const department = departmentService.getDepartment(deptId);
            
            if (!department) {
                return res.status(404).json({
                    success: false,
                    error: 'Department not found'
                });
            }

            // Log the webhook data
            console.log(`Webhook data received for ${department.name}:`, req.body);
            
            res.json({
                success: true,
                message: `Data received for ${department.name}`,
                timestamp: new Date()
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

// Helper functions
function generateDepartmentStatistics(departmentData, deptId) {
    const stats = {
        deviceUptime: calculateUptime(departmentData.devices),
        responseTime: Math.random() * 100 + 50, // ms
        dataAccuracy: 95 + Math.random() * 5, // percentage
    };

    if (deptId === 'chennai_police') {
        stats.incidentsToday = Math.floor(Math.random() * 10);
        stats.trafficFlowEfficiency = 80 + Math.random() * 15;
        stats.surveillanceCoverage = 90 + Math.random() * 8;
    } else if (deptId === 'urbaser_cleaning') {
        stats.collectionsToday = Math.floor(Math.random() * 50) + 20;
        stats.routeEfficiency = 85 + Math.random() * 10;
        stats.averageFillLevel = 40 + Math.random() * 30;
    } else if (deptId === 'tnpcb_environment') {
        stats.pollutionTrend = Math.random() > 0.5 ? 'improving' : 'stable';
        stats.complianceRate = 90 + Math.random() * 8;
        stats.alertsResolved = Math.floor(Math.random() * 15) + 5;
    } else if (deptId === 'chennai_municipal') {
        stats.energyEfficiency = 80 + Math.random() * 15;
        stats.maintenanceRequests = Math.floor(Math.random() * 20) + 5;
        stats.serviceAvailability = 95 + Math.random() * 4;
    }

    return stats;
}

function calculateUptime(devices) {
    if (!devices.length) return 100;
    const onlineDevices = devices.filter(d => d.status === 'online').length;
    return (onlineDevices / devices.length) * 100;
}

function getRecentActivity(devices) {
    return devices
        .filter(device => device.status === 'online')
        .slice(0, 5)
        .map(device => ({
            deviceId: device.id,
            type: device.type,
            activity: 'Data updated',
            timestamp: new Date(Date.now() - Math.random() * 3600000) // Random time in last hour
        }));
}

function getPerformanceMetrics(devices, deptId) {
    const metrics = {
        totalDevices: devices.length,
        activeDevices: devices.filter(d => d.status === 'online').length,
        averageBattery: devices.reduce((sum, d) => sum + d.batteryLevel, 0) / devices.length || 0
    };

    if (deptId === 'chennai_police') {
        metrics.detectionRate = 85 + Math.random() * 10;
        metrics.responseTime = 120 + Math.random() * 60; // seconds
    } else if (deptId === 'urbaser_cleaning') {
        metrics.collectionEfficiency = 90 + Math.random() * 8;
        metrics.routeOptimization = 85 + Math.random() * 10;
    }

    return metrics;
}
