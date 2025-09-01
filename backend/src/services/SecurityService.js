const crypto = require('crypto');

class SecurityService {
    constructor() {
        this.alertThreshold = {
            anomalousPacketSize: 1000, // bytes
            unusualDataFrequency: 10, // requests per minute
            suspiciousPatterns: ['sql_injection', 'xss_attempt', 'ddos_pattern'],
            failedAuthAttempts: 5
        };
        this.activeAlerts = [];
        this.securityLog = [];
        this.deviceAuthTokens = new Map();
        this.encryptionKeys = new Map();
    }

    // Intrusion Detection System (IDS)
    analyzePacket(packet, deviceId) {
        const alerts = [];
        const packetSize = this.calculatePacketSize(packet);
        
        // Rule 1: Check packet size anomalies
        if (packetSize > this.alertThreshold.anomalousPacketSize) {
            alerts.push({
                type: 'anomalous_packet_size',
                severity: 'medium',
                message: `Unusually large packet from device ${deviceId}: ${packetSize} bytes`,
                deviceId: deviceId,
                timestamp: new Date()
            });
        }

        // Rule 2: Check for suspicious payload patterns
        const payloadString = JSON.stringify(packet);
        if (this.containsSuspiciousPatterns(payloadString)) {
            alerts.push({
                type: 'suspicious_payload',
                severity: 'high',
                message: `Suspicious payload detected from device ${deviceId}`,
                deviceId: deviceId,
                timestamp: new Date()
            });
        }

        // Rule 3: Check device type vs packet content consistency
        if (this.isInconsistentDeviceData(packet, deviceId)) {
            alerts.push({
                type: 'data_inconsistency',
                severity: 'medium',
                message: `Data inconsistent with device type for ${deviceId}`,
                deviceId: deviceId,
                timestamp: new Date()
            });
        }

        // Rule 4: Check for timestamp manipulation
        if (this.hasTimestampAnomaly(packet)) {
            alerts.push({
                type: 'timestamp_anomaly',
                severity: 'low',
                message: `Timestamp anomaly detected from device ${deviceId}`,
                deviceId: deviceId,
                timestamp: new Date()
            });
        }

        // Process alerts
        alerts.forEach(alert => this.processAlert(alert));

        return {
            isSecure: alerts.length === 0,
            alerts: alerts,
            riskLevel: this.calculateRiskLevel(alerts)
        };
    }

    processAlert(alert) {
        this.activeAlerts.push(alert);
        this.logSecurityEvent(alert);
        
        // Auto-response for high severity alerts
        if (alert.severity === 'high') {
            this.initiateSecurityResponse(alert);
        }

        // Keep only last 1000 alerts
        if (this.activeAlerts.length > 1000) {
            this.activeAlerts = this.activeAlerts.slice(-1000);
        }
    }

    initiateSecurityResponse(alert) {
        // Simulate security responses
        const responses = {
            'suspicious_payload': 'Device temporarily quarantined',
            'anomalous_packet_size': 'Enhanced monitoring activated',
            'potential_breach': 'Security team notified, access restricted'
        };

        const response = {
            alertId: alert.timestamp.getTime(),
            action: responses[alert.type] || 'Manual review required',
            timestamp: new Date(),
            status: 'executed'
        };

        this.logSecurityEvent({
            type: 'security_response',
            message: `Automated response: ${response.action}`,
            originalAlert: alert,
            response: response,
            timestamp: new Date()
        });
    }

