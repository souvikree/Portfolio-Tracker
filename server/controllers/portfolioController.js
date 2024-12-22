const Portfolio = require('../models/Portfolio');
const fetchStockPrice = require('../utils/fetchStockPrice');

// Add a new portfolio for a user
exports.addPortfolio = async (req, res) => {
    try {
        const { name, userId } = req.body;

        // List of random stock tickers (you can replace this with an API to fetch real random stocks)
        const randomTickers = ['AAPL', 'GOOG', 'AMZN', 'MSFT', 'TSLA'];
        
        // Fetch stock prices for each ticker
        const stocks = [];
        for (let ticker of randomTickers) {
            const price = await fetchStockPrice(ticker);
            stocks.push({ ticker, price, quantity: 1 });
        }

        // Create a new portfolio
        const portfolio = new Portfolio({
            name,
            user: userId,
            stocks, // Add the 5 stocks to the portfolio
        });

        // Save portfolio
        await portfolio.save();

        res.status(201).json({ message: 'Portfolio created successfully', portfolio });
    } catch (error) {
        res.status(500).json({ message: 'Error creating portfolio', error });
    }
};

// Get all portfolios for a user

exports.getUserPortfolios = async (req, res) => {
    try {
        const { userId } = req.params;
        const portfolios = await Portfolio.find({ user: userId }).populate('stocks');

        // Calculate the total value of each portfolio
        portfolios.forEach(async (portfolio) => {
            let totalValue = 0;
            for (let stock of portfolio.stocks) {
                const stockPrice = await fetchStockPrice(stock.ticker);
                totalValue += stockPrice * stock.quantity; // Quantity is assumed to be 1
            }
            portfolio.totalValue = totalValue;
        });

        res.status(200).json({ portfolios });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching portfolios', error });
    }
};
