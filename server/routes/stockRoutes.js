const express = require('express');
const { addStock, updateStock, deleteStock, getStocks, getStockPrice } = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();



router.post('/', addStock);
router.put('/:id', updateStock);
router.delete('/:id', deleteStock);
router.get('/', getStocks);
router.get('/stocks/:ticker', getStockPrice );
module.exports = router;
