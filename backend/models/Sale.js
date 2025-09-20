const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./Customer');
const Product = require('./Product');

const Sale = sequelize.define('Sale', {
  quantity: DataTypes.INTEGER,
  totalRevenue: DataTypes.FLOAT,
  reportDate: DataTypes.DATE
});

// Relations
Sale.belongsTo(Customer, { foreignKey: 'customerId' });
Sale.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Sale;
