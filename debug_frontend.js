// Quick coordinate test to see what's being displayed
// Add this to browser console to debug
console.log('Expected Chennai bounds:');
console.log('Latitude range: 13.04 to 13.12');  
console.log('Longitude range: 80.22 to 80.32');
console.log('');

// Check if devices are being received correctly
if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
    console.log('React DevTools available - check component props');
}

// Monitor WebSocket messages
const originalConsoleLog = console.log;
console.log = function(...args) {
    if (args[0] && args[0].includes && args[0].includes('device')) {
        originalConsoleLog('DEVICE DEBUG:', ...args);
    }
    return originalConsoleLog.apply(console, args);
};
