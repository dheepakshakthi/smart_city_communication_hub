const axios = require('axios');

class DepartmentService {
    constructor() {
        this.departments = {
            'chennai_police': {
                name: 'Chennai Police Department',
                devices: ['CCTV', 'TrafficSensor'],
                webhookUrl: process.env.POLICE_WEBHOOK_URL || null,
                apiEndpoint: '/api/departments/police',
                contactInfo: {
                    email: 'traffic.control@chennaicity.gov.in',
                    phone: '+91-44-2854-0500',
                    address: 'Chennai Police Headquarters, Egmore'
                },
                responsibilities: [
                    'Traffic Light Controls',
                    'CCTV Monitoring',
                    'Traffic Flow Management',
                    'Security Surveillance',
                    'Emergency Response'
                ]
            },
            'urbaser_cleaning': {
                name: 'Urbaser Sumeet Cleaning Services',
                devices: ['WasteBin'],
                webhookUrl: process.env.CLEANING_WEBHOOK_URL || null,
                apiEndpoint: '/api/departments/cleaning',
                contactInfo: {
                    email: 'operations@urbasersumeet.com',
                    phone: '+91-44-2851-2345',
                    address: 'Urbaser Sumeet Office, Chennai'
                },
                responsibilities: [
                    'Waste Collection',
                    'Street Cleaning',
                    'Bin Monitoring',
                    'Route Optimization'
                ]
            },
            'tnpcb_environment': {
                name: 'Tamil Nadu Pollution Control Board',
                devices: ['PollutionSensor', 'WaterQualitySensor', 'NoiseSensor'],
                webhookUrl: process.env.TNPCB_WEBHOOK_URL || null,
                apiEndpoint: '/api/departments/environment',
                contactInfo: {
                    email: 'monitoring@tnpcb.gov.in',
                    phone: '+91-44-2432-1267',
                    address: 'TNPCB Office, Guindy, Chennai'
                },
                responsibilities: [
                    'Air Quality Monitoring',
                    'Water Quality Assessment',
                    'Noise Level Control',
                    'Environmental Compliance',
                    'Pollution Alerts'
                ]
            },
            'chennai_municipal': {
                name: 'Greater Chennai Corporation',
                devices: ['Streetlight', 'WaterQualitySensor'],
                webhookUrl: process.env.MUNICIPAL_WEBHOOK_URL || null,
                apiEndpoint: '/api/departments/municipal',
                contactInfo: {
                    email: 'smartcity@chennaicorporation.gov.in',
                    phone: '+91-44-2854-1234',
                    address: 'Ripon Building, Chennai Corporation'
                },
                responsibilities: [
                    'Street Lighting',
                    'Public Infrastructure',
                    'Water Supply Monitoring',
                    'City Maintenance'
                ]
            }
        };

        this.alertThresholds = {
            'CCTV': {
                incidents: 1, // Alert if any incident detected
                offline_duration: 300000 // 5 minutes
            },
            'TrafficSensor': {
                congestion_level: 'high',
                offline_duration: 180000 // 3 minutes
            },
            'WasteBin': {
                fill_level: 85,
                offline_duration: 3600000 // 1 hour
            },
            'PollutionSensor': {
                aqi: 150,
                pm25: 60,
                offline_duration: 1800000 // 30 minutes
            },
            'Streetlight': {
                energy_consumption: 100, // watts
                offline_duration: 1800000 // 30 minutes
            }
        };
    }

    // Get department info by device type
    getDepartmentByDeviceType(deviceType) {
        for (const [deptId, dept] of Object.entries(this.departments)) {
            if (dept.devices.includes(deviceType)) {
                return { id: deptId, ...dept };
            }
        }
        return null;
    }

    // Get all departments
    getAllDepartments() {
        return this.departments;
    }

    // Get department by ID
    getDepartment(departmentId) {
        return this.departments[departmentId] || null;
    }

    // Filter devices by department
    filterDevicesForDepartment(devices, departmentId) {
        const department = this.getDepartment(departmentId);
        if (!department) return [];

        return devices.filter(device => 
            department.devices.some(deviceType => 
                device.type === deviceType || 
                device.type.name === deviceType ||
                device.constructor.name === deviceType
            )
        );
    }

