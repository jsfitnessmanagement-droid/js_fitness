const express = require('express');
const router = express.Router();
const { createOrder, recordSale } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/record-sale', protect, recordSale);

module.exports = router;
