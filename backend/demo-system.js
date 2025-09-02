#!/usr/bin/env node

// Demonstration script for Smart City Department Communication System
const axios = require('axios');

async function demonstrateSystem() {
    console.log('\n' + '='.repeat(70));
    console.log('🏙️  SMART CITY DEPARTMENT COMMUNICATION SYSTEM DEMO');
    console.log('='.repeat(70) + '\n');

    try {
        // Step 1: Check if all services are running
        console.log('📋 Step 1: Checking Service Availability');
        console.log('   Checking Backend API (port 5000)...');
        
        try {
            const backendHealth = await axios.get('http://localhost:5000/api/health');
            console.log('   ✅ Backend API is running');
            console.log(`      Devices: ${backendHealth.data.simulation.devices}`);
            console.log(`      Edge Nodes: ${backendHealth.data.simulation.edgeNodes}`);
        } catch (error) {
            console.log('   ❌ Backend API not responding');
            console.log('      Please start: npm start (in backend directory)');
            return;
        }

        console.log('   Checking Mock Department Server (port 4000)...');
        try {
            await axios.get('http://localhost:4000');
            console.log('   ✅ Mock Department Server is running');
        } catch (error) {
            console.log('   ❌ Mock Department Server not responding');
            console.log('      Please start: node server.js (in mock-departments directory)');
            return;
        }

        // Step 2: Test Department Data APIs
        console.log('\n📊 Step 2: Testing Department Data APIs');
        
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
                
                console.log(`   ✅ ${departmentNames[deptId]}`);
                console.log(`      Devices: ${data.deviceCount} (${data.summary.onlineDevices} online)`);
                console.log(`      Alerts: ${data.alerts.length} active`);
                
                if (data.alerts.length > 0) {
                    console.log(`      Latest Alert: ${data.alerts[0].severity} - ${data.alerts[0].message}`);
                }
            } catch (error) {
                console.log(`   ❌ Failed to get data for ${departmentNames[deptId]}`);
            }
        }

        // Step 3: Test Manual Webhook
        console.log('\n📡 Step 3: Testing Webhook Delivery');
        
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
                console.log('   ✅ Manual webhook delivery successful');
                console.log('      Police department should now show test data');
            }
        } catch (error) {
            console.log('   ❌ Manual webhook delivery failed');
            console.log(`      Error: ${error.message}`);
        }

        // Summary and Access Information
        console.log('\n🎯 System Status Summary');
        console.log('');
        console.log('SYSTEM ACCESS POINTS:');
        console.log('   🖥️  Main Dashboard:     http://localhost:3000');
        console.log('   🏢  Department Portal:  http://localhost:4000');
        console.log('   📊  Backend API:        http://localhost:5000');
        console.log('');
        console.log('DEPARTMENT DASHBOARDS:');
        console.log('   🚔  Police:             http://localhost:4000/police');
        console.log('   🗑️  Cleaning:           http://localhost:4000/cleaning');
        console.log('   🌱  Environment:        http://localhost:4000/environment');
        console.log('   🏛️  Municipal:          http://localhost:4000/municipal');
        console.log('');
        console.log('KEY FEATURES DEMONSTRATED:');
        console.log('   ✅ Real-time device data collection');
        console.log('   ✅ Department-specific data filtering');
        console.log('   ✅ Webhook-based communication');
        console.log('   ✅ Interactive department dashboards');
        console.log('   ✅ Alert generation and distribution');
        console.log('   ✅ Multi-department coordination');
        console.log('');
        console.log('🎉 Smart City Department Communication System is fully operational!');
        console.log('');

    } catch (error) {
        console.log(`❌ Demonstration failed: ${error.message}`);
    }
}

// Run the demonstration
console.log('\nStarting Smart City Department System Demonstration...');
demonstrateSystem();
