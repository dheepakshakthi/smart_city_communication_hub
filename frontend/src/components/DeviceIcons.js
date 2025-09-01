import L from 'leaflet';

// Simple but distinctive device icons - easier to render
const DeviceIcons = {
  // CCTV Camera - Security Camera with clear lens
  CCTV: (status = 'online', size = 24) => {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#2C3E50" stroke="white" stroke-width="2"/>
        <rect x="8" y="12" width="12" height="8" rx="2" fill="white"/>
        <circle cx="20" cy="15" r="3" fill="white"/>
        <circle cx="20" cy="15" r="2" fill="#2C3E50"/>
        <circle cx="20" cy="15" r="1" fill="#E74C3C"/>
        <rect x="6" y="14" width="2" height="4" fill="white"/>
      </svg>
    `;
  },

  // Traffic Light - Clear 3-light design
  TrafficSensor: (status = 'online', size = 24) => {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#34495E" stroke="white" stroke-width="2"/>
        <rect x="12" y="6" width="8" height="18" rx="3" fill="#2C3E50"/>
        <circle cx="16" cy="10" r="2" fill="#E74C3C"/>
        <circle cx="16" cy="15" r="2" fill="#F39C12"/>
        <circle cx="16" cy="20" r="2" fill="#27AE60"/>
        <rect x="15.5" y="24" width="1" height="4" fill="#2C3E50"/>
      </svg>
    `;
  },

  // Waste Bin - Simple bin design
  WasteBinSensor: (status = 'online', size = 24) => {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#8E44AD" stroke="white" stroke-width="2"/>
        <rect x="9" y="12" width="14" height="12" rx="1" fill="white"/>
        <rect x="7" y="11" width="18" height="2" rx="1" fill="white"/>
        <rect x="12" y="8" width="8" height="1" rx="0.5" fill="white"/>
        <line x1="12" y1="15" x2="12" y2="20" stroke="#8E44AD" stroke-width="1.5"/>
        <line x1="16" y1="15" x2="16" y2="20" stroke="#8E44AD" stroke-width="1.5"/>
        <line x1="20" y1="15" x2="20" y2="20" stroke="#8E44AD" stroke-width="1.5"/>
      </svg>
    `;
  },

  // Street Light - Clear lamp design
  SmartStreetlight: (status = 'online', size = 24) => {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#F39C12" stroke="white" stroke-width="2"/>
        <ellipse cx="16" cy="10" rx="6" ry="3" fill="white"/>
        <ellipse cx="16" cy="10" rx="4" ry="2" fill="#F39C12"/>
        <path d="M10 13 L12 16 L20 16 L22 13" fill="white" opacity="0.7"/>
        <rect x="15.5" y="13" width="1" height="12" fill="white"/>
        <rect x="13" y="25" width="6" height="1" fill="white"/>
      </svg>
    `;
  },

  // Pollution Sensor - Environmental monitoring
  PollutionSensor: (status = 'online', size = 24) => {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#95A5A6" stroke="white" stroke-width="2"/>
        <rect x="9" y="16" width="14" height="8" rx="2" fill="white"/>
        <rect x="13" y="8" width="6" height="8" fill="white"/>
        <circle cx="16" cy="11" r="1.5" fill="#95A5A6"/>
        <line x1="11" y1="18" x2="21" y2="18" stroke="#95A5A6" stroke-width="1"/>
        <line x1="11" y1="20" x2="21" y2="20" stroke="#95A5A6" stroke-width="1"/>
        <line x1="11" y1="22" x2="18" y2="22" stroke="#95A5A6" stroke-width="1"/>
      </svg>
    `;
  },

  // Water Quality Sensor - Water testing device
  WaterQualitySensor: (status = 'online', size = 24) => {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#3498DB" stroke="white" stroke-width="2"/>
        <path d="M16 6 C18 6 20 8 20 10 C20 12 18 14 16 14 C14 14 12 12 12 10 C12 8 14 6 16 6 Z" fill="white"/>
        <rect x="8" y="14" width="16" height="10" rx="2" fill="white"/>
        <path d="M10 17 Q12 16 14 17 T18 17 T22 17" stroke="#3498DB" stroke-width="1.5" fill="none"/>
        <path d="M10 20 Q12 19 14 20 T18 20 T22 20" stroke="#3498DB" stroke-width="1.5" fill="none"/>
        <circle cx="20" cy="22" r="1" fill="#3498DB"/>
      </svg>
    `;
  },

  // Noise Sensor - Microphone with sound waves
  NoiseSensor: (status = 'online', size = 24) => {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#E91E63" stroke="white" stroke-width="2"/>
        <rect x="12" y="12" width="4" height="10" rx="2" fill="white"/>
        <rect x="10" y="14" width="2" height="6" rx="1" fill="white"/>
        <path d="M18 10 Q22 13 22 16 Q22 19 18 22" stroke="white" stroke-width="2" fill="none"/>
        <path d="M20 12 Q23 14 23 16 Q23 18 20 20" stroke="white" stroke-width="1.5" fill="none"/>
        <rect x="11" y="22" width="6" height="1" fill="white"/>
      </svg>
    `;
  },

  // Parking Sensor - Car with P symbol
  ParkingSensor: (status = 'online', size = 24) => {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#3F51B5" stroke="white" stroke-width="2"/>
        <rect x="6" y="14" width="20" height="8" rx="3" fill="white"/>
        <circle cx="10" cy="21" r="2" fill="#3F51B5"/>
        <circle cx="22" cy="21" r="2" fill="#3F51B5"/>
        <rect x="8" y="15" width="16" height="4" rx="2" fill="#3F51B5"/>
        <rect x="14" y="8" width="4" height="2" fill="white"/>
        <text x="16" y="9.5" text-anchor="middle" font-size="3" fill="#3F51B5" font-weight="bold">P</text>
      </svg>
    `;
  }
};

