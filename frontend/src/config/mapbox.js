// Mapbox configuration for Chennai Smart City
export const MAPBOX_CONFIG = {
  // Your actual Mapbox API key
  API_KEY: 'pk.eyJ1IjoibjF6aGFsIiwiYSI6ImNtZjEweWx6YTA4MHcycnNpZWxhNnB0azQifQ.96gYt6yWCshqyVwye1P3Zw',
  ACCESS_TOKEN: 'pk.eyJ1IjoibjF6aGFsIiwiYSI6ImNtZjEweWx6YTA4MHcycnNpZWxhNnB0azQifQ.96gYt6yWCshqyVwye1P3Zw',
  
  // Chennai coordinates
  CITY_CENTER: [80.2707, 13.0827], // [lng, lat] format for Mapbox
  DEFAULT_ZOOM: 12,
  
  // Chennai city bounds for simulation
  CITY_BOUNDS: {
    north: 13.1200,  // Anna Nagar area
    south: 13.0400,  // Adyar area
    east: 80.3200,   // ECR side
    west: 80.2200    // T. Nagar area
  },
  
  // Chennai-specific edge node locations
  EDGE_NODES: [
    { lat: 13.0827, lng: 80.2707, name: "Central Chennai (Anna Salai)" },
    { lat: 13.1067, lng: 80.2533, name: "T. Nagar Commercial Hub" },
    { lat: 13.1185, lng: 80.2820, name: "Anna Nagar Residential" },
    { lat: 13.0478, lng: 80.2573, name: "Adyar IT Corridor" },
    { lat: 13.0569, lng: 80.2975, name: "Marina Beach Zone" }
  ]
};

// Mapbox style URLs
export const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11'
};
