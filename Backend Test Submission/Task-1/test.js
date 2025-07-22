const Log = require('./loggingMiddleware/log');
const getAccessToken = require('./auth');

async function testLogging() {
    try {
        const token = await getAccessToken();
        
        // Test backend error logging
        await Log('backend', 'error', 'handler', 'received string, expected bool', token);
        console.log('Error log sent successfully');

        // Test fatal error logging
        await Log('backend', 'fatal', 'db', 'Critical database connection failure.', token);
        console.log('Fatal error log sent successfully');

    } catch (error) {
        console.error('Testing failed:', error.message);
    }
}

testLogging();