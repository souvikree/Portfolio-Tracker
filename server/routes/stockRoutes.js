const express = require('express');
const { addStock, updateStock, deleteStock, getStocks, getStockPrice } = require('../controllers/stockController');
const router = express.Router();


router.post('/', addStock);
router.put('/:ticker', updateStock);
router.delete('/:ticker', deleteStock);
router.get('/', getStocks);
router.get('/stocks/:ticker', getStockPrice);
module.exports = router;
