// const Portfolio = require('../models/Portfolio');
// const fetchStockPrice = require('../utils/fetchStockPrice');

// // Add a new portfolio with random stocks
// exports.addPortfolio = async (req, res) => {
//     try {
//         const { name, userId } = req.body;
//         const randomTickers = ['AAPL', 'GOOG', 'AMZN', 'MSFT', 'TSLA']; // Replace with API for more randomness
//         const stocks = [];

//         for (let ticker of randomTickers) {
//             const price = await fetchStockPrice(ticker);
//             stocks.push({ ticker, price, quantity: 1 });
//         }

//         const portfolio = new Portfolio({ name, user: userId, stocks });
//         await portfolio.save();

//         res.status(201).json({ message: 'Portfolio created successfully', portfolio });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating portfolio', error });
//     }
// };

// // Get all portfolios and calculate total value dynamically
// exports.getUserPortfolios = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const portfolios = await Portfolio.find({ user: userId });

//         for (let portfolio of portfolios) {
//             let totalValue = 0;
//             for (let stock of portfolio.stocks) {
//                 const stockPrice = await fetchStockPrice(stock.ticker);
//                 totalValue += stockPrice * stock.quantity;
//             }
//             portfolio.totalValue = totalValue;
//         }

//         res.status(200).json({ portfolios });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching portfolios', error });
//     }
// };
