const express = require('express');
const { addStock, updateStock, deleteStock, getStocks, getStockPrice } = require('../controllers/stockController');
const router = express.Router();

const rateLimit = require('express-rate-limit');


const limiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 10, 
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true, 
    legacyHeaders: false, 
});


router.post('/', addStock);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);
router.get('/', getStocks);
router.get('/stocks/:ticker', getStockPrice );
module.exports = router;
