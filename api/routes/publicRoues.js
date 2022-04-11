const publicRouter = require("express").Router();

const { products } = require("../controllers/products");

publicRouter.get("/products", products);

module.exports = publicRouter;
