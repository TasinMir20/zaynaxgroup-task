const customerRouter = require("express").Router();

const { customer, applyPromoCode, checkout } = require("../controllers/customer");

customerRouter.get("/", customer);
customerRouter.post("/apply-promo-code", applyPromoCode);
customerRouter.post("/checkout", checkout);

module.exports = customerRouter;
