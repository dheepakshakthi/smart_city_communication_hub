const { 
    CCTV, 
    TrafficSensor, 
    WasteBinSensor, 
    SmartStreetlight, 
    PollutionSensor 
} = require('../models/SmartDevice');
const EdgeNode = require('../models/EdgeNode');
const SecurityService = require('./SecurityService');

// Additional device types for enhanced simulation
class WaterQualitySensor {
    constructor(id, location, networkType, edgeNode) {
        this.id = id;
        this.type = 'WaterQualitySensor';
        this.location = location;
        this.networkType = networkType || 'LPWAN';
        this.edgeNode = edgeNode;
        this.status = 'online';
        this.batteryLevel = Math.floor(Math.random() * 100) + 1;
        this.lastDataUpdate = Date.now();
        this.energyDraw = 8; // watts per hour
    }

    generateData() {
        return {
            deviceId: this.id,
            timestamp: Date.now(),
            location: this.location,
            waterQuality: {
                ph: (Math.random() * 4 + 6).toFixed(2), // pH 6-10
                turbidity: (Math.random() * 10).toFixed(2), // NTU
                dissolvedOxygen: (Math.random() * 15).toFixed(2), // mg/L
                temperature: (Math.random() * 20 + 5).toFixed(1) // °C
            }
        };
    }

    updateBattery() {
        // Simulate battery drain based on network type
        const drainRates = { '5G': 0.5, 'WiFi6': 0.3, 'LPWAN': 0.1 };
        this.batteryLevel = Math.max(0, this.batteryLevel - (drainRates[this.networkType] || 0.2));
        
        if (this.batteryLevel < 10) {
            this.status = 'low_battery';
        } else if (this.batteryLevel === 0) {
            this.status = 'offline';
        }
    }

    processData() {
        if (this.status === 'offline') return null;
        return this.generateData();
    }
}

class NoiseSensor {
    constructor(id, location, networkType, edgeNode) {
        this.id = id;
        this.type = 'NoiseSensor';
        this.location = location;
        this.networkType = networkType || 'WiFi6';
        this.edgeNode = edgeNode;
        this.status = 'online';
        this.batteryLevel = Math.floor(Math.random() * 100) + 1;
        this.lastDataUpdate = Date.now();
        this.energyDraw = 12; // watts per hour
    }

    generateData() {
        return {
            deviceId: this.id,
            timestamp: Date.now(),
            location: this.location,
            noiseLevel: {
                decibels: (Math.random() * 60 + 30).toFixed(1), // 30-90 dB
                frequency: Math.floor(Math.random() * 8000 + 20), // Hz
                duration: Math.floor(Math.random() * 300 + 1) // seconds
            }
        };
    }

    updateBattery() {
        // Simulate battery drain based on network type
        const drainRates = { '5G': 0.5, 'WiFi6': 0.3, 'LPWAN': 0.1 };
        this.batteryLevel = Math.max(0, this.batteryLevel - (drainRates[this.networkType] || 0.2));
        
        if (this.batteryLevel < 10) {
            this.status = 'low_battery';
        } else if (this.batteryLevel === 0) {
            this.status = 'offline';
        }
    }

    processData() {
        if (this.status === 'offline') return null;
        return this.generateData();
    }
}

class ParkingSensor {
    constructor(id, location, networkType, edgeNode) {
        this.id = id;
        this.type = 'ParkingSensor';
        this.location = location;
        this.networkType = networkType || 'LPWAN';
        this.edgeNode = edgeNode;
        this.status = 'online';
        this.batteryLevel = Math.floor(Math.random() * 100) + 1;
        this.lastDataUpdate = Date.now();
        this.energyDraw = 5; // watts per hour
    }

    generateData() {
        return {
            deviceId: this.id,
            timestamp: Date.now(),
            location: this.location,
            parkingStatus: {
                occupied: Math.random() > 0.6, // 40% chance occupied
                vehicleType: ['car', 'motorcycle', 'truck'][Math.floor(Math.random() * 3)],
                duration: Math.floor(Math.random() * 240), // minutes
                paymentStatus: ['paid', 'unpaid', 'expired'][Math.floor(Math.random() * 3)]
            }
        };
    }

    updateBattery() {
        // Simulate battery drain based on network type
        const drainRates = { '5G': 0.5, 'WiFi6': 0.3, 'LPWAN': 0.1 };
        this.batteryLevel = Math.max(0, this.batteryLevel - (drainRates[this.networkType] || 0.2));
        
        if (this.batteryLevel < 10) {
            this.status = 'low_battery';
        } else if (this.batteryLevel === 0) {
            this.status = 'offline';
        }
    }

