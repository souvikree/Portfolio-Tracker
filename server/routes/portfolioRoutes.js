// // const express = require('express');
// // const router = express.Router();

// // const portfolioController = require('../controllers/portfolioController');
// // const authMiddleware = require('../middleware/authMiddleware');

// // // Route to add a new portfolio
// // router.post('/add', authMiddleware, portfolioController.addPortfolio);

// // // Route to get all portfolios for a user
// // router.get('/:userId', authMiddleware, portfolioController.getUserPortfolios);

// // module.exports = router;


// const express = require('express');
// const { addPortfolio, getUserPortfolios } = require('../controllers/portfolioController');
// const router = express.Router();

// router.post('/', addPortfolio);
// router.get('/:userId', getUserPortfolios);

// module.exports = router;
