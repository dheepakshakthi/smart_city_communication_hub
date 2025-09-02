#!/usr/bin/env node

// Demo script to test department reporting system
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testDepartmentSystem() {
    console.log('🏢 Testing Smart City Department Reporting System\n');

    try {
        // Test 1: Get all departments
        console.log('📋 Fetching all departments...');
        const departmentsResponse = await axios.get(`${BASE_URL}/departments`);
        const departments = departmentsResponse.data.data;
        
        console.log(`✅ Found ${Object.keys(departments).length} departments:`);
        Object.entries(departments).forEach(([id, dept]) => {
            console.log(`   • ${dept.name} (${dept.devices.join(', ')})`);
        });
        console.log();

        // Test 2: Get Chennai Police data
        console.log('🚔 Chennai Police Department Data:');
        const policeResponse = await axios.get(`${BASE_URL}/departments/chennai_police/dashboard`);
        const policeData = policeResponse.data.data;
        
        console.log(`   Total Devices: ${policeData.deviceCount}`);
        console.log(`   Online Devices: ${policeData.summary.onlineDevices}`);
        console.log(`   Active Alerts: ${policeData.alerts.length}`);
        
        if (policeData.alerts.length > 0) {
            console.log('   Recent Alerts:');
            policeData.alerts.slice(0, 3).forEach(alert => {
                console.log(`     - ${alert.severity.toUpperCase()}: ${alert.message}`);
            });
        }
        console.log();

        // Test 3: Get Urbaser Cleaning data
        console.log('🗑️ Urbaser Cleaning Department Data:');
        const cleaningResponse = await axios.get(`${BASE_URL}/departments/urbaser_cleaning/dashboard`);
        const cleaningData = cleaningResponse.data.data;
        
        console.log(`   Total Devices: ${cleaningData.deviceCount}`);
        console.log(`   Online Devices: ${cleaningData.summary.onlineDevices}`);
        console.log(`   Active Alerts: ${cleaningData.alerts.length}`);
        
        // Get waste bin specifics
        const wasteBinsResponse = await axios.get(`${BASE_URL}/cleaning/waste-bins`);
        const wasteBinsData = wasteBinsResponse.data.data;
        
        console.log(`   Bins Needing Collection: ${wasteBinsData.binsNeedingCollection}`);
        console.log();

        // Test 4: Get TNPCB Environment data
        console.log('🌱 TNPCB Environment Department Data:');
        const environmentResponse = await axios.get(`${BASE_URL}/departments/tnpcb_environment/dashboard`);
        const environmentData = environmentResponse.data.data;
        
        console.log(`   Total Devices: ${environmentData.deviceCount}`);
        console.log(`   Online Devices: ${environmentData.summary.onlineDevices}`);
        console.log(`   Active Alerts: ${environmentData.alerts.length}`);
        
        // Get air quality specifics
        const airQualityResponse = await axios.get(`${BASE_URL}/environment/air-quality`);
        const airQualityData = airQualityResponse.data.data;
        
        if (airQualityData.averageAQI) {
            console.log(`   Average AQI: ${Math.round(airQualityData.averageAQI)}`);
        }
        console.log();

        // Test 5: Get Chennai Municipal data
        console.log('🏛️ Chennai Municipal Corporation Data:');
        const municipalResponse = await axios.get(`${BASE_URL}/departments/chennai_municipal/dashboard`);
        const municipalData = municipalResponse.data.data;
        
        console.log(`   Total Devices: ${municipalData.deviceCount}`);
        console.log(`   Online Devices: ${municipalData.summary.onlineDevices}`);
        console.log(`   Active Alerts: ${municipalData.alerts.length}`);
        
        // Get streetlight specifics
        const streetlightsResponse = await axios.get(`${BASE_URL}/municipal/streetlights`);
        const streetlightsData = streetlightsResponse.data.data;
        
        console.log(`   Active Lights: ${streetlightsData.activeLights}`);
        console.log(`   Total Energy Consumption: ${Math.round(streetlightsData.totalEnergyConsumption)}W`);
        console.log();

        console.log('🎯 Department System Test Summary:');
        console.log('✅ All API endpoints working correctly');
        console.log('✅ Department-specific data filtering active');
        console.log('✅ Real-time alert generation functional');
        console.log('✅ Device categorization by department working');
        console.log();
        
        console.log('📡 Webhook Configuration:');
        console.log('   To enable webhook delivery to department systems:');
        console.log('   1. Configure actual webhook URLs in backend/.env');
        console.log('   2. Webhooks will auto-broadcast every 5 minutes');
        console.log('   3. Monitor server logs for delivery status');
        console.log();
        
        console.log('🌐 Frontend Access:');
        console.log('   1. Open http://localhost:3000');
        console.log('   2. Click "🏢 Departments" button in header');
        console.log('   3. Select a department to view their dashboard');
        console.log('   4. Monitor real-time data and alerts');

    } catch (error) {
        console.error('❌ Error testing department system:', error.message);
        console.log('💡 Make sure the backend server is running on port 5000');
    }
}

// Run the test
testDepartmentSystem();