    processData() {
        if (this.status === 'offline') return null;
        return this.generateData();
    }
}

class CitySimulation {
    constructor() {
        this.devices = [];
        this.edgeNodes = [];
        this.securityService = new SecurityService();
        this.isRunning = false;
        this.energyStats = {
            totalConsumption: 0,
            cloudDataSaved: 0,
            co2Reduction: 0
        };
        this.emergencyAlerts = [];
        this.setupCity();
    }

    setupCity() {
        // Define city grid coordinates (simulating a 5x5 km area in downtown)
        const cityBounds = {
            north: 40.7589,  // North boundary
            south: 40.7489,  // South boundary  
            east: -73.9741,  // East boundary
            west: -73.9841   // West boundary
        };

        // Create edge computing nodes (strategically placed)
        this.createEdgeNodes(cityBounds);
        
        // Create IoT devices throughout the city
        this.createSmartDevices(cityBounds);
        
        // Connect devices to nearest edge nodes
        this.connectDevicesToEdgeNodes();

        console.log(`City simulation initialized with ${this.devices.length} devices and ${this.edgeNodes.length} edge nodes`);
    }

    createEdgeNodes(bounds) {
        const edgeNodeLocations = [
            { lat: 40.7559, lon: -73.9781, name: "Downtown Hub" },
            { lat: 40.7519, lon: -73.9801, name: "Business District" },
            { lat: 40.7579, lon: -73.9761, name: "Residential North" },
            { lat: 40.7509, lon: -73.9781, name: "Industrial South" },
            { lat: 40.7539, lon: -73.9821, name: "Transport Junction" }
        ];

        edgeNodeLocations.forEach((location, index) => {
            const edgeNode = new EdgeNode(
                `edge_node_${index + 1}`,
                { lat: location.lat, lon: location.lon },
                1500 + (index * 200) // Varying processing power
            );
            edgeNode.name = location.name;
            this.edgeNodes.push(edgeNode);
        });
    }

    createSmartDevices(bounds) {
        const deviceConfigs = [
            // CCTV Cameras (18 units)
            { type: CCTV, count: 18, prefix: 'cctv_cam' },
            // Traffic Sensors (14 units)
            { type: TrafficSensor, count: 14, prefix: 'traffic_sensor' },
            // Waste Bin Sensors (22 units)
            { type: WasteBinSensor, count: 22, prefix: 'waste_bin' },
            // Smart Streetlights (26 units)
            { type: SmartStreetlight, count: 26, prefix: 'smart_light' },
            // Pollution Sensors (10 units)
            { type: PollutionSensor, count: 10, prefix: 'pollution_sensor' },
            // Water Quality Sensors (8 units)
            { type: WaterQualitySensor, count: 8, prefix: 'water_quality' },
            // Noise Sensors (12 units)
            { type: NoiseSensor, count: 12, prefix: 'noise_sensor' },
            // Parking Sensors (16 units)
            { type: ParkingSensor, count: 16, prefix: 'parking_sensor' }
        ];

        deviceConfigs.forEach(config => {
            for (let i = 0; i < config.count; i++) {
                const location = this.generateRandomLocation(bounds);
                const deviceId = `${config.prefix}_${i + 1}`;
                // Choose random network type
                const networkTypes = ['5G', 'Wi-Fi 6', 'LPWAN'];
                const networkType = networkTypes[Math.floor(Math.random() * networkTypes.length)];
                
                const device = new config.type(deviceId, location, networkType);
                this.devices.push(device);
            }
        });
    }

    generateRandomLocation(bounds) {
        return {
            lat: bounds.south + (Math.random() * (bounds.north - bounds.south)),
            lon: bounds.west + (Math.random() * (bounds.east - bounds.west))
        };
    }

    connectDevicesToEdgeNodes() {
        this.devices.forEach(device => {
            const nearestEdgeNode = this.findNearestEdgeNode(device.location);
            nearestEdgeNode.connectDevice(device);
            device.connectedEdgeNode = nearestEdgeNode.id;
        });
    }

    findNearestEdgeNode(deviceLocation) {
        let nearest = this.edgeNodes[0];
        let shortestDistance = this.calculateDistance(deviceLocation, nearest.location);

        this.edgeNodes.forEach(node => {
            const distance = this.calculateDistance(deviceLocation, node.location);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearest = node;
            }
        });

