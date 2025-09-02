# Department Communication System

This document outlines the department-specific communication and reporting system implemented in the Smart City Communication Hub.

## Overview

The system automatically routes communication outputs to respective department webpages and provides dedicated dashboards for each department to monitor their specific devices and operations.

## Departments and Responsibilities

### 1. Chennai Police Department
- **Endpoint**: `/api/police` and `/api/departments/chennai_police`
- **Devices Managed**: CCTV Cameras, Traffic Sensors
- **Responsibilities**:
  - Traffic Light Controls
  - CCTV Monitoring and Surveillance
  - Traffic Flow Management
  - Security Incident Response
  - Emergency Response Coordination

- **Contact Information**:
  - Email: traffic.control@chennaicity.gov.in
  - Phone: +91-44-2854-0500
  - Address: Chennai Police Headquarters, Egmore

### 2. Urbaser Sumeet Cleaning Services
- **Endpoint**: `/api/cleaning` and `/api/departments/urbaser_cleaning`
- **Devices Managed**: Waste Bin Sensors
- **Responsibilities**:
  - Waste Collection Optimization
  - Street Cleaning Coordination
  - Bin Monitoring and Alerts
  - Route Optimization

- **Contact Information**:
  - Email: operations@urbasersumeet.com
  - Phone: +91-44-2851-2345
  - Address: Urbaser Sumeet Office, Chennai

### 3. Tamil Nadu Pollution Control Board (TNPCB)
- **Endpoint**: `/api/environment` and `/api/departments/tnpcb_environment`
- **Devices Managed**: Pollution Sensors, Water Quality Sensors, Noise Sensors
- **Responsibilities**:
  - Air Quality Monitoring
  - Water Quality Assessment
  - Noise Level Control
  - Environmental Compliance
  - Pollution Alert Management

- **Contact Information**:
  - Email: monitoring@tnpcb.gov.in
  - Phone: +91-44-2432-1267
  - Address: TNPCB Office, Guindy, Chennai

### 4. Greater Chennai Corporation
- **Endpoint**: `/api/municipal` and `/api/departments/chennai_municipal`
- **Devices Managed**: Smart Street Lights, Water Quality Sensors
- **Responsibilities**:
  - Street Lighting Management
  - Public Infrastructure Maintenance
  - Water Supply Monitoring
  - City Maintenance Coordination

- **Contact Information**:
  - Email: smartcity@chennaicorporation.gov.in
  - Phone: +91-44-2854-1234
  - Address: Ripon Building, Chennai Corporation

## API Endpoints

### General Department Endpoints
- `GET /api/departments` - List all departments
- `GET /api/departments/:deptId` - Get specific department info
- `GET /api/departments/:deptId/devices` - Get department-specific device data
- `GET /api/departments/:deptId/alerts` - Get department-specific alerts
- `GET /api/departments/:deptId/dashboard` - Get real-time dashboard data

### Department-Specific Endpoints

#### Chennai Police
- `GET /api/police` - Police department dashboard data
- `GET /api/police/traffic` - Traffic sensor data
- `GET /api/police/cctv` - CCTV camera data and detections

#### Urbaser Cleaning
- `GET /api/cleaning` - Cleaning department dashboard data
- `GET /api/cleaning/waste-bins` - Waste bin status and collection needs

#### TNPCB Environment
- `GET /api/environment` - Environmental monitoring dashboard
- `GET /api/environment/air-quality` - Air quality sensor data

#### Chennai Municipal
- `GET /api/municipal` - Municipal department dashboard
- `GET /api/municipal/streetlights` - Street lighting status and energy consumption

## Webhook Integration

### Configuration
Configure webhook URLs in the `.env` file:
```env
POLICE_WEBHOOK_URL=https://api.chennaicity.gov.in/police/smart-city-webhook
CLEANING_WEBHOOK_URL=https://api.urbasersumeet.com/smart-city-webhook
TNPCB_WEBHOOK_URL=https://api.tnpcb.gov.in/smart-city-webhook
MUNICIPAL_WEBHOOK_URL=https://api.chennaicorporation.gov.in/smart-city-webhook
```

