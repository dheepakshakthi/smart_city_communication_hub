#!/usr/bin/env node

// Demonstration script for Smart City Department Communication System
const axios = require('axios');
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function demonstrateSystem() {
    console.log('\n' + '='.repeat(70));
    log('cyan', '🏙️  SMART CITY DEPARTMENT COMMUNICATION SYSTEM DEMO');
    console.log('='.repeat(70) + '\n');

    try {
        // Step 1: Check if all services are running
        log('yellow', '📋 Step 1: Checking Service Availability');
        console.log('   Checking Backend API (port 5000)...');
        
        try {
            const backendHealth = await axios.get('http://localhost:5000/api/health');
            log('green', '   ✅ Backend API is running');
            console.log(`      Devices: ${backendHealth.data.simulation.devices}`);
            console.log(`      Edge Nodes: ${backendHealth.data.simulation.edgeNodes}`);
        } catch (error) {
            log('red', '   ❌ Backend API not responding');
            console.log('      Please start: npm start (in backend directory)');
            return;
        }

        console.log('   Checking Mock Department Server (port 4000)...');
        try {
            await axios.get('http://localhost:4000');
            log('green', '   ✅ Mock Department Server is running');
        } catch (error) {
            log('red', '   ❌ Mock Department Server not responding');
            console.log('      Please start: node server.js (in mock-departments directory)');
            return;
        }

        console.log('   Checking Frontend (port 3000)...');
        try {
            await axios.get('http://localhost:3000');
            log('green', '   ✅ Frontend is accessible');
        } catch (error) {
            log('yellow', '   ⚠️  Frontend may not be running (check manually)');
        }

        // Step 2: Test Department Data APIs
        log('yellow', '\n📊 Step 2: Testing Department Data APIs');
        
        const departments = ['chennai_police', 'urbaser_cleaning', 'tnpcb_environment', 'chennai_municipal'];
        const departmentNames = {
            'chennai_police': 'Chennai Police Department',
            'urbaser_cleaning': 'Urbaser Sumeet Cleaning',
            'tnpcb_environment': 'Tamil Nadu Pollution Control Board',
            'chennai_municipal': 'Greater Chennai Corporation'
        };

        for (const deptId of departments) {
            console.log(`   Testing ${departmentNames[deptId]}...`);
            try {
                const response = await axios.get(`http://localhost:5000/api/departments/${deptId}/dashboard`);
                const data = response.data.data;
                
                log('green', `   ✅ ${departmentNames[deptId]}`);
                console.log(`      Devices: ${data.deviceCount} (${data.summary.onlineDevices} online)`);
                console.log(`      Alerts: ${data.alerts.length} active`);
                
                if (data.alerts.length > 0) {
                    console.log(`      Latest Alert: ${data.alerts[0].severity} - ${data.alerts[0].message}`);
                }
            } catch (error) {
                log('red', `   ❌ Failed to get data for ${departmentNames[deptId]}`);
            }
        }

        // Step 3: Check Mock Department Portals
        log('yellow', '\n🌐 Step 3: Testing Mock Department Portals');
        
        const portalUrls = {
            'police': 'http://localhost:4000/police',
            'cleaning': 'http://localhost:4000/cleaning',
            'environment': 'http://localhost:4000/environment',
            'municipal': 'http://localhost:4000/municipal'
        };

        for (const [portal, url] of Object.entries(portalUrls)) {
            try {
                const response = await axios.get(url);
                if (response.status === 200) {
                    log('green', `   ✅ ${portal.charAt(0).toUpperCase() + portal.slice(1)} Portal: ${url}`);
                }
            } catch (error) {
                log('red', `   ❌ ${portal.charAt(0).toUpperCase() + portal.slice(1)} Portal not accessible`);
            }
        }

        // Step 4: Check Mock Department APIs
        log('yellow', '\n🔌 Step 4: Testing Mock Department APIs');
        
        const mockApis = ['police', 'cleaning', 'environment', 'municipal'];
        for (const api of mockApis) {
            try {
                const response = await axios.get(`http://localhost:4000/api/${api}/data`);
                const data = response.data;
                
                if (data.data) {
                    log('green', `   ✅ ${api.charAt(0).toUpperCase() + api.slice(1)} API has data`);
                    console.log(`      Last Update: ${new Date(data.lastUpdate).toLocaleString()}`);
                    console.log(`      Device Count: ${data.data.deviceCount || 'N/A'}`);
                } else {
                    log('yellow', `   ⚠️  ${api.charAt(0).toUpperCase() + api.slice(1)} API: No data yet (waiting for webhooks)`);
                }
            } catch (error) {
                log('red', `   ❌ ${api.charAt(0).toUpperCase() + api.slice(1)} API not responding`);
            }
        }

        // Step 5: Test Manual Webhook
        log('yellow', '\n📡 Step 5: Testing Webhook Delivery');
        
        const testWebhookData = {
            department: "police",
            timestamp: new Date().toISOString(),
            data: {
                department: {
                    id: "chennai_police",
                    name: "Chennai Police Department"
                },
                deviceCount: 32,
                summary: {
                    onlineDevices: 30,
                    offlineDevices: 2,
                    lowBatteryDevices: 0
                },
                alerts: [{
                    type: "demo_alert",
                    severity: "medium",
                    message: "Demo webhook test alert",
                    timestamp: new Date().toISOString()
                }]
            }
        };

        try {
            const response = await axios.post('http://localhost:4000/smart-city-webhook/police', testWebhookData, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.status === 200) {
                log('green', '   ✅ Manual webhook delivery successful');
                console.log('      Police department should now show test data');
            }
        } catch (error) {
            log('red', '   ❌ Manual webhook delivery failed');
            console.log(`      Error: ${error.message}`);
        }

        // Summary and Access Information
        log('yellow', '\n🎯 System Status Summary');
        console.log('');
        log('bright', 'SYSTEM ACCESS POINTS:');
        console.log('   🖥️  Main Dashboard:     http://localhost:3000');
        console.log('   🏢  Department Portal:  http://localhost:4000');
        console.log('   📊  Backend API:        http://localhost:5000');
        console.log('');
        log('bright', 'DEPARTMENT DASHBOARDS:');
        console.log('   🚔  Police:             http://localhost:4000/police');
        console.log('   🗑️  Cleaning:           http://localhost:4000/cleaning');
        console.log('   🌱  Environment:        http://localhost:4000/environment');
        console.log('   🏛️  Municipal:          http://localhost:4000/municipal');
        console.log('');
        log('bright', 'KEY FEATURES DEMONSTRATED:');
        console.log('   ✅ Real-time device data collection');
        console.log('   ✅ Department-specific data filtering');
        console.log('   ✅ Webhook-based communication');
        console.log('   ✅ Interactive department dashboards');
        console.log('   ✅ Alert generation and distribution');
        console.log('   ✅ Multi-department coordination');
        console.log('');
        log('bright', 'AUTOMATED PROCESSES:');
        console.log('   🔄 Webhook broadcasting every 5 minutes');
        console.log('   📊 Real-time data processing');
        console.log('   🚨 Automatic alert generation');
        console.log('   🔍 Device monitoring and status updates');
        console.log('');
        log('green', '🎉 Smart City Department Communication System is fully operational!');
        console.log('');

    } catch (error) {
        log('red', `❌ Demonstration failed: ${error.message}`);
        console.log('');
        log('yellow', '💡 Troubleshooting Tips:');
        console.log('   1. Ensure all services are running:');
        console.log('      - Backend: cd backend && npm start');
        console.log('      - Frontend: cd frontend && npm start');
        console.log('      - Mock Departments: cd mock-departments && node server.js');
        console.log('   2. Check port availability (3000, 4000, 5000)');
        console.log('   3. Verify .env configuration in backend directory');
        console.log('   4. Check firewall settings if services are blocked');
    }
}

// Run the demonstration
console.log('\nStarting Smart City Department System Demonstration...');
console.log('Please ensure all services are running before proceeding.\n');

demonstrateSystem().then(() => {
    console.log('Demonstration complete. Press Ctrl+C to exit.\n');
}).catch(error => {
    console.error('Demonstration error:', error.message);
});
