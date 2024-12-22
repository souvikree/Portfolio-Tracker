const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');


exports.addStock = async (req, res) => {
    try {
        const { stockName, ticker, quantity, buyPrice, portfolioId } = req.body;
        const stock = new Stock({ stockName, ticker, quantity, buyPrice, portfolio: portfolioId });
        await stock.save();

        // Add stock to portfolio
        await Portfolio.findByIdAndUpdate(portfolioId, { $push: { stocks: stock._id } });

        res.status(201).json({ message: 'Stock added successfully', stock });
    } catch (error) {
        res.status(500).json({ message: 'Error adding stock', error });
    }
};


exports.updateStock = async (req, res) => {
    try {
        const { portfolioId, stockId } = req.params;
        const { ticker, price, quantity } = req.body;
        const portfolio = await Portfolio.findById(portfolioId);
        const stock = portfolio.stocks.id(stockId);

        stock.ticker = ticker || stock.ticker;
        stock.price = price || stock.price;
        stock.quantity = quantity || stock.quantity;

        await portfolio.save();
        res.status(200).json({ message: 'Stock updated successfully', portfolio });
    } catch (error) {
        res.status(500).json({ message: 'Error updating stock', error });
    }
};


exports.deleteStock = async (req, res) => {
    try {
        const { portfolioId, stockId } = req.params;
        const portfolio = await Portfolio.findById(portfolioId);
        portfolio.stocks.pull(stockId);

        await portfolio.save();
        res.status(200).json({ message: 'Stock deleted successfully', portfolio });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting stock', error });
    }
};




exports.getStocks = async (req, res) => {
    try {
        // You can filter by portfolio or user if necessary
        const stocks = await Stock.find();

        let totalValue = 0;

        // Calculate the total portfolio value by fetching real-time prices
        for (let stock of stocks) {
            const realTimePrice = await fetchStockPrice(stock.ticker);
            if (realTimePrice) {
                // Assume quantity is 1 for each stock
                totalValue += realTimePrice * stock.quantity; // Calculate total value
            } else {
                console.log(`Could not fetch price for ${stock.ticker}`);
            }
        }

        res.status(200).json({ stocks, totalValue }); // Return the stocks and total value
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stocks', error });
    }
};
