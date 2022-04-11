const adminRouter = require("express").Router();
const acceptFile = require("connect-multiparty");
const { admin, productsAdd, promoCodes, promoCodesAdd, orders, ordersAction } = require("../controllers/admin");

adminRouter.get("/", admin);
adminRouter.post("/products-add", acceptFile(), productsAdd);
adminRouter.get("/promo-codes", promoCodes);
adminRouter.post("/promo-codes-add", promoCodesAdd);
adminRouter.get("/orders", orders);
adminRouter.patch("/orders-action/:orderObjId/:status", ordersAction);

module.exports = adminRouter;
