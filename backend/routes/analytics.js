const express = require('express');
const router = express.Router();
const { getTotalRevenue, getTopProducts, getTopCustomers } = require('../controllers/salesController');

router.get('/revenue', getTotalRevenue);
router.get('/top-products', getTopProducts);
router.get('/top-customers', getTopCustomers);

module.exports = router;
