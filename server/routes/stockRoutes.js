const express = require('express');
const { addStock, updateStock, deleteStock, getStocks } = require('../controllers/stockController');

const router = express.Router();

router.post('/add', addStock);
router.put('/update/:id', updateStock);
router.delete('/delete/:id', deleteStock);
router.get('/all', getStocks);

module.exports = router;