    // Process and format data for department
    formatDataForDepartment(devices, departmentId) {
        const department = this.getDepartment(departmentId);
        if (!department) return null;

        const relevantDevices = this.filterDevicesForDepartment(devices, departmentId);
        
        return {
            department: {
                id: departmentId,
                name: department.name,
                contactInfo: department.contactInfo,
                responsibilities: department.responsibilities
            },
            timestamp: new Date().toISOString(),
            deviceCount: relevantDevices.length,
            devices: relevantDevices.map(device => this.formatDeviceData(device, departmentId)),
            summary: this.generateDepartmentSummary(relevantDevices, departmentId),
            alerts: this.checkDeviceAlerts(relevantDevices, departmentId)
        };
    }

    // Format individual device data
    formatDeviceData(device, departmentId) {
        const baseData = {
            id: device.id,
            type: device.type.name || device.type,
            location: device.location,
            status: device.status,
            batteryLevel: device.batteryLevel,
            lastUpdate: device.lastUpdate || new Date(),
            networkType: device.networkType
        };

        // Add device-specific data based on department needs
        if (departmentId === 'chennai_police') {
            if (device.type === 'CCTV' || device.constructor.name === 'CCTV') {
                const data = device.generateData();
                baseData.cctv = {
                    resolution: device.resolution,
                    detections: data.videoFrame?.detections || {},
                    incidents: data.videoFrame?.detections?.incidents || []
                };
            } else if (device.type === 'TrafficSensor' || device.constructor.name === 'TrafficSensor') {
                const data = device.generateData();
                baseData.traffic = {
                    speed: data.traffic?.speed || 0,
                    vehicleCount: data.traffic?.vehicleCount || 0,
                    congestionLevel: data.traffic?.congestionLevel || 'low',
                    vehicleTypes: data.traffic?.vehicleTypes || {}
                };
            }
        } else if (departmentId === 'urbaser_cleaning') {
            if (device.type === 'WasteBin' || device.constructor.name === 'WasteBinSensor') {
                const data = device.generateData();
                baseData.waste = {
                    fillLevel: data.waste?.fillLevel || 0,
                    needsCollection: data.waste?.needsCollection || false,
                    lastEmptied: data.waste?.lastEmptied || null,
                    temperature: data.waste?.temperature || 20
                };
            }
        } else if (departmentId === 'tnpcb_environment') {
            if (device.type === 'PollutionSensor' || device.constructor.name === 'PollutionSensor') {
                const data = device.generateData();
                baseData.pollution = data.airQuality || {};
            }
        } else if (departmentId === 'chennai_municipal') {
            if (device.type === 'Streetlight' || device.constructor.name === 'SmartStreetlight') {
                const data = device.generateData();
                baseData.lighting = data.lighting || {};
                baseData.smallCell = data.smallCell || {};
            }
        }

        return baseData;
    }

    // Generate department summary
    generateDepartmentSummary(devices, departmentId) {
        const summary = {
            totalDevices: devices.length,
            onlineDevices: devices.filter(d => d.status === 'online').length,
            offlineDevices: devices.filter(d => d.status === 'offline').length,
            lowBatteryDevices: devices.filter(d => d.status === 'low_battery').length
        };

        // Department-specific summaries
        if (departmentId === 'chennai_police') {
            const cctvDevices = devices.filter(d => d.type === 'CCTV' || d.constructor.name === 'CCTV');
            const trafficDevices = devices.filter(d => d.type === 'TrafficSensor' || d.constructor.name === 'TrafficSensor');
            
            summary.cctv = {
                total: cctvDevices.length,
                active: cctvDevices.filter(d => d.status === 'online').length,
                incidentsDetected: 0 // Will be calculated from live data
            };
            
            summary.traffic = {
                total: trafficDevices.length,
                active: trafficDevices.filter(d => d.status === 'online').length,
                highCongestionAreas: 0 // Will be calculated from live data
            };
        } else if (departmentId === 'urbaser_cleaning') {
            const wasteBins = devices.filter(d => d.type === 'WasteBin' || d.constructor.name === 'WasteBinSensor');
            summary.wasteBins = {
                total: wasteBins.length,
                needingCollection: 0, // Will be calculated from live data
                averageFillLevel: 0 // Will be calculated from live data
            };
        } else if (departmentId === 'tnpcb_environment') {
            const pollutionSensors = devices.filter(d => d.type === 'PollutionSensor' || d.constructor.name === 'PollutionSensor');
            summary.environment = {
                total: pollutionSensors.length,
                active: pollutionSensors.filter(d => d.status === 'online').length,
                alertsActive: 0 // Will be calculated from live data
            };
        } else if (departmentId === 'chennai_municipal') {
            const streetlights = devices.filter(d => d.type === 'Streetlight' || d.constructor.name === 'SmartStreetlight');
            summary.lighting = {
                total: streetlights.length,
                active: streetlights.filter(d => d.status === 'online').length,
                energyConsumption: 0 // Will be calculated from live data
            };
        }

        return summary;
    }

