const axios = require('axios');
const getAccessToken = require('../auth');

async function Log(stack, level, package, message) {
    const token = await getAccessToken();
    try {
        const response = await axios.post('http://20.244.56.144/evaluation-service/logs', {
            stack,
            level,
            package,
            message
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Logging failed:', error.message);
        throw error;
    }
}

module.exports = Log;