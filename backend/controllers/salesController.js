const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const { Sequelize } = require('sequelize');

exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await Sale.findAll({
      attributes: [
        'productId',
        [Sequelize.fn('SUM', Sequelize.col('totalRevenue')), 'totalRevenue']
      ],
      include: [{ model: Product, attributes: ['name'] }],
      group: ['productId'],
      order: [[Sequelize.literal('totalRevenue'), 'DESC']],
      limit: 5
    });
    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await Sale.findAll({
      attributes: [
        'customerId',
        [Sequelize.fn('SUM', Sequelize.col('totalRevenue')), 'totalRevenue']
      ],
      include: [{ model: Customer, attributes: ['name', 'region', 'type'] }],
      group: ['customerId'],
      order: [[Sequelize.literal('totalRevenue'), 'DESC']],
      limit: 5
    });
    res.json(topCustomers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