### Webhook Data Format
```json
{
  "department": "chennai_police",
  "timestamp": "2025-09-02T10:30:00.000Z",
  "data": {
    "department": {
      "id": "chennai_police",
      "name": "Chennai Police Department",
      "contactInfo": { ... },
      "responsibilities": [ ... ]
    },
    "deviceCount": 15,
    "devices": [ ... ],
    "summary": { ... },
    "alerts": [ ... ]
  }
}
```

### Broadcasting Schedule
- **Interval**: Every 5 minutes (configurable via `DEPARTMENT_BROADCAST_INTERVAL`)
- **Trigger**: Automatic during simulation
- **Method**: HTTP POST to configured webhook URLs

## Alert System

### Alert Types by Department

#### Police Department
- `security_incident` - CCTV detections of suspicious activity
- `traffic_congestion` - High traffic congestion alerts
- `device_offline` - Camera or traffic sensor offline

#### Cleaning Department
- `waste_collection_needed` - Bins above 85% capacity
- `device_offline` - Waste bin sensor offline

#### Environmental Department
- `pollution_alert` - AQI exceeding safe levels
- `device_offline` - Environmental sensor offline

#### Municipal Department
- `device_offline` - Street light offline
- `high_energy_consumption` - Unusual energy usage

### Alert Severity Levels
- **Critical**: Immediate action required (security incidents, severe pollution)
- **High**: Urgent attention needed (device offline, collection needed)
- **Medium**: Attention required (moderate congestion, maintenance)

## Frontend Dashboard

### Accessing Department Dashboards
1. Click the "🏢 Departments" button in the main header
2. Select a department from the grid view
3. View real-time data, alerts, and device status
4. Use the refresh button to get latest data

### Dashboard Features
- Real-time device monitoring
- Alert management
- Performance metrics
- Contact information
- Responsibility overview
- Device location mapping

## Implementation Details

### Backend Architecture
- `DepartmentService.js` - Core service for department management
- `departmentRoutes.js` - API routes for department data
- Integration with `CitySimulation.js` for real-time data
- Webhook broadcasting every 5 minutes

### Frontend Components
- `DepartmentDashboard.js` - Main department interface
- View switching in `App.js`
- Department button in `Header.js`

### Data Flow
1. IoT devices generate data
2. City simulation processes data
3. Department service filters data by department
4. Data sent to department webhooks
5. Real-time updates via WebSocket
6. Department dashboards display filtered data

## Security Considerations

- All webhook calls include timeout (10 seconds)
- Data is formatted specifically for each department
- Contact information is included for verification
- Error handling for failed webhook deliveries
- Logs maintained for audit trails

## Configuration and Deployment

### Environment Variables
```env
# Department webhook URLs
POLICE_WEBHOOK_URL=<police-department-webhook>
CLEANING_WEBHOOK_URL=<cleaning-service-webhook>
TNPCB_WEBHOOK_URL=<tnpcb-webhook>
MUNICIPAL_WEBHOOK_URL=<municipal-webhook>

# Broadcasting interval (milliseconds)
DEPARTMENT_BROADCAST_INTERVAL=300000
```

### Testing Webhook Integration
1. Set up webhook endpoints at department systems
2. Configure URLs in `.env` file
3. Monitor console logs for webhook delivery status
4. Verify data format matches expected schema

## Monitoring and Maintenance

### Logs
- Webhook delivery success/failure
- Data processing errors
- Alert generation and distribution
- Performance metrics

### Maintenance Tasks
- Regular webhook URL validation
- Alert threshold adjustment
- Performance optimization
- Contact information updates

## Future Enhancements

1. **Authentication**: Add API keys for webhook security
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Data Retention**: Configure data retention policies
4. **Reporting**: Generate periodic reports for departments
5. **Mobile Apps**: Department-specific mobile applications
6. **Integration**: Connect with existing department systems
7. **Analytics**: Advanced analytics and prediction models

## Support and Contact

For technical support or configuration assistance:
- Check system logs for error details
- Verify webhook URLs are accessible
- Ensure department systems can receive POST requests
- Contact system administrators for network configuration

---

**Last Updated**: September 2, 2025  
**Version**: 1.0  
**Author**: Smart City Development Team
