// Debug script to check coordinate generation
const bounds = {
    north: 13.1200,  // Anna Nagar area
    south: 13.0400,  // Adyar area  
    east: 80.3200,   // ECR side
    west: 80.2200    // T. Nagar area
};

function generateRandomLocation(bounds) {
    return {
        lat: bounds.south + (Math.random() * (bounds.north - bounds.south)),
        lon: bounds.west + (Math.random() * (bounds.east - bounds.west))
    };
}

console.log('Chennai bounds:', bounds);
console.log('Sample locations:');
for (let i = 0; i < 5; i++) {
    const location = generateRandomLocation(bounds);
    console.log(`  ${i + 1}: lat=${location.lat.toFixed(4)}, lon=${location.lon.toFixed(4)}`);
}

// Expected ranges:
console.log('\nExpected ranges:');
console.log(`  Latitude should be between ${bounds.south} and ${bounds.north}`);
console.log(`  Longitude should be between ${bounds.west} and ${bounds.east}`);
