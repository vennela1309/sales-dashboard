const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
  name: DataTypes.STRING,
  region: DataTypes.STRING,
  type: DataTypes.STRING
});

module.exports = Customer;
