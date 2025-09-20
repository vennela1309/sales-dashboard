const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('salesdb', 'root', 'vennela@1309', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
