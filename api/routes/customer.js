const customerRouter = require("express").Router();

const { customer, applyPromoCode } = require("../controllers/customer");

customerRouter.get("/", customer);
customerRouter.post("/apply-promo-code", applyPromoCode);

module.exports = customerRouter;