    // End-to-End Encryption
    encryptData(data, deviceId) {
        try {
            const algorithm = 'aes-256-cbc';
            const key = crypto.createHash('sha256').update(this.getDeviceKey(deviceId)).digest();
            const iv = crypto.randomBytes(16);
            
            const cipher = crypto.createCipheriv(algorithm, key, iv);
            
            let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            return {
                encryptedData: encrypted,
                iv: iv.toString('hex'),
                algorithm: algorithm,
                keyId: crypto.createHash('md5').update(key).digest('hex').substring(0, 8),
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    }

    decryptData(encryptedPacket, deviceId) {
        try {
            const key = crypto.createHash('sha256').update(this.getDeviceKey(deviceId)).digest();
            const decipher = crypto.createDecipheriv(encryptedPacket.algorithm, key, Buffer.from(encryptedPacket.iv, 'hex'));
            
            let decrypted = decipher.update(encryptedPacket.encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Decryption error:', error);
            this.processAlert({
                type: 'decryption_failure',
                severity: 'high',
                message: `Failed to decrypt data from device ${deviceId}`,
                deviceId: deviceId,
                timestamp: new Date()
            });
            return null;
        }
    }

    // Device Authentication
    authenticateDevice(deviceId, token) {
        const storedToken = this.deviceAuthTokens.get(deviceId);
        if (!storedToken) {
            this.generateDeviceToken(deviceId);
            return false;
        }
        
        const isValid = crypto.timingSafeEqual(
            Buffer.from(token, 'hex'),
            Buffer.from(storedToken, 'hex')
        );
        
        if (!isValid) {
            this.processAlert({
                type: 'authentication_failure',
                severity: 'medium',
                message: `Authentication failed for device ${deviceId}`,
                deviceId: deviceId,
                timestamp: new Date()
            });
        }
        
        return isValid;
    }

    generateDeviceToken(deviceId) {
        const token = crypto.randomBytes(32).toString('hex');
        this.deviceAuthTokens.set(deviceId, token);
        return token;
    }

    getDeviceKey(deviceId) {
        if (!this.encryptionKeys.has(deviceId)) {
            const key = crypto.randomBytes(32);
            this.encryptionKeys.set(deviceId, key);
        }
        return this.encryptionKeys.get(deviceId);
    }

    // Helper methods for IDS rules
    calculatePacketSize(packet) {
        return JSON.stringify(packet).length;
    }

    containsSuspiciousPatterns(payloadString) {
        const suspiciousPatterns = [
            /SELECT.*FROM/i,  // SQL injection attempt
            /<script.*>.*<\/script>/i,  // XSS attempt
            /union.*select/i,  // SQL injection
            /javascript:/i,  // XSS attempt
            /\.\.\/\.\.\//i,  // Directory traversal
            /cmd=.*|exec=.*|system=/i  // Command injection
        ];

        return suspiciousPatterns.some(pattern => pattern.test(payloadString));
    }

    isInconsistentDeviceData(packet, deviceId) {
        // Check if device is sending data inconsistent with its type
        const deviceType = this.inferDeviceType(deviceId);
        
        // Example: WasteBin shouldn't send video data
        if (deviceType === 'WasteBin' && packet.videoFrame) {
            return true;
        }
        
        // Example: CCTV shouldn't send air quality data
        if (deviceType === 'CCTV' && packet.airQuality) {
            return true;
        }
        
        return false;
    }

    hasTimestampAnomaly(packet) {
        if (!packet.timestamp) return true;
        
        const now = new Date();
        const packetTime = new Date(packet.timestamp);
        const timeDiff = Math.abs(now - packetTime);
        
        // Alert if timestamp is more than 5 minutes off
        return timeDiff > 5 * 60 * 1000;
    }

    inferDeviceType(deviceId) {
        // Simple heuristic based on device ID pattern
        if (deviceId.includes('cctv')) return 'CCTV';
        if (deviceId.includes('traffic')) return 'TrafficSensor';
        if (deviceId.includes('waste')) return 'WasteBin';
        if (deviceId.includes('light')) return 'Streetlight';
        if (deviceId.includes('pollution')) return 'PollutionSensor';
        return 'Unknown';
    }

    calculateRiskLevel(alerts) {
        if (alerts.length === 0) return 'low';
        
        const severityScores = { 'low': 1, 'medium': 3, 'high': 5 };
        const totalScore = alerts.reduce((sum, alert) => sum + severityScores[alert.severity], 0);
        
        if (totalScore >= 10) return 'high';
        if (totalScore >= 5) return 'medium';
        return 'low';
    }

    logSecurityEvent(event) {
        this.securityLog.push({
            ...event,
            logId: crypto.randomBytes(8).toString('hex'),
            loggedAt: new Date()
        });

        // Keep only last 10000 log entries
        if (this.securityLog.length > 10000) {
            this.securityLog = this.securityLog.slice(-10000);
        }
    }

    // Simulate network security monitoring
    simulateNetworkAttack() {
        const attackTypes = [
            {
                type: 'ddos_attempt',
                severity: 'high',
                message: 'Distributed Denial of Service attack detected',
                affectedDevices: Math.floor(Math.random() * 10) + 1
            },
            {
                type: 'port_scan',
                severity: 'medium', 
                message: 'Port scanning activity detected',
                affectedDevices: 1
            },
            {
                type: 'brute_force',
                severity: 'high',
                message: 'Brute force authentication attempt detected',
                affectedDevices: 1
            }
        ];

        const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
        
        this.processAlert({
            ...attack,
            deviceId: 'network_monitor',
            timestamp: new Date()
        });

        return attack;
    }

    getSecurityStatus() {
        const recentAlerts = this.activeAlerts.slice(-50);
        const criticalAlerts = recentAlerts.filter(a => a.severity === 'high');
        
        return {
            totalAlerts: this.activeAlerts.length,
            recentAlerts: recentAlerts.length,
            criticalAlerts: criticalAlerts.length,
            overallThreatLevel: this.calculateOverallThreatLevel(),
            recentSecurityEvents: this.securityLog.slice(-20),
            authenticatedDevices: this.deviceAuthTokens.size,
            encryptionStatus: 'active'
        };
    }

    calculateOverallThreatLevel() {
        const recentAlerts = this.activeAlerts.slice(-100);
        const criticalCount = recentAlerts.filter(a => a.severity === 'high').length;
        const mediumCount = recentAlerts.filter(a => a.severity === 'medium').length;
        
        if (criticalCount > 5) return 'critical';
        if (criticalCount > 2 || mediumCount > 10) return 'high';
        if (mediumCount > 5) return 'medium';
        return 'low';
    }

    clearOldAlerts() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        this.activeAlerts = this.activeAlerts.filter(alert => 
            alert.timestamp > oneHourAgo && alert.severity === 'high'
        );
    }
}

module.exports = SecurityService;
