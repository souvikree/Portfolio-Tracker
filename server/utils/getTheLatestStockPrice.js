const axios = require('axios');
const Bottleneck = require('bottleneck'); 


const limiter = new Bottleneck({
    minTime: 1000,
    maxConcurrent: 1, 
});


const cache = new Map();
const cache_ttl = 5 * 60 * 1000; 


const fetchStockPrice = async (ticker) => {
    try {
       
        const cachedData = cache.get(ticker);
        if (cachedData && Date.now() - cachedData.timestamp < cache_ttl) {
            return cachedData.price;
        }

        const response = await axios.get('https://finnhub.io/api/v1/quote', {
            params: {
                symbol: ticker,
                token: process.env.FINNHUB_API_KEY,
            },
        });

        const { c: currentPrice, d: change, dp: changePercent } = response.data;

        
        cache.set(ticker, { price: { ticker, currentPrice, change, changePercent }, timestamp: Date.now() });

        return { ticker, currentPrice, change, changePercent };
    } catch (error) {
        if (error.response?.status === 429) {
            console.error(`Rate limit exceeded for ${ticker}. Serving cached data.`);
        } else {
            console.error('Error fetching stock price:', error.message);
        }

      
        const cachedData = cache.get(ticker);
        if (cachedData) {
            return cachedData.price;
        }

        throw new Error(`Failed to fetch stock price for ${ticker}`);
    }
};


const getTheLatestStockPrice = limiter.wrap(fetchStockPrice);

module.exports = { getTheLatestStockPrice };