// Create custom Leaflet icon for devices - emphasizing device type over status
export const createCustomDeviceIcon = (type, status = 'online', size = 32) => {
  const iconSvg = DeviceIcons[type] ? DeviceIcons[type](status, size - 8) : DeviceIcons.CCTV(status, size - 8);
  
  return L.divIcon({
    html: `<div style="position: relative; width: ${size}px; height: ${size}px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
      ${iconSvg}
    </div>`,
    className: 'custom-device-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Edge Node Icon with enhanced design
export const createEdgeNodeIcon = (size = 40) => {
  return L.divIcon({
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none">
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667eea"/>
              <stop offset="100%" style="stop-color:#764ba2"/>
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="36" height="36" rx="6" fill="url(#edgeGrad)" stroke="white" stroke-width="2"/>
          <g transform="translate(10, 8)">
            <rect x="0" y="4" width="20" height="12" rx="2" fill="white"/>
            <rect x="2" y="6" width="5" height="2" fill="#667eea"/>
            <rect x="2" y="9" width="8" height="2" fill="#667eea"/>
            <rect x="2" y="12" width="6" height="2" fill="#667eea"/>
            <circle cx="15" cy="10" r="3" fill="white" stroke="#667eea" stroke-width="2"/>
            <circle cx="15" cy="10" r="1" fill="#667eea"/>
          </g>
          <g transform="translate(8, 22)">
            <rect x="0" y="0" width="6" height="6" rx="1" fill="white" opacity="0.8"/>
            <rect x="8" y="0" width="6" height="6" rx="1" fill="white" opacity="0.8"/>
            <rect x="16" y="0" width="6" height="6" rx="1" fill="white" opacity="0.8"/>
          </g>
        </svg>
      </div>
    `,
    className: 'edge-node-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Alert Icon with pulsing animation
export const createAlertIcon = (severity, size = 32) => {
  const colors = {
    high: '#F44336',
    medium: '#FF9800',
    low: '#FFC107'
  };

  const color = colors[severity] || colors.medium;

  return L.divIcon({
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
          <g transform="translate(11, 8)">
            <path d="M5 0 L9 7 L1 7 Z" fill="white"/>
            <circle cx="5" cy="10" r="1" fill="white"/>
            <rect x="4.2" y="3" width="1.6" height="4" fill="${color}"/>
          </g>
        </svg>
        <style>
          .alert-pulse-${severity} {
            animation: alertPulse 2s infinite;
          }
          @keyframes alertPulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.15); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        </style>
      </div>
    `,
    className: `alert-icon alert-pulse-${severity}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export default DeviceIcons;
