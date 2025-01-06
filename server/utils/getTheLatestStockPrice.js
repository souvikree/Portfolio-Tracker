const axios = require('axios');


// Service to fetch stock prices using Finnhub API
const getTheLatestStockPrice = async (ticker) => {
    try {
        const response = await axios.get('https://finnhub.io/api/v1/quote', {
            params: {
                symbol: ticker,
                token: process.env.FINNHUB_API_KEY,
            },
        });

        const { c: currentPrice, d: change, dp: changePercent } = response.data;

        // Check the remaining rate limit
        const remaining = response.headers['X-RateLimit-Remaining'];
        if (remaining <= 0) {
            console.error(`Rate limit exceeded, try again later.`);
            throw new Error(`Rate limit exceeded for ${ticker}`);
        }

        return { ticker, currentPrice, change, changePercent };
    } catch (error) {
        console.error('Error fetching stock price:', error.message);
        throw new Error(`Failed to fetch stock price for ${ticker}`);
    }
};

module.exports = { getTheLatestStockPrice };
