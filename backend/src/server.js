const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const CitySimulation = require('./services/CitySimulation');
const cityRoutes = require('./routes/cityRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize city simulation
const citySimulation = new CitySimulation();

// Routes
app.use('/api/city', cityRoutes(citySimulation));

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Smart City Communication Hub API',
        version: '1.0.0',
        endpoints: [
            'GET /api/health - Health check',
            'GET /api/city/status - City status',
            'GET /api/city/devices - All devices',
            'GET /api/city/edge-nodes - Edge nodes',
            'GET /api/city/alerts - Security alerts',
            'WebSocket /socket.io - Real-time updates'
        ]
    });
});

// Add a direct devices endpoint for convenience
app.get('/api/devices', (req, res) => {
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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime(),
        simulation: {
            running: citySimulation.isRunning,
            devices: citySimulation.devices.length,
            edgeNodes: citySimulation.edgeNodes.length
        }
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send initial city state to new client
    const initialState = {
        devices: citySimulation.devices.map(device => ({
            id: device.id,
            type: device.type.name,
            location: device.location,
            networkType: device.networkType,
            status: device.status,
            batteryLevel: device.batteryLevel,
            connectedEdgeNode: device.connectedEdgeNode
        })),
        edgeNodes: citySimulation.edgeNodes.map(node => ({
            id: node.id,
            name: node.name,
            location: node.location,
            status: node.status,
            connectedDevices: node.connectedDevices.length
        })),
        energyStats: citySimulation.energyStats,
        securityStatus: citySimulation.securityService.getSecurityStatus(),
        emergencyAlerts: citySimulation.emergencyAlerts
    };

    socket.emit('city_initialized', initialState);

    // Handle client commands
    socket.on('start_simulation', () => {
        if (!citySimulation.isRunning) {
            citySimulation.startSimulation(io);
            io.emit('simulation_started', { timestamp: new Date() });
            console.log('Simulation started via socket command');
        }
    });

    socket.on('stop_simulation', () => {
        if (citySimulation.isRunning) {
            citySimulation.stopSimulation();
            io.emit('simulation_stopped', { timestamp: new Date() });
            console.log('Simulation stopped via socket command');
        }
    });

    socket.on('trigger_emergency', (data) => {
        const { scenario } = data;
        console.log(`Triggering emergency scenario: ${scenario}`);
        citySimulation.triggerEmergencyScenario(scenario);
    });

    socket.on('clear_alert', (data) => {
        const { alertId } = data;
        citySimulation.clearAlert(alertId);
    });

    socket.on('request_device_data', (data) => {
        const { deviceId } = data;
        const device = citySimulation.devices.find(d => d.id === deviceId);
        if (device) {
            const deviceData = {
                id: device.id,
                type: device.type.name,
                location: device.location,
                status: device.status,
                batteryLevel: device.batteryLevel,
                networkType: device.networkType,
                currentData: device.generateData()
            };
            socket.emit('device_details', deviceData);
        }
    });

    socket.on('request_edge_node_data', (data) => {
        const { nodeId } = data;
        const edgeNode = citySimulation.edgeNodes.find(n => n.id === nodeId);
        if (edgeNode) {
            socket.emit('edge_node_details', edgeNode.getStatus());
        }
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Smart City Communication Hub Server running on port ${PORT}`);
    console.log(`📊 Dashboard URL: http://localhost:${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    
    // Auto-start simulation after server starts
    setTimeout(() => {
        console.log('🏙️  Auto-starting city simulation...');
        citySimulation.startSimulation(io);
    }, 2000);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    citySimulation.stopSimulation();
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    citySimulation.stopSimulation();
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

module.exports = { app, server, io };
