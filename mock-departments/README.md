# Mock Department Websites

This directory contains mock department websites that simulate real department systems for testing the Smart City Communication Hub's department reporting features.

## Overview

The mock department system provides realistic department portals that:
- Receive webhook data from the Smart City Communication Hub
- Display real-time data in department-specific dashboards
- Store and show historical data
- Provide REST API endpoints for data access

## Architecture

```
Mock Department Server (Port 4000)
├── Department Portals (Web UI)
│   ├── /police - Chennai Police Department
│   ├── /cleaning - Urbaser Sumeet Cleaning
│   ├── /environment - TNPCB Environment
│   └── /municipal - Chennai Municipal Corporation
├── Webhook Endpoints
│   ├── POST /smart-city-webhook/police
│   ├── POST /smart-city-webhook/cleaning
│   ├── POST /smart-city-webhook/environment
│   └── POST /smart-city-webhook/municipal
└── API Endpoints
    ├── GET /api/police/data
    ├── GET /api/cleaning/data
    ├── GET /api/environment/data
    └── GET /api/municipal/data
```

## Department Portals

### 1. Chennai Police Department (`/police`)
- **Color Scheme**: Blue gradient (Police colors)
- **Icon**: 🚔
- **Features**:
  - Real-time CCTV and traffic sensor data
  - Incident tracking and alerts
  - Traffic congestion monitoring
  - Device status overview

### 2. Urbaser Sumeet Cleaning (`/cleaning`)
- **Color Scheme**: Green gradient (Environmental colors)
- **Icon**: 🗑️
- **Features**:
  - Waste bin fill level monitoring
  - Collection route optimization
  - Alert system for full bins
  - Daily collection statistics

### 3. TNPCB Environment (`/environment`)
- **Color Scheme**: Teal gradient (Clean water/air colors)
- **Icon**: 🌱
- **Features**:
  - Air quality index (AQI) monitoring
  - Pollution sensor data
  - Environmental compliance tracking
  - Alert system for pollution levels

### 4. Chennai Municipal Corporation (`/municipal`)
- **Color Scheme**: Purple gradient (Municipal authority colors)
- **Icon**: 🏛️
- **Features**:
  - Street lighting control and monitoring
  - Energy consumption tracking
  - Infrastructure maintenance requests
  - Public service availability

## Real-time Features

Each department portal includes:
- **Auto-refresh**: Data updates every 30 seconds
- **Live Statistics**: Device counts, online status, alert counts
- **Interactive Dashboard**: Click refresh to get latest data
- **JSON Data View**: Raw data display for developers
- **Historical Tracking**: Stores last 10 data updates per department

## Webhook Integration

### Data Flow
1. Smart City Hub processes device data
2. DepartmentService filters data by department
3. HTTP POST sent to respective webhook endpoints
4. Mock server receives and stores data
5. Department portals display updated information

### Webhook Data Format
```json
{
  "department": "police",
  "timestamp": "2025-09-02T10:30:00.000Z",
  "data": {
    "department": {
      "id": "chennai_police",
      "name": "Chennai Police Department",
      "contactInfo": {...},
      "responsibilities": [...]
    },
    "deviceCount": 32,
    "devices": [...],
    "summary": {
      "onlineDevices": 30,
      "offlineDevices": 2,
      "lowBatteryDevices": 0
    },
    "alerts": [...]
  }
}
```

## Setup and Usage

### Installation
```bash
cd mock-departments
npm install
```

### Running the Server
```bash
npm start
# or
node server.js
```

### Accessing Department Portals
- Main Portal: http://localhost:4000
- Police: http://localhost:4000/police
- Cleaning: http://localhost:4000/cleaning
- Environment: http://localhost:4000/environment
- Municipal: http://localhost:4000/municipal

### API Testing
```bash
# Get police department data
curl http://localhost:4000/api/police/data

# Test webhook (manual)
curl -X POST http://localhost:4000/smart-city-webhook/police \
  -H "Content-Type: application/json" \
  -d '{"department":"police","data":{"deviceCount":32}}'
```

## Configuration

### Environment Variables
The mock server uses these default settings:
- **PORT**: 4000 (can be changed via environment variable)
- **Data Retention**: Last 10 webhook deliveries per department
- **Auto-refresh Interval**: 30 seconds for web UI

### Backend Integration
Update the main backend's `.env` file:
```env
POLICE_WEBHOOK_URL=http://localhost:4000/smart-city-webhook/police
CLEANING_WEBHOOK_URL=http://localhost:4000/smart-city-webhook/cleaning
TNPCB_WEBHOOK_URL=http://localhost:4000/smart-city-webhook/environment
MUNICIPAL_WEBHOOK_URL=http://localhost:4000/smart-city-webhook/municipal
```

## Development Features

### Logging
The server logs all incoming webhooks with:
- Timestamp
- Department name
- Device count
- Alert count

### Error Handling
- Graceful handling of malformed webhook data
- 404 responses for unknown departments
- CORS enabled for cross-origin requests

### Data Persistence
- In-memory storage (resets on server restart)
- Historical data for last 10 updates per department
- Real-time statistics calculation

## Deployment

### Production Considerations
For production deployment:
1. Use persistent database instead of in-memory storage
2. Add authentication/authorization for webhook endpoints
3. Implement rate limiting
4. Add SSL/TLS encryption
5. Use environment-specific configuration

### Scaling
- Can be deployed as separate microservices per department
- Supports horizontal scaling with load balancers
- Database clustering for high availability

## Testing

### Manual Testing
1. Start the mock server
2. Start the main Smart City backend
3. Wait for automatic webhook delivery (every 5 minutes)
4. Check department portals for updated data

### Automated Testing
```bash
# Test all webhook endpoints
node test-webhooks.js

# Test department portal responses
node test-portals.js
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Check if another service is running on port 4000
   - Use `netstat -ano | findstr :4000` to find processes
   - Kill conflicting processes or change PORT environment variable

2. **Webhook Not Receiving Data**
   - Verify backend .env configuration
   - Check network connectivity between services
   - Monitor backend logs for webhook delivery attempts

3. **Department Portal Not Loading**
   - Ensure mock server is running
   - Check browser console for JavaScript errors
   - Verify correct URL format

### Logs and Monitoring
- Server startup logs show all department portal URLs
- Webhook delivery logs show timestamp and data summary
- Error logs help diagnose connection issues

## Future Enhancements

1. **Database Integration**: Replace in-memory storage with persistent database
2. **Authentication**: Add API key authentication for webhooks
3. **Mobile Responsive**: Optimize portals for mobile devices
4. **Real-time Updates**: Implement WebSocket for live data streaming
5. **Analytics**: Add charts and graphs for historical analysis
6. **Notifications**: Email/SMS alerts for critical incidents
7. **Multi-language**: Support for Tamil and Hindi languages

---

**Note**: This is a development/testing tool. In production, actual department systems would have their own endpoints and authentication mechanisms.
