const crypto = require('crypto');

class SmartDevice {
    constructor(id, type, location, networkType, energyDraw = 10) {
        this.id = id;
        this.type = type;
        this.location = location; // { lat, lon }
        this.networkType = networkType; // '5G', 'WiFi6', 'LPWAN'
        this.energyDraw = energyDraw; // watts per hour
        this.status = 'online';
        this.lastUpdate = new Date();
        this.batteryLevel = 100;
    }

    generateData() {
        return {
            deviceId: this.id,
            timestamp: new Date(),
            status: this.status,
            batteryLevel: this.batteryLevel,
            location: this.location
        };
    }

    updateBattery() {
        // Simulate battery drain based on network type
        const drainRates = { '5G': 0.5, 'WiFi6': 0.3, 'LPWAN': 0.1 };
        this.batteryLevel = Math.max(0, this.batteryLevel - drainRates[this.networkType]);
        
        if (this.batteryLevel < 10) {
            this.status = 'low_battery';
        } else if (this.batteryLevel === 0) {
            this.status = 'offline';
        }
    }

    encrypt(data) {
        const algorithm = 'aes-256-cbc';
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        
        const cipher = crypto.createCipher(algorithm, key);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        return {
            encrypted: encrypted,
            algorithm: algorithm,
            keyHash: crypto.createHash('md5').update(key).digest('hex').substring(0, 8)
        };
    }
}

class CCTV extends SmartDevice {
    constructor(id, location) {
        super(id, 'CCTV', location, '5G', 25);
        this.resolution = '4K';
        this.detectionCapabilities = ['vehicle_count', 'pedestrian_count', 'incident_detection'];
    }

    generateData() {
        const baseData = super.generateData();
        return {
            ...baseData,
            videoFrame: {
                resolution: this.resolution,
                frameRate: 30,
                dataSize: Math.floor(Math.random() * 500) + 1000, // KB
                detections: {
                    vehicles: Math.floor(Math.random() * 20),
                    pedestrians: Math.floor(Math.random() * 15),
                    incidents: Math.random() < 0.05 ? ['suspicious_activity'] : []
                }
            }
        };
    }
}

class TrafficSensor extends SmartDevice {
    constructor(id, location) {
        super(id, 'TrafficSensor', location, 'WiFi6', 15);
        this.sensorTypes = ['speed', 'count', 'classification'];
    }

    generateData() {
        const baseData = super.generateData();
        return {
            ...baseData,
            traffic: {
                speed: Math.floor(Math.random() * 60) + 20, // km/h
                vehicleCount: Math.floor(Math.random() * 50),
                averageSpeed: Math.floor(Math.random() * 45) + 30,
                congestionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                vehicleTypes: {
                    cars: Math.floor(Math.random() * 30),
                    trucks: Math.floor(Math.random() * 5),
                    buses: Math.floor(Math.random() * 3),
                    motorcycles: Math.floor(Math.random() * 10)
                }
            }
        };
    }
}

class WasteBinSensor extends SmartDevice {
    constructor(id, location) {
        super(id, 'WasteBin', location, 'LPWAN', 5);
        this.capacity = 100; // liters
        this.fillLevel = Math.floor(Math.random() * 100);
    }

    generateData() {
        const baseData = super.generateData();
        // Simulate gradual filling
        this.fillLevel = Math.min(100, this.fillLevel + Math.random() * 2);
        
        return {
            ...baseData,
            waste: {
                fillLevel: this.fillLevel,
                capacity: this.capacity,
                temperature: Math.floor(Math.random() * 15) + 20,
                lastEmptied: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                needsCollection: this.fillLevel > 80
            }
        };
    }
}

class SmartStreetlight extends SmartDevice {
    constructor(id, location) {
        super(id, 'Streetlight', location, '5G', 45);
        this.brightness = 100;
        this.motionDetector = true;
        this.isSmallCell = true; // Acts as 5G small cell
    }

    generateData() {
        const baseData = super.generateData();
        // Adjust brightness based on time and motion
        const hour = new Date().getHours();
        const isDark = hour < 6 || hour > 20;
        const motionDetected = Math.random() < 0.3;
        
        this.brightness = isDark ? (motionDetected ? 100 : 50) : 0;
        
        return {
            ...baseData,
            lighting: {
                brightness: this.brightness,
                motionDetected: motionDetected,
                energyConsumption: this.brightness * 0.45, // watts
                operatingMode: isDark ? 'night' : 'day'
            },
            smallCell: {
                isActive: true,
                connectedDevices: Math.floor(Math.random() * 20),
                dataTraffic: Math.floor(Math.random() * 1000), // MB
                signalStrength: -Math.floor(Math.random() * 30) - 50 // dBm
            }
        };
    }
}

class PollutionSensor extends SmartDevice {
    constructor(id, location) {
        super(id, 'PollutionSensor', location, 'WiFi6', 12);
        this.sensors = ['PM2.5', 'PM10', 'NO2', 'CO', 'O3', 'SO2'];
    }

    generateData() {
        const baseData = super.generateData();
        return {
            ...baseData,
            airQuality: {
                pm25: Math.floor(Math.random() * 50) + 10, // µg/m³
                pm10: Math.floor(Math.random() * 80) + 20,
                no2: Math.floor(Math.random() * 40) + 10,
                co: Math.floor(Math.random() * 2) + 1,
                o3: Math.floor(Math.random() * 60) + 20,
                so2: Math.floor(Math.random() * 20) + 5,
                aqi: Math.floor(Math.random() * 150) + 50,
                temperature: Math.floor(Math.random() * 25) + 15,
                humidity: Math.floor(Math.random() * 40) + 40,
                windSpeed: Math.floor(Math.random() * 20) + 5
            }
        };
    }
}

module.exports = {
    SmartDevice,
    CCTV,
    TrafficSensor,
    WasteBinSensor,
    SmartStreetlight,
    PollutionSensor
};
