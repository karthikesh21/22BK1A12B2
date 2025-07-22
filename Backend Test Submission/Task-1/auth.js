const axios = require('axios');

async function getAccessToken() {
    try {
        const response = await axios.post('http://20.244.56.144/auth/token', {
            email: 'karthik.k@zohocorp.com',
            password: 'Karthik@123'
        });
        return response.data.token;
    } catch (error) {
        console.error('Authentication failed:', error.message);
        throw error;
    }
}

module.exports = getAccessToken;