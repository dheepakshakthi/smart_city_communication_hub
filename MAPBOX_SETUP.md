# Mapbox API Setup for Chennai Smart City Simulation

## Quick Setup Steps

1. **Get your Mapbox API key ready** (you mentioned you have one)

2. **Update the configuration file:**
   - Open: `frontend/src/config/mapbox.js`
   - Replace `pk.your_mapbox_token_here` with your actual Mapbox API key
   - The key should start with `pk.` followed by your token

3. **Example:**
   ```javascript
   API_KEY: 'pk.eyJ1IjoieW91cnVzZXJuYW1lIiwicmVhZGVyLWtleSI6InlvdXJfa2V5X2hlcmUifQ...',
   ACCESS_TOKEN: 'pk.eyJ1IjoieW91cnVzZXJuYW1lIiwicmVhZGVyLWtleSI6InlvdXJfa2V5X2hlcmUifQ...',
   ```

## Chennai Locations Configured

- **Central Chennai**: Anna Salai area (13.0827°N, 80.2707°E)
- **T. Nagar Hub**: Commercial district (13.0418°N, 80.2341°E)
- **Anna Nagar**: Residential area (13.1067°N, 80.2206°E)
- **Adyar IT Hub**: IT corridor (13.0067°N, 80.2576°E)
- **Marina Beach**: Coastal area (13.0499°N, 80.2834°E)

## Current Status

✅ Backend: Running with Chennai coordinates (126 devices, 5 edge nodes)
✅ Frontend: Ready for Mapbox integration
⏳ Pending: Your Mapbox API key insertion

After adding your API key, the map will show Chennai with professional Mapbox tiles instead of basic OpenStreetMap.
