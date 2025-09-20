const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
  name: DataTypes.STRING,
  region: DataTypes.STRING,
  type: DataTypes.STRING
});

const Product = sequelize.define('Product', {
  name: DataTypes.STRING,
  category: DataTypes.STRING,
  price: DataTypes.FLOAT
});

const Sale = sequelize.define('Sale', {
  quantity: DataTypes.INTEGER,
  totalRevenue: DataTypes.FLOAT,
  reportDate: DataTypes.DATE
});

// Associations
Customer.hasMany(Sale, { foreignKey: 'customerId' });
Sale.belongsTo(Customer, { foreignKey: 'customerId' });

Product.hasMany(Sale, { foreignKey: 'productId' });
Sale.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { sequelize, Customer, Product, Sale };
