const axios = require('axios');

// Service to fetch stock prices using Finnhub API
const getTheLatestStockPrice = async (ticker) => {
    try {
        const response = await axios.get('https://finnhub.io/api/v1/quote', {
            params: {
                symbol: ticker,  // Use symbol instead of ticker
                token: process.env.FINNHUB_API_KEY, // Your API key here
            },
        });

        const { c: currentPrice, d: change, dp: changePercent } = response.data;

        if (!currentPrice) {
            console.error(`No price data for ${ticker}`);
            throw new Error(`Stock price data not found for ${ticker}`);
        }

        return { ticker, currentPrice, change, changePercent };
    } catch (error) {
        console.error('Error fetching stock price:', error.message);
        throw new Error(`Failed to fetch stock price for ${ticker}`);
    }
};

module.exports = { getTheLatestStockPrice };
