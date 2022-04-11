const publicRouter = require("express").Router();

const { products, cartList } = require("../controllers/products");

publicRouter.get("/products", products);
publicRouter.get("/cart-list", cartList);

module.exports = publicRouter;
