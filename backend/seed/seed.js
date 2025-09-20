const { faker } = require('@faker-js/faker');
const sequelize = require('../config/db');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // recreate tables
    console.log('Database synced ✅');

    // Customers
    const customers = await Customer.bulkCreate(
      Array.from({ length: 20 }).map(() => ({
        name: faker.person.fullName(),
        region: faker.location.state(),
        type: faker.helpers.arrayElement(['Individual', 'Business'])
      }))
    );

    // Products
    const products = await Product.bulkCreate(
      Array.from({ length: 10 }).map(() => ({
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500 }))
      }))
    );

    // Sales
    await Sale.bulkCreate(
      Array.from({ length: 200 }).map(() => {
        const product = faker.helpers.arrayElement(products);
        const customer = faker.helpers.arrayElement(customers);
        const quantity = faker.number.int({ min: 1, max: 10 });
        return {
          customerId: customer.id,
          productId: product.id,
          quantity,
          totalRevenue: product.price * quantity,
          reportDate: faker.date.between({
            from: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
            to: new Date()
          })
        };
      })
    );

    console.log('Seeding completed 🎉');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
