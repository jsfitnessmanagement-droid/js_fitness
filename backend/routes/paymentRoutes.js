const express = require('express');
const router = express.Router();
const { createOrder, recordSale } = require('../controllers/paymentController');

router.post('/create-order', createOrder);
router.post('/record-sale', recordSale);

module.exports = router;