    // Check for alerts based on department thresholds
    checkDeviceAlerts(devices, departmentId) {
        const alerts = [];
        const now = Date.now();

        devices.forEach(device => {
            const deviceType = device.type.name || device.type;
            const thresholds = this.alertThresholds[deviceType];
            
            if (!thresholds) return;

            // Check offline duration
            if (device.status === 'offline') {
                const offlineDuration = now - (device.lastUpdate?.getTime() || now);
                if (offlineDuration > thresholds.offline_duration) {
                    alerts.push({
                        type: 'device_offline',
                        deviceId: device.id,
                        deviceType: deviceType,
                        severity: 'high',
                        message: `Device ${device.id} has been offline for ${Math.round(offlineDuration / 60000)} minutes`,
                        timestamp: new Date()
                    });
                }
            }

            // Device-specific alerts
            try {
                const data = device.generateData();
                
                if (deviceType === 'CCTV' && data.videoFrame?.detections?.incidents?.length > 0) {
                    alerts.push({
                        type: 'security_incident',
                        deviceId: device.id,
                        deviceType: deviceType,
                        severity: 'critical',
                        message: `Security incident detected: ${data.videoFrame.detections.incidents.join(', ')}`,
                        location: device.location,
                        timestamp: new Date()
                    });
                }
                
                if (deviceType === 'TrafficSensor' && data.traffic?.congestionLevel === 'high') {
                    alerts.push({
                        type: 'traffic_congestion',
                        deviceId: device.id,
                        deviceType: deviceType,
                        severity: 'medium',
                        message: `High traffic congestion detected`,
                        location: device.location,
                        timestamp: new Date()
                    });
                }
                
                if (deviceType === 'WasteBin' && data.waste?.fillLevel > thresholds.fill_level) {
                    alerts.push({
                        type: 'waste_collection_needed',
                        deviceId: device.id,
                        deviceType: deviceType,
                        severity: 'medium',
                        message: `Waste bin is ${data.waste.fillLevel}% full and needs collection`,
                        location: device.location,
                        timestamp: new Date()
                    });
                }
                
                if (deviceType === 'PollutionSensor' && data.airQuality?.aqi > thresholds.aqi) {
                    alerts.push({
                        type: 'pollution_alert',
                        deviceId: device.id,
                        deviceType: deviceType,
                        severity: 'high',
                        message: `Air Quality Index exceeds safe levels: ${data.airQuality.aqi}`,
                        location: device.location,
                        timestamp: new Date()
                    });
                }
            } catch (error) {
                // Skip if device data generation fails
                console.warn(`Failed to generate data for device ${device.id}:`, error.message);
            }
        });

        return alerts;
    }

    // Send data to department webhook
    async sendToDepartmentWebhook(departmentId, data) {
        const department = this.getDepartment(departmentId);
        
        if (!department || !department.webhookUrl) {
            console.log(`No webhook configured for department: ${departmentId}`);
            return { success: false, error: 'No webhook configured' };
        }

        try {
            const response = await axios.post(department.webhookUrl, {
                department: departmentId,
                timestamp: new Date().toISOString(),
                data: data
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Smart-City-Hub/1.0'
                }
            });

            console.log(`Data sent to ${department.name} webhook successfully`);
            return { success: true, status: response.status };
        } catch (error) {
            console.error(`Failed to send data to ${department.name} webhook:`, error.message);
            return { success: false, error: error.message };
        }
    }

    // Broadcast to all relevant department webhooks
    async broadcastToAllDepartments(devices) {
        const results = {};
        
        for (const [deptId, dept] of Object.entries(this.departments)) {
            const departmentData = this.formatDataForDepartment(devices, deptId);
            if (departmentData && departmentData.deviceCount > 0) {
                results[deptId] = await this.sendToDepartmentWebhook(deptId, departmentData);
            }
        }
        
        return results;
    }
}

module.exports = DepartmentService;
