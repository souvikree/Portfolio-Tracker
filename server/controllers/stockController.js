const Stock = require('../models/Stock');
const getTheLatestStockPrice = require('../utils/getTheLatestStockPrice');

// Add a new stock
exports.addStock = async (req, res) => {
    try {
        const { stockName, ticker, quantity, buyPrice } = req.body;
        const stock = new Stock({ stockName, ticker, quantity, buyPrice });
        await stock.save();

        res.status(201).json({ message: 'Stock added successfully', stock });
    } catch (error) {
        res.status(500).json({ message: 'Error adding stock', error });
    }
};

// Update existing stock details
exports.updateStock = async (req, res) => {
    const { id } = req.params;  // Use the unique id instead of ticker
    const { stockName,ticker, quantity, buyPrice } = req.body;

    try {
        
        const updatedStock = await Stock.findByIdAndUpdate(
            id,  // Use _id here instead of ticker
            { stockName,ticker, quantity, buyPrice },
            { new: true }  // Return the updated document
        );

        // If stock is not found, return an error
        if (!updatedStock) {
            return res.status(404).json({ error: 'Stock not found' });
        }

        // Return the updated stock as a response
        res.json(updatedStock);
    } catch (error) {
        console.error('Error editing stock:', error.message);
        res.status(500).json({ error: 'Error editing stock' });
    }
};


// Delete a stock
exports.deleteStock = async (req, res) => {
    const { id } = req.params;  // Use the unique id instead of ticker
    try {
        
        const deletedStock = await Stock.findByIdAndDelete(id);

       
        if (!deletedStock) {
            return res.status(404).json({ error: 'Stock not found' });
        }

        res.json({ message: 'Stock deleted successfully', deletedStock });
    } catch (error) {
        console.error('Error deleting stock:', error.message);
        res.status(500).json({ error: 'Error deleting stock' });
    }
};


// Fetch all stocks and calculate the portfolio value
exports.getStocks = async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (error) {
        console.error('Error fetching stocks from database:', error.message);
        res.status(500).json({ error: 'Error fetching stocks from database' });
    }
};


exports.getStockPrice = async (req, res) => {
    const { ticker } = req.params;
    try {
        const priceData = await getTheLatestStockPrice.getTheLatestStockPrice(ticker);
        if (!priceData) {
            return res.status(404).json({ error: `Stock price data not found for ${ticker}` });
        }
        res.json(priceData);
    } catch (error) {
        // console.error(`Error fetching stock price for ${ticker}:`, error.message);
        res.status(500).json({ error: 'Error fetching stock price' });
    }
};