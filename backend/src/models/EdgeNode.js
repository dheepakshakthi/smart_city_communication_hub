class EdgeNode {
    constructor(id, location, processingPower = 1000) {
        this.id = id;
        this.location = location; // { lat, lon }
        this.processingPower = processingPower; // GFLOPS
        this.connectedDevices = [];
        this.status = 'online';
        this.cpuUsage = 0;
        this.memoryUsage = 0;
        this.energyConsumption = 150; // base watts
        this.processedData = [];
        this.cloudDataSaved = 0; // MB saved by not sending to cloud
    }

    connectDevice(device) {
        if (!this.connectedDevices.find(d => d.id === device.id)) {
            this.connectedDevices.push(device);
        }
    }

    disconnectDevice(deviceId) {
        this.connectedDevices = this.connectedDevices.filter(d => d.id !== deviceId);
    }

    processData(rawData) {
        // Simulate processing time based on data type
        const processingTime = this.calculateProcessingTime(rawData);
        this.cpuUsage = Math.min(100, this.cpuUsage + (processingTime * 10));
        
        let processedData;
        
        switch (rawData.deviceType) {
            case 'CCTV':
                processedData = this.processVideoData(rawData);
                break;
            case 'TrafficSensor':
                processedData = this.processTrafficData(rawData);
                break;
            case 'PollutionSensor':
                processedData = this.processPollutionData(rawData);
                break;
            default:
                processedData = this.processGenericData(rawData);
        }

        // Calculate cloud data savings
        const originalSize = this.calculateDataSize(rawData);
        const processedSize = this.calculateDataSize(processedData);
        this.cloudDataSaved += (originalSize - processedSize) / 1024; // Convert to MB

        // Update energy consumption based on processing load
        this.energyConsumption = 150 + (this.cpuUsage * 2);

        this.processedData.push({
            timestamp: new Date(),
            original: rawData,
            processed: processedData,
            dataSaved: originalSize - processedSize,
            processingTime
        });

        // Keep only last 100 processed items
        if (this.processedData.length > 100) {
            this.processedData = this.processedData.slice(-100);
        }

        return processedData;
    }

    processVideoData(rawData) {
        // Simulate AI processing of video frame
        const videoFrame = rawData.videoFrame;
        
        return {
            deviceId: rawData.deviceId,
            timestamp: rawData.timestamp,
            location: rawData.location,
            analysis: {
                vehicleCount: videoFrame.detections.vehicles,
                pedestrianCount: videoFrame.detections.pedestrians,
                trafficFlow: this.calculateTrafficFlow(videoFrame.detections.vehicles),
                incidents: videoFrame.detections.incidents,
                alertLevel: videoFrame.detections.incidents.length > 0 ? 'high' : 'normal'
            },
            processedAt: new Date(),
            edgeNodeId: this.id
        };
    }

    processTrafficData(rawData) {
        const traffic = rawData.traffic;
        
        return {
            deviceId: rawData.deviceId,
            timestamp: rawData.timestamp,
            location: rawData.location,
            trafficSummary: {
                avgSpeed: traffic.averageSpeed,
                density: this.calculateTrafficDensity(traffic.vehicleCount),
                congestionLevel: traffic.congestionLevel,
                recommendation: this.getTrafficRecommendation(traffic),
                co2Emission: this.calculateCO2Emission(traffic)
            },
            processedAt: new Date(),
            edgeNodeId: this.id
        };
    }

    processPollutionData(rawData) {
        const airQuality = rawData.airQuality;
        
        return {
            deviceId: rawData.deviceId,
            timestamp: rawData.timestamp,
            location: rawData.location,
            pollutionSummary: {
                overallAQI: airQuality.aqi,
                healthRisk: this.assessHealthRisk(airQuality.aqi),
                dominantPollutant: this.findDominantPollutant(airQuality),
                trend: this.calculatePollutionTrend(airQuality),
                recommendations: this.getPollutionRecommendations(airQuality)
            },
            processedAt: new Date(),
            edgeNodeId: this.id
        };
    }

    processGenericData(rawData) {
        return {
            deviceId: rawData.deviceId,
            timestamp: rawData.timestamp,
            location: rawData.location,
            summary: 'Data processed at edge',
            processedAt: new Date(),
            edgeNodeId: this.id
        };
    }

    calculateProcessingTime(data) {
        // Simulate processing time based on data complexity
        const baseTime = 50; // ms
        const sizeMultiplier = this.calculateDataSize(data) / 1000;
        return baseTime + (sizeMultiplier * 10);
    }

    calculateDataSize(data) {
        // Rough estimation of data size in bytes
        return JSON.stringify(data).length;
    }

    calculateTrafficFlow(vehicleCount) {
        if (vehicleCount < 5) return 'light';
        if (vehicleCount < 15) return 'moderate';
        return 'heavy';
    }

    calculateTrafficDensity(vehicleCount) {
        return Math.min(100, vehicleCount * 2); // Density percentage
    }

    getTrafficRecommendation(traffic) {
        if (traffic.congestionLevel === 'high') {
            return 'Consider alternative routes or adjust signal timing';
        }
        return 'Traffic flow is optimal';
    }

    calculateCO2Emission(traffic) {
        // Simplified CO2 calculation based on vehicle count and speed
        const baseEmission = traffic.vehicleCount * 0.2; // kg/hour per vehicle
        const speedFactor = traffic.averageSpeed < 30 ? 1.5 : 1.0; // Higher emissions in slow traffic
        return baseEmission * speedFactor;
    }

    assessHealthRisk(aqi) {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
        if (aqi <= 200) return 'Unhealthy';
        return 'Hazardous';
    }

    findDominantPollutant(airQuality) {
        const pollutants = {
            'PM2.5': airQuality.pm25,
            'PM10': airQuality.pm10,
            'NO2': airQuality.no2,
            'CO': airQuality.co,
            'O3': airQuality.o3,
            'SO2': airQuality.so2
        };
        
        return Object.keys(pollutants).reduce((a, b) => 
            pollutants[a] > pollutants[b] ? a : b
        );
    }

    calculatePollutionTrend(airQuality) {
        // Simplified trend calculation
        const avgPollution = (airQuality.pm25 + airQuality.pm10 + airQuality.no2) / 3;
        return avgPollution > 40 ? 'increasing' : 'stable';
    }

    getPollutionRecommendations(airQuality) {
        const recommendations = [];
        if (airQuality.pm25 > 35) recommendations.push('Reduce outdoor activities');
        if (airQuality.no2 > 40) recommendations.push('Limit vehicle emissions');
        if (airQuality.aqi > 100) recommendations.push('Use air purifiers indoors');
        return recommendations;
    }

    getStatus() {
        return {
            id: this.id,
            location: this.location,
            status: this.status,
            connectedDevices: this.connectedDevices.length,
            cpuUsage: this.cpuUsage,
            memoryUsage: this.memoryUsage,
            energyConsumption: this.energyConsumption,
            cloudDataSaved: this.cloudDataSaved,
            recentProcessing: this.processedData.slice(-5)
        };
    }

    // Simulate CPU cooldown
    updateCPU() {
        this.cpuUsage = Math.max(0, this.cpuUsage - 5);
    }
}

module.exports = EdgeNode;
