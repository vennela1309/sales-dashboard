// backend/routes/sales.js
const express = require("express");
const { Sale, Product, Customer } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

// 📌 Total revenue in date range
router.get("/revenue", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const totalRevenue = await Sale.sum("totalRevenue", {
      where: {
        reportDate: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    res.json({ totalRevenue: totalRevenue || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch revenue" });
  }
});
// 📌 Daily revenue trend
router.get("/revenue-trend", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const trend = await Sale.findAll({
      attributes: [
        [Sale.sequelize.fn("DATE", Sale.sequelize.col("reportDate")), "date"],
        [Sale.sequelize.fn("SUM", Sale.sequelize.col("totalRevenue")), "totalRevenue"]
      ],
      where: {
        reportDate: { [Op.between]: [new Date(startDate), new Date(endDate)] }
      },
      group: ["date"],
      order: [["date", "ASC"]]
    });

    res.json(trend);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch revenue trend" });
  }
});


// 📌 Top products
router.get("/top-products", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const products = await Sale.findAll({
      attributes: [
        "productId",
        [Sale.sequelize.fn("SUM", Sale.sequelize.col("totalRevenue")), "totalRevenue"],
      ],
      where: {
        reportDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      },
      include: [{ model: Product, attributes: ["name"] }],
      group: ["productId"],
      order: [[Sale.sequelize.literal("totalRevenue"), "DESC"]],
      limit: 5,
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top products" });
  }
});
// 📌 Region-wise revenue
router.get("/region-revenue", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const regionRevenue = await Sale.findAll({
      attributes: [
        [Sale.sequelize.col("Customer.region"), "region"],
        [Sale.sequelize.fn("SUM", Sale.sequelize.col("totalRevenue")), "totalRevenue"],
      ],
      where: {
        reportDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      },
      include: [{ model: Customer, attributes: [] }], // join but don’t fetch extra
      group: ["Customer.region"],
      order: [[Sale.sequelize.literal("totalRevenue"), "DESC"]],
    });

    res.json(regionRevenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch region revenue" });
  }
});

// 📌 Category-wise revenue
router.get("/category-revenue", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const categoryRevenue = await Sale.findAll({
      attributes: [
        [Sale.sequelize.col("Product.category"), "category"],
        [Sale.sequelize.fn("SUM", Sale.sequelize.col("totalRevenue")), "totalRevenue"],
      ],
      where: {
        reportDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      },
      include: [{ model: Product, attributes: [] }],
      group: ["Product.category"],
      order: [[Sale.sequelize.literal("totalRevenue"), "DESC"]],
    });

    res.json(categoryRevenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category revenue" });
  }
});


// 📌 Top customers
router.get("/top-customers", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const customers = await Sale.findAll({
      attributes: [
        "customerId",
        [Sale.sequelize.fn("SUM", Sale.sequelize.col("totalRevenue")), "totalRevenue"],
      ],
      where: {
        reportDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      },
      include: [{ model: Customer, attributes: ["name"] }],
      group: ["customerId"],
      order: [[Sale.sequelize.literal("totalRevenue"), "DESC"]],
      limit: 5,
    });

    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top customers" });
  }
});

module.exports = router;