        return nearest;
    }

    calculateDistance(loc1, loc2) {
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in kilometers
        const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
        const dLon = (loc2.lon - loc1.lon) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    startSimulation(socketIO) {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.socketIO = socketIO;
        
        console.log('Starting city simulation...');
        
        // Main simulation loop - process data from all devices
        this.mainLoop = setInterval(() => {
            this.processAllDevices();
            this.updateEnergyStats();
            this.simulateRandomEvents();
        }, 2000); // Process every 2 seconds

        // Edge node maintenance loop
        this.edgeMaintenanceLoop = setInterval(() => {
            this.edgeNodes.forEach(node => node.updateCPU());
        }, 1000);

        // Security monitoring loop
        this.securityLoop = setInterval(() => {
            this.securityService.clearOldAlerts();
            // Random security event simulation
            if (Math.random() < 0.02) { // 2% chance every cycle
                this.securityService.simulateNetworkAttack();
            }
        }, 5000);

        // Battery update loop
        this.batteryLoop = setInterval(() => {
            this.devices.forEach(device => device.updateBattery());
        }, 30000); // Update every 30 seconds

        this.emitInitialState();
    }

    processAllDevices() {
        this.devices.forEach(device => {
            if (device.status === 'offline') return;

            // Generate device data
            const rawData = device.generateData();
            rawData.deviceType = device.type.name;

            // Security check
            const securityResult = this.securityService.analyzePacket(rawData, device.id);
            
            // Encrypt data (simulate end-to-end encryption)
            const encryptedData = this.securityService.encryptData(rawData, device.id);

            // Process at edge node
            const edgeNode = this.edgeNodes.find(node => node.id === device.connectedEdgeNode);
            if (edgeNode) {
                const processedData = edgeNode.processData(rawData);
                
                // Emit processed data to dashboard
                this.socketIO.emit('device_data', {
                    device: {
                        id: device.id,
                        type: device.type.name,
                        location: device.location,
                        status: device.status,
                        batteryLevel: device.batteryLevel,
                        networkType: device.networkType
                    },
                    rawData: rawData,
                    encryptedPacket: encryptedData,
                    processedData: processedData,
                    edgeNodeId: edgeNode.id,
                    security: securityResult,
                    timestamp: new Date()
                });
            }
        });

        // Emit edge node status
        this.socketIO.emit('edge_nodes_status', 
            this.edgeNodes.map(node => node.getStatus())
        );

        // Emit security status
        this.socketIO.emit('security_status', this.securityService.getSecurityStatus());
    }

    updateEnergyStats() {
        // Calculate total energy consumption
        const deviceEnergy = this.devices.reduce((total, device) => 
            total + (device.status !== 'offline' ? device.energyDraw : 0), 0
        );
        
        const edgeEnergy = this.edgeNodes.reduce((total, node) => 
            total + node.energyConsumption, 0
        );

        this.energyStats.totalConsumption = deviceEnergy + edgeEnergy;

        // Calculate cloud data savings (MB)
        this.energyStats.cloudDataSaved = this.edgeNodes.reduce((total, node) => 
            total + node.cloudDataSaved, 0
        );

        // Estimate CO2 reduction (kg per hour)
        // Assumption: 1 MB of cloud data = 0.5g CO2, edge processing saves 80% of data transfer
        this.energyStats.co2Reduction = (this.energyStats.cloudDataSaved * 0.5) / 1000;

        this.socketIO.emit('energy_stats', this.energyStats);
    }

    simulateRandomEvents() {
        // Simulate traffic incidents
        if (Math.random() < 0.01) { // 1% chance
            this.simulateTrafficIncident();
        }

        // Simulate waste collection alerts
        if (Math.random() < 0.005) { // 0.5% chance
            this.simulateWasteAlert();
        }

        // Simulate pollution spikes
        if (Math.random() < 0.008) { // 0.8% chance
            this.simulatePollutionSpike();
        }

        // Simulate device malfunctions
        if (Math.random() < 0.003) { // 0.3% chance
            this.simulateDeviceMalfunction();
        }
    }

    simulateTrafficIncident() {
        const trafficDevices = this.devices.filter(d => d.type.name === 'TrafficSensor');
        if (trafficDevices.length === 0) return;

        const device = trafficDevices[Math.floor(Math.random() * trafficDevices.length)];
        const incident = {
            id: `incident_${Date.now()}`,
            type: 'traffic_incident',
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            location: device.location,
            deviceId: device.id,
            description: 'Traffic accident detected - emergency services notified',
            timestamp: new Date(),
            estimatedClearTime: new Date(Date.now() + Math.random() * 60 * 60 * 1000) // 1 hour max
        };

        this.emergencyAlerts.push(incident);
        this.socketIO.emit('emergency_alert', incident);

        // Auto-clear after some time
        setTimeout(() => {
            this.clearAlert(incident.id);
        }, Math.random() * 300000 + 60000); // 1-6 minutes
    }

    simulateWasteAlert() {
        const wasteBins = this.devices.filter(d => d.type.name === 'WasteBinSensor');
        const fullBins = wasteBins.filter(bin => {
            const data = bin.generateData();
            return data.waste.fillLevel > 85;
        });

        if (fullBins.length > 0) {
            const bin = fullBins[Math.floor(Math.random() * fullBins.length)];
            const alert = {
                id: `waste_alert_${Date.now()}`,
                type: 'waste_collection',
                severity: 'medium',
                location: bin.location,
                deviceId: bin.id,
                description: 'Waste bin requires immediate collection',
                timestamp: new Date()
            };

            this.emergencyAlerts.push(alert);
            this.socketIO.emit('emergency_alert', alert);
        }
    }

    simulatePollutionSpike() {
        const pollutionSensors = this.devices.filter(d => d.type.name === 'PollutionSensor');
        if (pollutionSensors.length === 0) return;

        const sensor = pollutionSensors[Math.floor(Math.random() * pollutionSensors.length)];
        const alert = {
            id: `pollution_alert_${Date.now()}`,
            type: 'pollution_spike',
            severity: 'high',
            location: sensor.location,
            deviceId: sensor.id,
            description: 'Dangerous air quality levels detected - public health advisory issued',
            timestamp: new Date()
        };

        this.emergencyAlerts.push(alert);
        this.socketIO.emit('emergency_alert', alert);
    }

    simulateDeviceMalfunction() {
        const onlineDevices = this.devices.filter(d => d.status === 'online');
        if (onlineDevices.length === 0) return;

        const device = onlineDevices[Math.floor(Math.random() * onlineDevices.length)];
        device.status = 'malfunction';

        const alert = {
            id: `malfunction_${Date.now()}`,
            type: 'device_malfunction',
            severity: 'medium',
            location: device.location,
            deviceId: device.id,
            description: `${device.type.name} device malfunction detected - maintenance required`,
            timestamp: new Date()
        };

        this.emergencyAlerts.push(alert);
        this.socketIO.emit('emergency_alert', alert);

        // Auto-repair after some time
        setTimeout(() => {
            device.status = 'online';
            this.socketIO.emit('device_repaired', { deviceId: device.id });
        }, Math.random() * 600000 + 120000); // 2-12 minutes
    }

    clearAlert(alertId) {
        this.emergencyAlerts = this.emergencyAlerts.filter(alert => alert.id !== alertId);
        this.socketIO.emit('alert_cleared', { alertId });
    }

    emitInitialState() {
        // Send initial city state to dashboard
        this.socketIO.emit('city_initialized', {
            devices: this.devices.map(device => ({
                id: device.id,
                type: device.type.name,
                location: device.location,
                networkType: device.networkType,
                status: device.status,
                batteryLevel: device.batteryLevel,
                connectedEdgeNode: device.connectedEdgeNode
            })),
            edgeNodes: this.edgeNodes.map(node => ({
                id: node.id,
                name: node.name,
                location: node.location,
                status: node.status,
                connectedDevices: node.connectedDevices.length
            })),
            energyStats: this.energyStats,
            securityStatus: this.securityService.getSecurityStatus()
        });
    }

    stopSimulation() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.mainLoop);
        clearInterval(this.edgeMaintenanceLoop);
        clearInterval(this.securityLoop);
        clearInterval(this.batteryLoop);
        
        console.log('City simulation stopped');
    }

    // Manual event triggers for demo purposes
    triggerEmergencyScenario(scenarioType) {
        switch (scenarioType) {
            case 'traffic_accident':
                this.simulateTrafficIncident();
                break;
            case 'pollution_spike':
                this.simulatePollutionSpike();
                break;
            case 'security_breach':
                this.securityService.simulateNetworkAttack();
                break;
            case 'device_failure':
                this.simulateDeviceMalfunction();
                break;
            default:
                console.log('Unknown scenario type:', scenarioType);
        }
    }

    getCityStatus() {
        return {
            devices: this.devices.length,
            onlineDevices: this.devices.filter(d => d.status === 'online').length,
            edgeNodes: this.edgeNodes.length,
            activeAlerts: this.emergencyAlerts.length,
            energyStats: this.energyStats,
            securityStatus: this.securityService.getSecurityStatus(),
            isRunning: this.isRunning
        };
    }
}

module.exports = CitySimulation;
