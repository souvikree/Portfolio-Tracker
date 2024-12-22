// utils/fetchStockPrice.js
const axios = require('axios');

// Alpha Vantage API key and URL
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

const fetchStockPrice = async (ticker) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                function: 'TIME_SERIES_INTRADAY',
                symbol: ticker,
                interval: '1min', // or '5min', '15min', etc.
                apikey: API_KEY,
            },
        });
        
        // Extract the latest price from the API response
        const timeSeries = response.data['Time Series (1min)'];
        const latestTime = Object.keys(timeSeries)[0]; // Get the latest timestamp
        // const latestPrice = timeSeries[latestTime]['1. open']; // Open price (you can choose other types)
        const latestPrice = timeSeries[latestTime]['4. close'];
        return parseFloat(latestPrice);
    } catch (error) {
        console.error('Error fetching stock price:', error);
        throw new Error('Unable to fetch stock price');
    }
};

module.exports = fetchStockPrice;
